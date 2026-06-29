const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const { sendApplicationEmail, generateApplicationTemplate } = require('../services/emailService');

router.get('/', async (req, res) => {
  try {
    const { tags, location, type } = req.query;
    let query = { status: 'active' };
    if (tags) query.tags = { $in: tags.split(',') };
    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };

    const jobs = await Job.find(query)
      .populate('company', 'name email ownerEmail website location industry')
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/apply', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ user: req.user._id, job: job._id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = new Application({
      user: req.user._id,
      job: job._id,
      company: job.company._id,
      status: 'pending',
      customMessage: req.body.message || '',
    });

    // Send auto-email with resume
    const user = req.user;
    const company = job.company;
    const html = generateApplicationTemplate(user, job, company, req.body.message);
    
    const emailResult = await sendApplicationEmail({
      to: company.ownerEmail,
      subject: `Job Application: ${user.name} for ${job.title}`,
      html,
      user,
      userId: user._id,
      companyId: company._id,
      jobId: job._id,
      tag: job.tags[0],
    });

    if (emailResult.success) {
      application.emailSent = true;
      application.emailContent = html;
      application.status = 'sent';
      application.sentAt = new Date();
    }

    await application.save();
    res.json({ 
      success: true, 
      emailSent: emailResult.success,
      message: emailResult.success ? 'Application & Resume sent!' : 'Application saved but email failed'
    });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/applications', auth, async (req, res) => {
  try {
    const apps = await Application.find({ user: req.user._id })
      .populate('job', 'title tags')
      .populate('company', 'name ownerEmail')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;