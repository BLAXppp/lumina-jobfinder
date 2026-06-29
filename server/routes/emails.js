const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const EmailLog = require('../models/EmailLog');
const auth = require('../middleware/auth');
const { sendApplicationEmail, generateApplicationTemplate } = require('../services/emailService');

router.post('/auto-send', auth, async (req, res) => {
  try {
    const { jobId, message } = req.body;
    const job = await Job.findById(jobId).populate('company');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const user = req.user;
    const company = job.company;
    const html = generateApplicationTemplate(user, job, company, message);

    const result = await sendApplicationEmail({
      to: company.ownerEmail,
      subject: `Job Application: ${user.name} for ${job.title}`,
      html,
      user,
      userId: user._id,
      companyId: company._id,
      jobId: job._id,
      tag: job.tags[0],
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/bulk', auth, async (req, res) => {
  try {
    const { tag, message } = req.body;
    const user = req.user;

    const jobs = await Job.find({ tags: { $in: [tag] }, status: 'active' }).populate('company');
    if (jobs.length === 0) return res.status(404).json({ message: 'No jobs found matching this tag' });

    const results = [];
    for (const job of jobs) {
      const company = job.company;
      const html = generateApplicationTemplate(user, job, company, message);

      const result = await sendApplicationEmail({
        to: company.ownerEmail,
        subject: `Job Application: ${user.name} for ${job.title}`,
        html,
        user,
        userId: user._id,
        companyId: company._id,
        jobId: job._id,
        tag,
        isBulk: true,
      });

      results.push({ company: company.name, success: result.success });
    }

    res.json({ success: true, sent: results.length, results });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const logs = await EmailLog.find({ user: req.user._id })
      .populate('company', 'name')
      .populate('job', 'title')
      .sort({ createdAt: -1 })
      .limit(50);
    
    const formatted = logs.map(log => ({
      _id: log._id,
      companyName: log.company?.name || 'Unknown',
      jobTitle: log.job?.title || 'General Application',
      status: log.status,
      sentAt: log.createdAt,
      isBulk: log.isBulk,
      resumeAttached: log.resumeAttached,
    }));
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;