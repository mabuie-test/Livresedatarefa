const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-admin-${file.originalname}`)
});
const upload = multer({ storage });

// list orders (admin)
router.get('/orders', auth, adminAuth, async (req, res) => {
  const q = req.query.q || '';
  const filter = {};
  if (q) filter.reference = { $regex: q, $options: 'i' };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
  res.json({ orders });
});

// confirm payment
router.post('/orders/:id/confirm-payment', auth, adminAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  order.payment = {
    confirmed: true,
    confirmedBy: req.user.id,
    confirmedAt: new Date(),
    method: 'Mpesa'
  };
  order.status = 'pago';
  order.paidAt = new Date();
  await order.save();
  // TODO: notificar cliente por email/whatsapp
  res.json({ ok: true, message: 'Pagamento confirmado', order });
});

// reject payment with note
router.post('/orders/:id/reject-payment', auth, adminAuth, async (req, res) => {
  const { note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  // add a simple log (could be separate collection)
  order.status = 'pendente';
  await order.save();
  res.json({ ok: true, message: 'Comprovativo rejeitado', note });
});

// upload final file and mark completed
router.post('/orders/:id/upload-final', auth, adminAuth, upload.single('file'), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  order.adminFileUrl = `/uploads/${req.file.filename}`;
  order.status = 'concluído';
  await order.save();
  res.json({ ok: true, message: 'Ficheiro enviado', order });
});

// mark sent
router.post('/orders/:id/mark-sent', auth, adminAuth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  order.status = 'enviado';
  await order.save();
  res.json({ ok: true, message: 'Pedido marcado como enviado', order });
});

module.exports = router;
