const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  recipientEmail: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'failed'], default: 'sent' },
  tag: { type: String },
  isBulk: { type: Boolean, default: false },
  resumeAttached: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('EmailLog', emailLogSchema);