const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const logsRoutes = require('./routes/logs');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/', logsRoutes);

app.get('/', (req,res) => res.json({ ok: true, service: 'livresedatarefa backend' }));

// serve files from GridFS
app.get('/api/files/:id', async (req, res) => {
  try {
    const storage = require('./services/storage');
    const info = await storage.getFileInfo(req.params.id);
    if (!info) return res.status(404).json({ error: 'Ficheiro não encontrado' });
    res.setHeader('Content-Type', info.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${info.filename}"`);
    const stream = storage.getFileStream(req.params.id);
    stream.pipe(res);
  } catch (err) {
    console.error('file serve error', err);
    res.status(400).json({ error: 'Erro ao servir ficheiro' });
  }
});

module.exports = app;
