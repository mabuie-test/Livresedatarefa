const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const { calcPrice } = require('../utils/priceCalculator');
const { generateInvoicePdfAndStore } = require('../services/pdfService');
const storage = require('../services/storage');

const uploadDir = path.join(__dirname, '..', 'tmp');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storageLocal = multer.diskStorage({
  destination: (req,file,cb) => cb(null, uploadDir),
  filename: (req,file,cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storageLocal, limits: { fileSize: 10*1024*1024 } });

// estimate
router.post('/estimate', (req,res) => {
  const est = calcPrice(req.body);
  res.json(est);
});

// authenticated create
router.post('/', auth, async (req,res) => {
  try {
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

    // generate invoice PDF and store in GridFS
    const pdfResult = await generateInvoicePdfAndStore(order);
    order.invoiceFileId = pdfResult.fileId;
    await order.save();

    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar encomenda' });
  }
});

// guest create
router.post('/guest', async (req,res) => {
  try {
    const body = req.body;
    if (!body.email) return res.status(400).json({ error: 'Email é obrigatório' });
    const price = calcPrice(body);
    const reference = `LIVRE-G-${Date.now().toString().slice(-6)}`;
    const order = new Order({
      userId: null,
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
      totalPriceMZN: price.totalPriceMZN,
      guestEmail: body.email,
      guestPhone: body.whatsapp || null,
      status: 'pendente'
    });
    await order.save();

    const pdfResult = await generateInvoicePdfAndStore(order);
    order.invoiceFileId = pdfResult.fileId;
    await order.save();

    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar encomenda de convidado' });
  }
});

// guest get by reference + email
router.get('/guest/:reference', async (req,res) => {
  try {
    const { reference } = req.params;
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email necessário' });
    const order = await Order.findOne({ reference, guestEmail: email });
    if (!order) return res.status(404).json({ error: 'Encomenda não encontrada' });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro' });
  }
});

// authenticated mpesa-proof upload
router.post('/:id/mpesa-proof', auth, upload.single('proof'), async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
    if (order.userId?.toString() !== req.user.id) return res.status(403).json({ error: 'Nao autorizado' });

    const tempPath = req.file.path;
    const fileId = await storage.uploadFromPath(tempPath, req.file.originalname, req.file.mimetype);
    fs.unlinkSync(tempPath);

    order.mpesaProof = {
      fileId,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
      uploaderId: req.user.id
    };
    order.mpesaReference = req.body.mpesaReference;
    order.mpesaAmountReported = Number(req.body.amount || 0);
    order.status = 'pendente';
    await order.save();

    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no upload' });
  }
});

// guest mpesa-proof upload by reference + email
router.post('/guest/:reference/mpesa-proof', upload.single('proof'), async (req,res) => {
  try {
    const { reference } = req.params;
    const email = req.body.email;
    if (!email) return res.status(400).json({ error: 'Email do cliente necessario' });
    const order = await Order.findOne({ reference, guestEmail: email });
    if (!order) return res.status(404).json({ error: 'Encomenda nao encontrada' });

    const tempPath = req.file.path;
    const fileId = await storage.uploadFromPath(tempPath, req.file.originalname, req.file.mimetype);
    fs.unlinkSync(tempPath);

    order.mpesaProof = {
      fileId,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
      uploaderId: null
    };
    order.mpesaReference = req.body.mpesaReference;
    order.mpesaAmountReported = Number(req.body.amount || 0);
    order.status = 'pendente';
    await order.save();

    res.json({ ok: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao enviar comprovativo' });
  }
});

// authenticated get single
router.get('/:id', auth, async (req,res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido nao encontrado' });
    if (order.userId?.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Nao autorizado' });
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro' });
  }
});

// authenticated list
router.get('/', auth, async (req,res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro' });
  }
});

module.exports = router;
