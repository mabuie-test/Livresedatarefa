const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const { calcPrice } = require('../utils/priceCalculator');
const { generateInvoiceAndStore } = require('../services/pdfService');

// estimate
router.post('/estimate', (req, res) => {
  const est = calcPrice(req.body);
  res.json(est);
});

// create order - user
router.post('/', auth, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Login necessário' });
  const body = req.body;
  const price = calcPrice(body);
  const reference = `LIVRE-${Date.now().toString().slice(-8)}`;
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
    electronicsComplexity: body.electronicsComplexity,
    basePriceMZN: price.basePriceMZN,
    urgencySurchargeMZN: price.urgencySurchargeMZN,
    totalPriceMZN: price.totalPriceMZN
  });
  await order.save();

  // generate invoice and store to gridfs
  const file = await generateInvoiceAndStore(order);
  order.invoiceFileId = file._id;
  await order.save();

  res.json({ ok: true, order });
});

// guest create
router.post('/guest', async (req, res) => {
  const body = req.body;
  const price = calcPrice(body);
  const reference = `GUEST-${Date.now().toString().slice(-8)}`;
  const order = new Order({
    guestEmail: body.email,
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
    electronicsComplexity: body.electronicsComplexity,
    basePriceMZN: price.basePriceMZN,
    urgencySurchargeMZN: price.urgencySurchargeMZN,
    totalPriceMZN: price.totalPriceMZN
  });
  await order.save();
  const file = await generateInvoiceAndStore(order);
  order.invoiceFileId = file._id;
  await order.save();
  res.json({ ok: true, order });
});

// upload mpesa proof
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/:id/mpesa-proof', auth, upload.single('proof'), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  // owner or admin check
  if (order.userId?.toString() !== req.user?.id && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Nao autorizado' });
  }
  // store on disk and record meta
  order.mpesaProof = {
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
    uploadedAt: new Date()
  };
  order.mpesaReference = req.body.mpesaReference;
  order.mpesaAmountReported = Number(req.body.amount || 0);
  order.status = 'pendente';
  await order.save();
  res.json({ ok: true, order });
});

// get order by id
router.get('/:id', auth, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
  if (order.userId?.toString() !== req.user?.id && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Nao autorizado' });
  }
  res.json({ order });
});

// list user orders
router.get('/', auth, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Login necessário' });
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ orders });
});

module.exports = router;
