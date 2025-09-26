// server.js
require('dotenv').config();
const express = require('express');     // <--- ADICIONADO
const path = require('path');           // <--- ADICIONADO

const app = require('./app');
const connectDB = require('./config/db');
const storage = require('./services/storage');
const filesRouter = require('./routes/files');

app.use('/api/files', filesRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    const conn = await connectDB(process.env.MONGO_URI);
    // storage.init espera a db; mantém conforme o teu serviço
    storage.init(conn.connection.db);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();
