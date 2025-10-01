const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const filesRoutes = require('./routes/files');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static uploads (optional)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// connect to mongo (ensure env var set)
const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error('MONGO_URI not defined in env');
  process.exit(1);
}
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => { console.error('Mongo connection error', err); process.exit(1); });

// routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/files', filesRoutes);

// basic root
app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
