const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate HTML Resume Template
const generateResumeHTML = (user) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 40px; background: #f5f5f5; }
    .resume { max-width: 800px; margin: 0 auto; background: white; padding: 50px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
    .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
    .name { font-size: 36px; font-weight: 700; color: #000; margin: 0; letter-spacing: -1px; }
    .title { font-size: 16px; color: #666; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; }
    .contact { display: flex; gap: 20px; margin-top: 15px; font-size: 13px; color: #333; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #999; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 15px; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: #000; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; }
    .experience-item { margin-bottom: 20px; }
    .exp-title { font-weight: 600; font-size: 15px; color: #000; }
    .exp-company { color: #666; font-size: 13px; }
    .exp-date { color: #999; font-size: 12px; }
    .exp-desc { color: #444; font-size: 13px; line-height: 1.6; margin-top: 8px; }
    .bio { color: #444; font-size: 14px; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="resume">
    <div class="header">
      <h1 class="name">${user.name}</h1>
      <p class="title">${user.role === 'user' ? 'Job Seeker' : 'Professional'}</p>
      <div class="contact">
        ${user.email ? `<span>📧 ${user.email}</span>` : ''}
        ${user.phone ? `<span>📱 ${user.phone}</span>` : ''}
        ${user.location ? `<span>📍 ${user.location}</span>` : ''}
      </div>
    </div>
    
    ${user.bio ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="bio">${user.bio}</p>
    </div>
    ` : ''}
    
    ${user.skills?.length ? `
    <div class="section">
      <div class="section-title">Skills</div>
      <div class="skills">
        ${user.skills.map(s => `<span class="skill">${s}</span>`).join('')}
      </div>
    </div>
    ` : ''}
    
    ${user.experience ? `
    <div class="section">
      <div class="section-title">Experience</div>
      <div class="experience-item">
        <div class="exp-title">${user.experience}</div>
        <div class="exp-desc">Professional experience in relevant field with demonstrated expertise.</div>
      </div>
    </div>
    ` : ''}
    
    ${user.preferredTags?.length ? `
    <div class="section">
      <div class="section-title">Job Preferences</div>
      <div class="skills">
        ${user.preferredTags.map(t => `<span class="skill" style="background:#333;">${t}</span>`).join('')}
      </div>
    </div>
    ` : ''}
  </div>
</body>
</html>
  `;
};

const sendApplicationEmail = async ({ to, subject, html, user, userId, companyId, jobId, tag, isBulk = false }) => {
  try {
    console.log('📧 Sending email to:', to);
    
    // Generate resume attachment
    const resumeHTML = generateResumeHTML(user);
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Lumina JobFinder <noreply@lumina.com>',
      to,
      subject,
      html,
      attachments: [
        {
          filename: `${user.name.replace(/\s+/g, '_')}_Resume.html`,
          content: resumeHTML,
          contentType: 'text/html',
        }
      ]
    });

    console.log('✅ Email sent! Message ID:', info.messageId);

    const log = new EmailLog({
      user: userId,
      company: companyId,
      job: jobId,
      recipientEmail: to,
      subject,
      content: html,
      status: 'sent',
      tag,
      isBulk,
      resumeAttached: true,
    });
    await log.save();

    return { success: true, messageId: info.messageId, log };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    
    const log = new EmailLog({
      user: userId,
      company: companyId,
      job: jobId,
      recipientEmail: to,
      subject,
      content: html,
      status: 'failed',
      tag,
      isBulk,
      resumeAttached: true,
    });
    await log.save();
    
    return { success: false, error: error.message };
  }
};

const generateApplicationTemplate = (user, job, company, customMessage = '') => {
  const resumeHTML = generateResumeHTML(user);
  
  return `
<div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#000;padding:30px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-weight:400;letter-spacing:2px;">LUMINA</h1>
    <p style="color:rgba(255,255,255,0.5);margin:10px 0 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;">JobFinder Auto-Application</p>
  </div>
  <div style="padding:40px 30px;background:#fafafa;">
    <p style="font-size:14px;line-height:1.6;color:#555;">Dear ${company.name} Hiring Team,</p>
    <p style="font-size:14px;line-height:1.6;color:#555;">
      We are writing to present <strong>${user.name}</strong> for your <strong>${job.title}</strong> position.
    </p>
    
    ${customMessage ? `<div style="background:#fff;padding:20px;border-left:3px solid #000;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#555;">"${customMessage}"</p>
    </div>` : ''}
    
    <div style="background:#fff;padding:25px;margin:25px 0;border-radius:8px;">
      <h3 style="margin:0 0 15px;font-size:16px;text-transform:uppercase;letter-spacing:1px;">Candidate Profile</h3>
      <p style="margin:8px 0;font-size:13px;"><strong>Name:</strong> ${user.name}</p>
      <p style="margin:8px 0;font-size:13px;"><strong>Email:</strong> ${user.email}</p>
      ${user.phone ? `<p style="margin:8px 0;font-size:13px;"><strong>Phone:</strong> ${user.phone}</p>` : ''}
      ${user.location ? `<p style="margin:8px 0;font-size:13px;"><strong>Location:</strong> ${user.location}</p>` : ''}
      ${user.experience ? `<p style="margin:8px 0;font-size:13px;"><strong>Experience:</strong> ${user.experience}</p>` : ''}
      
      ${user.skills?.length ? `
      <div style="margin-top:15px;">
        <p style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:8px;">Skills</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${user.skills.map(skill => `<span style="background:#000;color:#fff;padding:4px 12px;border-radius:20px;font-size:11px;text-transform:uppercase;">${skill}</span>`).join('')}
        </div>
      </div>` : ''}
    </div>
    
    <div style="background:#000;color:#fff;padding:20px;border-radius:8px;margin:20px 0;">
      <h4 style="margin:0 0 10px;font-size:14px;">📎 Resume Attached</h4>
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">
        Please find ${user.name}'s complete resume attached as HTML file. 
        You can open it in any browser or save as PDF.
      </p>
    </div>
    
    <p style="font-size:13px;color:#777;line-height:1.6;">
      This email was automatically generated by Lumina JobFinder. 
      To respond, simply reply to this email or contact the candidate directly.
    </p>
  </div>
  <div style="background:#000;padding:20px;text-align:center;">
    <p style="color:rgba(255,255,255,0.3);font-size:11px;margin:0;"> 2025 Lumina JobFinder</p>
  </div>
</div>
  `;
};

module.exports = { sendApplicationEmail, generateApplicationTemplate, generateResumeHTML };