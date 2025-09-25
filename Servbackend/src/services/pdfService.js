const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const os = require('os');
const storage = require('./storage');

async function generateInvoicePdfAndStore(order) {
  const filename = `invoice-${order.reference}.pdf`;
  const tmpPath = path.join(os.tmpdir(), filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(tmpPath);
    doc.pipe(stream);

    doc.fontSize(18).text('LIVRESEDATAREFA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Referencia: ${order.reference}`);
    doc.text(`Servico: ${order.serviceType}`);
    doc.text(`Nível: ${order.academicLevel}`);
    doc.text(`Páginas: ${order.pages}`);
    doc.text(`Total: ${order.totalPriceMZN} MZN`);
    doc.moveDown();
    doc.text('Instruções de pagamento:');
    doc.text('Pagamento por Mpesa/Emola para: 8XX XXX XXX');
    doc.text('Use a referência: ' + order.reference);

    doc.end();

    stream.on('finish', async () => {
      try {
        const fileId = await storage.uploadFromPath(tmpPath, filename, 'application/pdf');
        fs.unlinkSync(tmpPath);
        resolve({ fileId, filename });
      } catch (err) {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        reject(err);
      }
    });

    stream.on('error', (err) => {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      reject(err);
    });
  });
}

module.exports = { generateInvoicePdfAndStore };
