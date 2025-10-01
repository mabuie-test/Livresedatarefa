// usage: node src/scripts/uploadToGridFS.js <orderIdOrNull> /path/to/file.pdf
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Order = require('../models/Order');

async function run(orderId, fileOnDisk) {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'fs' });
  const rs = fs.createReadStream(fileOnDisk);
  const filename = path.basename(fileOnDisk);
  const upload = bucket.openUploadStream(filename, { contentType: 'application/pdf' });
  rs.pipe(upload).on('finish', async (file) => {
    console.log('Uploaded id=', file._id.toString());
    if (orderId && orderId !== 'null') {
      await Order.findByIdAndUpdate(orderId, { invoiceFileId: file._id });
      console.log('Order updated', orderId);
    }
    process.exit(0);
  }).on('error', e => { console.error(e); process.exit(1); });
}

const [,, orderId, fileOnDisk] = process.argv;
if (!fileOnDisk) { console.error('Usage: node uploadToGridFS.js <orderId|null> /path/to/file.pdf'); process.exit(1); }
run(orderId, fileOnDisk).catch(e => { console.error(e); process.exit(1); });
