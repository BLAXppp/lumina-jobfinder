export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'company' | 'admin';
  avatar?: string;
  skills: string[];
  experience: string;
  bio: string;
  preferredTags: string[];
  resumeUrl?: string;
  location?: string;
  phone?: string;
  createdAt: string;
}

export interface Company {
  _id: string;
  name: string;
  email: string;
  ownerEmail: string;
  website?: string;
  description: string;
  industry: string;
  location: string;
  logo?: string;
  size: string;
  founded?: string;
  createdAt: string;
}

export interface Job {
  _id: string;
  title: string;
  company: Company;
  description: string;
  requirements: string[];
  tags: string[];
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  vacancies: number;
  status: 'active' | 'closed' | 'paused';
  postedAt: string;
  expiresAt?: string;
}

export interface Application {
  _id: string;
  user: string;
  job: Job;
  company: string;
  status: 'pending' | 'sent' | 'viewed' | 'rejected' | 'accepted';
  emailSent: boolean;
  emailContent?: string;
  sentAt?: string;
  createdAt: string;
}