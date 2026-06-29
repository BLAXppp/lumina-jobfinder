const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// @route   GET /api/companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/companies
router.post('/', auth, async (req, res) => {
  try {
    const company = new Company({ ...req.body, createdBy: req.user._id });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id/jobs
router.get('/:id/jobs', async (req, res) => {
  try {
    const jobs = await Job.find({ company: req.params.id, status: 'active' });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;