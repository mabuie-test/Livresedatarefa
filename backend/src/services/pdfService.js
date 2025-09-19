const PDFDocument = require('pdfkit');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

async function generateInvoicePdf(order){
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const filename = `invoice-${order.reference}.pdf`;
    const filepath = path.join(__dirname, '..', '..', 'uploads', filename);
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Referencia: ${order.reference}`);
    doc.text(`Cliente: ${order.userId}`);
    doc.text(`Servico: ${order.serviceType}`);
    doc.text(`Páginas: ${order.pages}`);
    doc.text(`Total: ${order.totalPriceMZN} MZN`);
    doc.moveDown();
    doc.text('Instrucoes de pagamento:');
    doc.text('Transferencia Mpesa/Emola para: 8XX XXX XXX');
    doc.text('Por favor use a referencia: ' + order.reference);
    doc.end();

    stream.on('finish', () => resolve({ filepath, filename }));
    stream.on('error', reject);
  });
}

module.exports = { generateInvoicePdf };
