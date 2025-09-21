const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const auth = require('../middleware/auth'); // opcional, se quiser logs com user

// aceitar logs sem autenticação (mobile pode enviar)
router.post('/api/logs', async (req, res) => {
  try {
    const payload = req.body;
    // opcional: limitar tamanho
    const doc = new Log({ ip: req.ip, payload });
    await doc.save();
    res.json({ ok: true, saved: true });
  } catch (err) {
    console.error('Failed to save logs', err);
    res.status(500).json({ error: 'failed to save logs' });
  }
});

module.exports = router;
