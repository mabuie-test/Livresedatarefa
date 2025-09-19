const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const { calcPrice } = require('../utils/priceCalculator');
const { generateInvoicePdf } = require('../services/pdfService');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Estimate price
router.post('/estimate', (req, res) => {
  const est = calcPrice(req.body);
  res.json(est);
});

// Create order (generates reference & invoice PDF)
router.post('/', auth, async (req, res) => {
  const body = req.body;
  const price = calcPrice(body);
  const reference = `LIVRE-${Date.now().toString().slice(-6)}`;
  const order = new Order({
    userId: req.user.id,
    reference,
    serviceType: body.serviceType,
    academicLevel: body.academicLevel,
    pages: body.pages,
    style: body.style,
    methodology: body.methodology,
    area: body.area,
    extraInfo: body.extraInfo,
    urgencyDays: body.urgencyDays,
    urgent: body.urgent,
    basePriceMZN: price.basePriceMZN,
    urgencySurchargeMZN: price.urgencySurchargeMZN,
    totalPriceMZN: price.totalPriceMZN
  });
  await order.save();

  // generate invoice PDF (síncrono simples)
  const pdfResult = await generateInvoicePdf(order);
  order.invoicePdfUrl = `/uploads/${path.basename(pdfResult.filepath)}`;
  await order.save();

  res.json({ ok: true, order });
});

// Upload mpesa proof
router.post('/:id/mpesa-proof', auth, upload.single('proof'), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  if (order.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Nao autorizado' });

  order.mpesaProof = {
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date(),
    uploaderId: req.user.id
  };
  order.mpesaReference = req.body.mpesaReference;
  order.mpesaAmountReported = Number(req.body.amount || 0);
  order.status = 'pendente';
  await order.save();

  res.json({ ok: true, message: 'Comprovativo recebido', order });
});

router.get('/:id', auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Nao autorizado' });
  res.json({ order });
});

router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ orders });
});

module.exports = router;
