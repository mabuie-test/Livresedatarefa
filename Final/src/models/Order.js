const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User' },
  guestEmail: String,
  reference: String,
  serviceType: String,
  academicLevel: String,
  pages: Number,
  style: String,
  methodology: String,
  area: String,
  extraInfo: String,
  urgencyDays: Number,
  urgent: Boolean,
  electronicsComplexity: String,
  basePriceMZN: Number,
  urgencySurchargeMZN: Number,
  totalPriceMZN: Number,
  status: { type: String, default: 'pendente' },
  mpesaProof: Object,
  mpesaReference: String,
  mpesaAmountReported: Number,
  invoiceFileId: mongoose.Schema.Types.ObjectId,
  invoicePdfUrl: String
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
