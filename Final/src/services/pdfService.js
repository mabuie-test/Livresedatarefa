const PDFDocument = require('pdfkit');
const mongoose = require('mongoose');

// create PDF as Buffer and save to GridFS, return file doc
async function generateInvoiceAndStore(order){
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];
  doc.on('data', c => chunks.push(c));
  doc.fontSize(20).text('Invoice / Recibo', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Referência: ${order.reference}`);
  doc.text(`Serviço: ${order.serviceType}`);
  doc.text(`Total (MZN): ${order.totalPriceMZN}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();
  doc.text('Instruções de pagamento: transferir via Mpesa/Emola conforme as instruções enviadas no email e no recibo.');
  doc.end();

  const pdfBuffer = Buffer.concat(chunks);

  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'fs' });
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(`invoice-${order.reference}.pdf`, { contentType: 'application/pdf' });
    uploadStream.end(pdfBuffer, (err, file) => {
      if (err) return reject(err);
      resolve(file);
    });
  });
}

module.exports = { generateInvoiceAndStore };
