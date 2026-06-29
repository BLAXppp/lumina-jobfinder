const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../services/otpService');
const auth = require('../middleware/auth');

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'signup' } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    
    if (purpose === 'signup') {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
    }
    
    const result = await sendOTP(email, purpose);
    if (result.success) {
      res.json({ success: true, message: 'OTP sent to your email' });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify & Register
router.post('/verify-and-register', async (req, res) => {
  try {
    const { name, email, password, role, otp } = req.body;
    
    const otpResult = await verifyOTP(email, otp, 'signup');
    if (!otpResult.success) return res.status(400).json({ message: otpResult.message });
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const user = new User({ name, email, password, role });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    if (otp) {
      const otpResult = await verifyOTP(email, otp, 'login');
      if (!otpResult.success) return res.status(400).json({ message: otpResult.message });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send Login OTP
router.post('/send-login-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account found' });
    
    const result = await sendOTP(email, 'login');
    if (result.success) {
      res.json({ success: true, message: 'Login OTP sent' });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;