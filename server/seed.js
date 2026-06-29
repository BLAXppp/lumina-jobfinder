const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

dotenv.config();

const realCompanies = [
  {
    name: 'Google',
    email: 'careers@google.com',
    ownerEmail: 'hiring-manager@google.com',
    website: 'https://careers.google.com',
    description: 'Google is a global technology leader focused on improving the ways people connect with information. Our innovations in web search and advertising have made our website a top internet property and our brand one of the most recognized in the world.',
    industry: 'Technology',
    location: 'Mountain View, CA / Remote',
    size: '10,000+',
    founded: '1998'
  },
  {
    name: 'Microsoft',
    email: 'careers@microsoft.com',
    ownerEmail: 'recruitment@microsoft.com',
    website: 'https://careers.microsoft.com',
    description: 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Its mission is to empower every person and every organization on the planet to achieve more.',
    industry: 'Technology',
    location: 'Redmond, WA / Remote',
    size: '10,000+',
    founded: '1975'
  },
  {
    name: 'Amazon',
    email: 'jobs@amazon.com',
    ownerEmail: 'tech-hiring@amazon.com',
    website: 'https://www.amazon.jobs',
    description: 'Amazon is guided by four principles: customer obsession rather than competitor focus, passion for invention, commitment to operational excellence, and long-term thinking.',
    industry: 'E-Commerce & Cloud',
    location: 'Seattle, WA / Remote',
    size: '10,000+',
    founded: '1994'
  },
  {
    name: 'Meta (Facebook)',
    email: 'careers@meta.com',
    ownerEmail: 'engineering@meta.com',
    website: 'https://www.metacareers.com',
    description: 'Meta builds technologies that help people connect, find communities, and grow businesses. We are moving beyond 2D screens toward immersive experiences like augmented and virtual reality.',
    industry: 'Social Media & VR',
    location: 'Menlo Park, CA / Remote',
    size: '10,000+',
    founded: '2004'
  },
  {
    name: 'Netflix',
    email: 'jobs@netflix.com',
    ownerEmail: 'tech-recruiting@netflix.com',
    website: 'https://jobs.netflix.com',
    description: 'Netflix is the world leading streaming entertainment service with over 230 million paid memberships in over 190 countries enjoying TV series, documentaries and feature films.',
    industry: 'Entertainment & Streaming',
    location: 'Los Gatos, CA / Remote',
    size: '5,001-10,000',
    founded: '1997'
  },
  {
    name: 'Apple',
    email: 'jobs@apple.com',
    ownerEmail: 'talent@apple.com',
    website: 'https://www.apple.com/careers',
    description: 'Apple is a diverse collective of thinkers and doers, continually reimagining what is possible to help us all do what we love in new ways.',
    industry: 'Consumer Electronics',
    location: 'Cupertino, CA / Remote',
    size: '10,000+',
    founded: '1976'
  },
  {
    name: 'Tesla',
    email: 'careers@tesla.com',
    ownerEmail: 'autopilot-hiring@tesla.com',
    website: 'https://www.tesla.com/careers',
    description: 'Tesla is accelerating the world transition to sustainable energy with electric cars, solar and integrated renewable energy solutions for homes and businesses.',
    industry: 'Automotive & Energy',
    location: 'Austin, TX / Remote',
    size: '10,000+',
    founded: '2003'
  },
  {
    name: 'Spotify',
    email: 'jobs@spotify.com',
    ownerEmail: 'engineering@spotify.com',
    website: 'https://www.lifeatspotify.com',
    description: 'Spotify transformed music listening forever when we launched in 2008. Our mission is to unlock the potential of human creativity by giving a million creative artists the opportunity to live off their art.',
    industry: 'Music Streaming',
    location: 'Stockholm / Remote',
    size: '5,001-10,000',
    founded: '2006'
  },
  {
    name: 'Airbnb',
    email: 'careers@airbnb.com',
    ownerEmail: 'tech-hiring@airbnb.com',
    website: 'https://careers.airbnb.com',
    description: 'Airbnb is a community based on connection and belonging—a community that was born in 2008 when two hosts welcomed three guests to their San Francisco home.',
    industry: 'Travel & Hospitality',
    location: 'San Francisco, CA / Remote',
    size: '1,001-5,000',
    founded: '2008'
  },
  {
    name: 'Stripe',
    email: 'jobs@stripe.com',
    ownerEmail: 'engineering@stripe.com',
    website: 'https://stripe.com/jobs',
    description: 'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their business online.',
    industry: 'Fintech',
    location: 'San Francisco, CA / Remote',
    size: '1,001-5,000',
    founded: '2010'
  },
  {
    name: 'Uber',
    email: 'careers@uber.com',
    ownerEmail: 'tech-recruiting@uber.com',
    website: 'https://www.uber.com/careers',
    description: 'Uber is changing how the world moves through technology that connects riders with drivers. We are bringing innovations to the way people move, work, and live.',
    industry: 'Transportation',
    location: 'San Francisco, CA / Remote',
    size: '10,000+',
    founded: '2009'
  },
  {
    name: 'Adobe',
    email: 'careers@adobe.com',
    ownerEmail: 'creative-cloud@adobe.com',
    website: 'https://careers.adobe.com',
    description: 'Adobe is changing the world through digital experiences. We help our customers create, deliver and optimize content and applications.',
    industry: 'Software',
    location: 'San Jose, CA / Remote',
    size: '10,000+',
    founded: '1982'
  },
  {
    name: 'Salesforce',
    email: 'careers@salesforce.com',
    ownerEmail: 'hiring@salesforce.com',
    website: 'https://careers.salesforce.com',
    description: 'Salesforce is the world #1 customer relationship management (CRM) platform. We help your marketing, sales, commerce, service and IT teams work as one from anywhere.',
    industry: 'CRM Software',
    location: 'San Francisco, CA / Remote',
    size: '10,000+',
    founded: '1999'
  },
  {
    name: 'LinkedIn',
    email: 'careers@linkedin.com',
    ownerEmail: 'talent@linkedin.com',
    website: 'https://careers.linkedin.com',
    description: 'LinkedIn is the world largest professional network with nearly 800 million members in more than 200 countries and territories worldwide.',
    industry: 'Professional Network',
    location: 'Sunnyvale, CA / Remote',
    size: '10,000+',
    founded: '2003'
  },
  {
    name: 'Twitter (X)',
    email: 'jobs@x.com',
    ownerEmail: 'engineering@x.com',
    website: 'https://careers.x.com',
    description: 'X is what happening in the world and what people are talking about right now. We serve the public conversation and empower people to create and share ideas instantly.',
    industry: 'Social Media',
    location: 'San Francisco, CA / Remote',
    size: '1,001-5,000',
    founded: '2006'
  }
];

