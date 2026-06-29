const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  status: { type: String, enum: ['pending', 'sent', 'viewed', 'rejected'], default: 'pending' },
  customMessage: { type: String },
  emailSent: { type: Boolean, default: false },
  emailContent: { type: String },
  sentAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);