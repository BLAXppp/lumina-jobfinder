const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  website: { type: String },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  location: { type: String, required: true },
  logo: { type: String },
  size: { 
    type: String, 
    enum: ['1-10', '11-50', '51-200', '201-500', '500+', '1,001-5,000', '5,001-10,000', '10,000+'], 
    default: '1-10' 
  },
  founded: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);