const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
};

const sendOTP = async (email, purpose = 'signup') => {
  try {
    // Delete old OTPs for this email
    await OTP.deleteMany({ email, purpose });
    
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await OTP.create({ email, otp, purpose, expiresAt });
    
    const subject = purpose === 'signup' 
      ? '🔐 Verify Your Email - Lumina JobFinder' 
      : '🔐 Login OTP - Lumina JobFinder';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: #0f172a; }
        .container { max-width: 500px; margin: 0 auto; background: #1e293b; border-radius: 20px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { padding: 40px; text-align: center; }
        .otp-box { background: #0f172a; border: 2px solid #10b981; border-radius: 16px; padding: 30px; margin: 20px 0; }
        .otp { font-size: 48px; font-weight: bold; color: #10b981; letter-spacing: 8px; }
        .timer { color: #94a3b8; font-size: 14px; margin-top: 15px; }
        .warning { color: #f87171; font-size: 12px; margin-top: 20px; }
        .footer { background: #0f172a; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 LUMINA</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0;">Secure Verification</p>
        </div>
        <div class="content">
          <p style="color: #e2e8f0; font-size: 16px;">Your verification code is:</p>
          <div class="otp-box">
            <div class="otp">${otp}</div>
            <div class="timer">⏱️ Expires in 10 minutes</div>
          </div>
          <p style="color: #94a3b8; font-size: 14px;">Enter this code to complete your ${purpose === 'signup' ? 'registration' : 'login'}.</p>
          <p class="warning">⚠️ Never share this code with anyone. Lumina will never ask for your OTP.</p>
        </div>
        <div class="footer">
          <p>© 2025 Lumina JobFinder • Auto-Generated Email</p>
        </div>
      </div>
    </body>
    </html>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Lumina JobFinder <noreply@lumina.com>',
      to: email,
      subject,
      html,
    });
    
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('OTP send error:', error);
    return { success: false, error: error.message };
  }
};

const verifyOTP = async (email, otp, purpose = 'signup') => {
  try {
    const record = await OTP.findOne({ email, otp, purpose, verified: false });
    
    if (!record) {
      return { success: false, message: 'Invalid OTP' };
    }
    
    if (record.expiresAt < new Date()) {
      return { success: false, message: 'OTP expired' };
    }
    
    record.verified = true;
    await record.save();
    
    return { success: true, message: 'OTP verified' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTP, verifyOTP, generateOTP };