// backend/src/routes/files.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth'); // ajusta conforme tens
const Order = require('../models/Order');

const router = express.Router();

// GET /api/files/:id
// - if :id is an order id -> serve that order's invoice (invoiceFileId or invoicePdfUrl)
// - if :id is a GridFS _id -> stream from GridFS
// - if :id is a filename -> serve from uploads folder
router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    // 1. If id looks like an ObjectId, try to find order
    if (ObjectId.isValid(id)) {
      const maybeOrder = await Order.findById(id).lean();
      if (maybeOrder) {
        // allow owner or admin
        if (maybeOrder.userId?.toString() !== req.user.id && req.user.role !== 'admin') {
          return res.status(403).json({ error: 'Nao autorizado' });
        }

        // serve GridFS if invoiceFileId
        if (maybeOrder.invoiceFileId) {
          return streamGridFS(maybeOrder.invoiceFileId, res);
        }
        // else serve disk file if invoicePdfUrl
        if (maybeOrder.invoicePdfUrl) {
          const filename = path.basename(maybeOrder.invoicePdfUrl);
          const diskPath = path.join(__dirname, '..', 'uploads', filename);
          if (fs.existsSync(diskPath)) return res.sendFile(diskPath);
          return res.status(404).json({ error: 'Ficheiro nao encontrado no disco' });
        }
        return res.status(404).json({ error: 'Pedido sem arquivo de invoice' });
      }
    }

    // 2. If param is a GridFS file id
    if (ObjectId.isValid(id)) {
      const found = await streamGridFS(id, res);
      if (found) return;
    }

    // 3. Try to locate file in uploads by filename
    const diskPath = path.join(__dirname, '..', 'uploads', id);
    if (fs.existsSync(diskPath)) return res.sendFile(diskPath);

    return res.status(404).json({ error: 'Ficheiro não encontrado' });
  } catch (err) {
    console.error('Erro ao servir ficheiro', err);
    return res.status(500).json({ error: 'Erro interno' });
  }
});

async function streamGridFS(id, res) {
  try {
    const db = mongoose.connection.db;
    if (!db) { res.status(500).json({ error: 'DB nao inicializado' }); return true; }
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'fs' });
    const _id = typeof id === 'string' ? new ObjectId(id) : id;

    const filesColl = db.collection('fs.files');
    const fileDoc = await filesColl.findOne({ _id });
    if (!fileDoc) {
      // não encontrado no GridFS
      return false;
    }

    res.setHeader('Content-Type', fileDoc.contentType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileDoc.filename}"`);
    const downloadStream = bucket.openDownloadStream(_id);
    downloadStream.on('error', (e) => {
      console.error('GridFS stream error', e);
      if (!res.headersSent) res.status(500).end();
    });
    downloadStream.pipe(res);
    return true;
  } catch (e) {
    console.error('streamGridFS error', e);
    if (!res.headersSent) res.status(500).json({ error: 'Erro streaming ficheiro' });
    return true;
  }
}

module.exports = router;
