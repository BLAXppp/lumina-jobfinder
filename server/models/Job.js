const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  tags: [{ type: String }],
  location: { type: String, required: true },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: '$' }
  },
  type: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'], default: 'full-time' },
  vacancies: { type: Number, default: 1 },
  status: { type: String, enum: ['active', 'closed', 'paused'], default: 'active' },
  applicants: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);