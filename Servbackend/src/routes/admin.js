const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = require('../services/storage');

const uploadDir = path.join(__dirname, '..', 'tmp');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storageLocal = multer.diskStorage({
  destination: (req,file,cb) => cb(null, uploadDir),
  filename: (req,file,cb) => cb(null, `${Date.now()}-admin-${file.originalname}`)
});
const upload = multer({ storage: storageLocal });

router.get('/orders', auth, adminAuth, async (req,res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(500);
  res.json({ orders });
});

router.post('/orders/:id/confirm-payment', auth, adminAuth, async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
    order.payment = { confirmed: true, confirmedBy: req.user.id, confirmedAt: new Date(), method: 'Mpesa' };
    order.status = 'pago';
    order.paidAt = new Date();
    await order.save();
    res.json({ ok: true, order });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro' }); }
});

router.post('/orders/:id/upload-final', auth, adminAuth, upload.single('file'), async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
    const tempPath = req.file.path;
    const fileId = await storage.uploadFromPath(tempPath, req.file.originalname, req.file.mimetype);
    fs.unlinkSync(tempPath);
    order.adminFileId = fileId;
    order.status = 'concluído';
    await order.save();
    res.json({ ok: true, order });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro' }); }
});

router.post('/orders/:id/mark-sent', auth, adminAuth, async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    order.status = 'enviado';
    await order.save();
    res.json({ ok: true, order });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Erro' }); }
});

module.exports = router;
