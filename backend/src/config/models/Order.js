const mongoose = require('mongoose');
const { Schema } = mongoose;

const mpesaProofSchema = new Schema({
  url: String,
  filename: String,
  mimeType: String,
  size: Number,
  uploadedAt: Date,
  uploaderId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const paymentSchema = new Schema({
  confirmed: { type: Boolean, default: false },
  confirmedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  confirmedAt: Date,
  method: { type: String, default: 'Mpesa' }
}, { _id: false });

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reference: { type: String, required: true, unique: true },
  serviceType: { type: String, required: true }, // 'redacao','consultoria','projeto-eletronica'
  academicLevel: String,
  pages: Number,
  style: String,
  methodology: String,
  area: String,
  extraInfo: String,
  urgencyDays: Number,
  urgent: { type: Boolean, default: false },
  basePriceMZN: Number,
  urgencySurchargeMZN: Number,
  totalPriceMZN: Number,
  currency: { type: String, default: 'MZN' },
  mpesaProof: mpesaProofSchema,
  mpesaReference: String,
  mpesaAmountReported: Number,
  payment: paymentSchema,
  status: { 
    type: String, 
    enum: ['pendente','pago','iniciado','concluído','enviado','cancelado'],
    default: 'pendente'
  },
  invoicePdfUrl: String,
  adminFileUrl: String,
  createdAt: { type: Date, default: Date.now },
  paidAt: Date
});

module.exports = mongoose.model('Order', orderSchema);
