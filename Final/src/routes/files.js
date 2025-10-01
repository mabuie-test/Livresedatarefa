const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const auth = require('../middleware/auth');
const Order = require('../models/Order');

const router = express.Router();

router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    if (ObjectId.isValid(id)) {
      const maybeOrder = await Order.findById(id).lean();
      if (maybeOrder) {
        if (maybeOrder.userId?.toString() !== req.user?.id && req.user?.role !== 'admin') {
          return res.status(403).json({ error: 'Nao autorizado' });
        }
        if (maybeOrder.invoiceFileId) {
          return streamGridFS(maybeOrder.invoiceFileId, res);
        }
        if (maybeOrder.invoicePdfUrl) {
          const filename = path.basename(maybeOrder.invoicePdfUrl);
          const diskPath = path.join(__dirname, '..', '..', 'uploads', filename);
          if (fs.existsSync(diskPath)) return res.sendFile(diskPath);
          return res.status(404).json({ error: 'Ficheiro nao encontrado no disco' });
        }
        return res.status(404).json({ error: 'Pedido sem arquivo de invoice' });
      }
    }

    if (ObjectId.isValid(id)) {
      const found = await streamGridFS(id, res);
      if (found) return;
    }

    const diskPath = path.join(__dirname, '..', '..', 'uploads', id);
    if (fs.existsSync(diskPath)) return res.sendFile(diskPath);

    return res.status(404).json({ error: 'Ficheiro não encontrado' });
  } catch (err) {
    console.error('file serve error', err);
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
    const f = await filesColl.findOne({ _id });
    if (!f) return false;
    res.setHeader('Content-Type', f.contentType || 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${f.filename}"`);
    const stream = bucket.openDownloadStream(_id);
    stream.on('error', (e) => {
      console.error('gridfs stream error', e);
      if (!res.headersSent) res.status(500).end();
    });
    stream.pipe(res);
    return true;
  } catch (e) {
    console.error('streamGridFS error', e);
    if (!res.headersSent) res.status(500).json({ error: 'Erro streaming ficheiro' });
    return true;
  }
}

module.exports = router;