const realJobs = [
  // Google Jobs
  { title: 'Senior Software Engineer', companyIndex: 0, tags: ['React', 'Node.js', 'Remote'], location: 'Remote', salary: { min: 180000, max: 250000 }, type: 'full-time', vacancies: 5 },
  { title: 'Machine Learning Engineer', companyIndex: 0, tags: ['Python', 'AI/ML', 'Remote'], location: 'Mountain View, CA', salary: { min: 200000, max: 300000 }, type: 'full-time', vacancies: 3 },
  { title: 'Frontend Developer', companyIndex: 0, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 150000, max: 220000 }, type: 'full-time', vacancies: 8 },
  
  // Microsoft Jobs
  { title: 'Cloud Solutions Architect', companyIndex: 1, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 170000, max: 240000 }, type: 'full-time', vacancies: 4 },
  { title: 'AI Research Scientist', companyIndex: 1, tags: ['Python', 'AI/ML', 'Remote'], location: 'Redmond, WA', salary: { min: 190000, max: 280000 }, type: 'full-time', vacancies: 2 },
  { title: 'Full Stack Developer', companyIndex: 1, tags: ['React', 'Node.js', 'Remote'], location: 'Remote', salary: { min: 160000, max: 230000 }, type: 'full-time', vacancies: 6 },
  
  // Amazon Jobs
  { title: 'SDE II - AWS', companyIndex: 2, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 160000, max: 240000 }, type: 'full-time', vacancies: 10 },
  { title: 'Data Engineer', companyIndex: 2, tags: ['Python', 'AI/ML', 'Remote'], location: 'Seattle, WA', salary: { min: 150000, max: 220000 }, type: 'full-time', vacancies: 7 },
  { title: 'React Native Developer', companyIndex: 2, tags: ['React', 'Remote'], location: 'Remote', salary: { min: 140000, max: 200000 }, type: 'full-time', vacancies: 4 },
  
  // Meta Jobs
  { title: 'VR/AR Engineer', companyIndex: 3, tags: ['Design', 'Remote'], location: 'Menlo Park, CA', salary: { min: 200000, max: 320000 }, type: 'full-time', vacancies: 3 },
  { title: 'Backend Engineer', companyIndex: 3, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 180000, max: 260000 }, type: 'full-time', vacancies: 5 },
  { title: 'UI Engineer', companyIndex: 3, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 170000, max: 240000 }, type: 'full-time', vacancies: 4 },
  
  // Netflix Jobs
  { title: 'Senior Frontend Engineer', companyIndex: 4, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 200000, max: 350000 }, type: 'full-time', vacancies: 3 },
  { title: 'Machine Learning Engineer', companyIndex: 4, tags: ['Python', 'AI/ML', 'Remote'], location: 'Los Gatos, CA', salary: { min: 220000, max: 380000 }, type: 'full-time', vacancies: 2 },
  
  // Apple Jobs
  { title: 'iOS Developer', companyIndex: 5, tags: ['Design', 'Remote'], location: 'Cupertino, CA', salary: { min: 180000, max: 280000 }, type: 'full-time', vacancies: 6 },
  { title: 'Cloud Infrastructure Engineer', companyIndex: 5, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 190000, max: 290000 }, type: 'full-time', vacancies: 4 },
  
  // Tesla Jobs
  { title: 'Autopilot Engineer', companyIndex: 6, tags: ['Python', 'AI/ML', 'Remote'], location: 'Austin, TX', salary: { min: 180000, max: 300000 }, type: 'full-time', vacancies: 5 },
  { title: 'Full Stack Developer', companyIndex: 6, tags: ['React', 'Node.js', 'Remote'], location: 'Remote', salary: { min: 160000, max: 250000 }, type: 'full-time', vacancies: 3 },
  
  // Spotify Jobs
  { title: 'Backend Engineer', companyIndex: 7, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 150000, max: 220000 }, type: 'full-time', vacancies: 4 },
  { title: 'Data Scientist', companyIndex: 7, tags: ['Python', 'AI/ML', 'Remote'], location: 'Stockholm / Remote', salary: { min: 140000, max: 200000 }, type: 'full-time', vacancies: 3 },
  
  // Airbnb Jobs
  { title: 'Senior Frontend Developer', companyIndex: 8, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 180000, max: 280000 }, type: 'full-time', vacancies: 4 },
  { title: 'Backend Engineer', companyIndex: 8, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 170000, max: 260000 }, type: 'full-time', vacancies: 3 },
  
  // Stripe Jobs
  { title: 'Software Engineer', companyIndex: 9, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 180000, max: 280000 }, type: 'full-time', vacancies: 5 },
  { title: 'Frontend Engineer', companyIndex: 9, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 170000, max: 260000 }, type: 'full-time', vacancies: 3 },
  
  // Uber Jobs
  { title: 'Mobile Engineer', companyIndex: 10, tags: ['React', 'Remote'], location: 'Remote', salary: { min: 160000, max: 240000 }, type: 'full-time', vacancies: 4 },
  { title: 'Machine Learning Engineer', companyIndex: 10, tags: ['Python', 'AI/ML', 'Remote'], location: 'San Francisco, CA', salary: { min: 190000, max: 290000 }, type: 'full-time', vacancies: 3 },
  
  // Adobe Jobs
  { title: 'Creative Developer', companyIndex: 11, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 160000, max: 240000 }, type: 'full-time', vacancies: 3 },
  { title: 'AI/ML Engineer', companyIndex: 11, tags: ['Python', 'AI/ML', 'Remote'], location: 'San Jose, CA', salary: { min: 180000, max: 270000 }, type: 'full-time', vacancies: 2 },
  
  // Salesforce Jobs
  { title: 'Platform Engineer', companyIndex: 12, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 170000, max: 250000 }, type: 'full-time', vacancies: 5 },
  { title: 'Frontend Architect', companyIndex: 12, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 180000, max: 260000 }, type: 'full-time', vacancies: 3 },
  
  // LinkedIn Jobs
  { title: 'Staff Engineer', companyIndex: 13, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 200000, max: 320000 }, type: 'full-time', vacancies: 2 },
  { title: 'UI/UX Engineer', companyIndex: 13, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 170000, max: 250000 }, type: 'full-time', vacancies: 4 },
  
  // Twitter Jobs
  { title: 'Distributed Systems Engineer', companyIndex: 14, tags: ['Node.js', 'Python', 'Remote'], location: 'Remote', salary: { min: 190000, max: 300000 }, type: 'full-time', vacancies: 3 },
  { title: 'Frontend Engineer', companyIndex: 14, tags: ['React', 'Design', 'Remote'], location: 'Remote', salary: { min: 170000, max: 260000 }, type: 'full-time', vacancies: 4 }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});

    const companies = await Company.create(realCompanies);
    console.log('Created', companies.length, 'real companies');

    const jobsWithCompany = realJobs.map(job => ({
      title: job.title,
      company: companies[job.companyIndex]._id,
      description: `We are looking for a talented ${job.title} to join our team. You will work on cutting-edge projects that impact millions of users worldwide. The ideal candidate has strong problem-solving skills and a passion for innovation.`,
      requirements: ['3+ years experience', 'Strong communication skills', 'Team player', 'Bachelor degree in CS or related field'],
      tags: job.tags,
      location: job.location,
      salary: { ...job.salary, currency: '$' },
      type: job.type,
      vacancies: job.vacancies,
      status: 'active'
    }));

    await Job.create(jobsWithCompany);
    console.log('Created', jobsWithCompany.length, 'real jobs');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();