const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  createdAt: { type: Date, default: Date.now },
  ip: String,
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  payload: Schema.Types.Mixed
});

module.exports = mongoose.model('Log', logSchema);
