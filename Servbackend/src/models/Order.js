const mongoose = require('mongoose');
const { Schema } = mongoose;

const mpesaProofSchema = new Schema({
  fileId: String,
  filename: String,
  mimeType: String,
  size: Number,
  uploadedAt: Date,
  uploaderId: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { _id: false });

const paymentSchema = new Schema({
  confirmed: { type: Boolean, default: false },
  confirmedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  confirmedAt: Date,
  method: { type: String, default: 'Mpesa' }
}, { _id: false });

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  reference: { type: String, required: true, unique: true },
  serviceType: String,
  academicLevel: String,
  pages: Number,
  style: String,
  methodology: String,
  area: String,
  extraInfo: String,
  urgencyDays: Number,
  urgent: Boolean,
  basePriceMZN: Number,
  urgencySurchargeMZN: Number,
  totalPriceMZN: Number,
  currency: { type: String, default: 'MZN' },
  mpesaProof: mpesaProofSchema,
  mpesaReference: String,
  mpesaAmountReported: Number,
  payment: paymentSchema,
  invoiceFileId: String,
  adminFileId: String,
  guestEmail: String,
  guestPhone: String,
  status: { type: String, enum: ['pendente','pago','iniciado','concluído','enviado','cancelado'], default: 'pendente' },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
