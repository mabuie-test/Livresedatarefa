const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

router.post('/api/logs', async (req,res) => {
  try {
    const payload = req.body;
    const doc = new Log({ ip: req.ip, payload });
    await doc.save();
    res.json({ ok: true });
  } catch (err) {
    console.error('logs save err', err);
    res.status(500).json({ error: 'failed to save logs' });
  }
});

module.exports = router;
