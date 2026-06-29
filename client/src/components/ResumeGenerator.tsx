import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  User, Mail, MapPin, Phone, Briefcase, GraduationCap, 
  Download, Printer, Sparkles, FileText, Code, 
  ExternalLink, Palette, Check, X,
  Trash2, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experience: { role: string; company: string; duration: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
  preferredTags: string[];
  portfolio: string;
  github: string;
  linkedin: string;
}

const templates = [
  { id: 'modern', name: 'Modern Dark', bg: 'bg-slate-900', text: 'text-white', accent: 'bg-emerald-500' },
  { id: 'minimal', name: 'Minimal White', bg: 'bg-white', text: 'text-slate-900', accent: 'bg-slate-900' },
  { id: 'elegant', name: 'Elegant Blue', bg: 'bg-blue-900', text: 'text-white', accent: 'bg-amber-400' },
];

// Custom SVG Icons
const LinkedInIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const GlobeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

function ResumeGenerator() {
  const { user } = useAuth();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    preferredTags: [],
    portfolio: '',
    github: '',
    linkedin: ''
  });

  useEffect(() => {
    if (user) {
      setResumeData({
        name: user.name || '',
        title: user.skills?.includes('React') ? 'Senior Frontend Developer' : 
               user.skills?.includes('Python') ? 'Machine Learning Engineer' : 'Full Stack Developer',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills || [],
        experience: user.experience 
          ? [{ role: user.experience, company: 'Previous Company', duration: '2020 - Present', description: 'Led development of scalable web applications and collaborated with cross-functional teams to deliver high-quality products.' }]
          : [],
        education: [{ degree: 'Bachelor of Technology', school: 'University', year: '2016 - 2020' }],
        preferredTags: user.preferredTags || [],
        portfolio: '',
        github: '',
        linkedin: ''
      });
    }
  }, [user]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !resumeRef.current) return;
    
    const resumeHTML = resumeRef.current.innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeData.name} - Resume</title>
          <style>
            @page { size: A4; margin: 0; }
            body { margin: 0; padding: 40px; font-family: 'Segoe UI', system-ui, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>${resumeHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const downloadHTML = () => {
    const html = resumeRef.current?.innerHTML || '';
    const blob = new Blob([`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${resumeData.name} - Resume</title>
          <style>
            body { margin: 0; padding: 40px; font-family: 'Segoe UI', system-ui, sans-serif; background: #f5f5f5; }
            .resume-page { max-width: 800px; margin: 0 auto; background: white; padding: 50px; box-shadow: 0 0 30px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="resume-page">${html}</div>
        </body>
      </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.name.replace(/\s+/g, '_')}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
    setShowDownloadMenu(false);
  };

  const autoGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setResumeData(prev => ({
        ...prev,
        title: prev.skills.includes('React') ? 'Senior Frontend Developer' : 
               prev.skills.includes('Python') ? 'Machine Learning Engineer' : 
               prev.skills.includes('Design') ? 'UI/UX Designer' : 'Full Stack Developer',
        experience: prev.experience.length === 0 ? [
          { role: 'Senior Software Engineer', company: 'TechCorp Global', duration: '2021 - Present', description: 'Architected scalable microservices handling 1M+ daily requests. Led a team of 5 developers and reduced deployment time by 60% through CI/CD automation.' },
          { role: 'Software Developer', company: 'InnovateStart', duration: '2019 - 2021', description: 'Built responsive React dashboards and REST APIs. Improved page load speed by 40% and implemented real-time WebSocket features.' }
        ] : prev.experience,
        education: prev.education.length === 0 ? [
          { degree: 'B.Tech in Computer Science', school: 'National Institute of Technology', year: '2015 - 2019' }
        ] : prev.education,
        bio: prev.bio || 'Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, system design, and delivering exceptional user experiences. Seeking challenging opportunities to leverage technical expertise and drive innovation.'
      }));
      setIsGenerating(false);
    }, 1200);
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExp = [...resumeData.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setResumeData({ ...resumeData, experience: newExp });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEdu = [...resumeData.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setResumeData({ ...resumeData, education: newEdu });
  };

  const currentTemplate = templates.find(t => t.id === activeTemplate) || templates[0];

  if (!user) {
    return (
      <section className="w-full py-20 text-center">
        <FileText size={64} className="text-white/10 mx-auto mb-6" />
        <p className="text-white/40 text-xl">Please sign in to generate your resume.</p>
        <p className="text-white/20 text-sm mt-2">Create a professional resume in minutes.</p>
      </section>
    );
  }

  return (
    <section className="w-full py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">AI Resume Builder</h2>
            </motion.div>
            <p className="text-white/40 text-sm">Generate a world-class professional resume from your profile.</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              onClick={autoGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs uppercase tracking-widest font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-50"
            >
              <Sparkles size={14} />
              {isGenerating ? 'Generating...' : 'AI Auto-Fill'}
            </motion.button>
            
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-xs uppercase tracking-widest font-medium shadow-lg shadow-white/10 hover:shadow-white/20 transition-all"
              >
                <Download size={14} /> Export
              </motion.button>
              
              {showDownloadMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-full mt-2 w-48 liquid-glass rounded-xl p-2 z-50 border border-white/10"
                >
                  <button onClick={handlePrint} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all text-left">
                    <Printer size={14} /> Print / Save PDF
                  </button>
                  <button onClick={downloadHTML} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all text-left">
                    <FileText size={14} /> Download HTML
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Template Selector */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t.id)}
              className={'flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all whitespace-nowrap ' +
                (activeTemplate === t.id 
                  ? 'bg-white text-black shadow-lg shadow-white/20' 
                  : 'liquid-glass text-white/50 hover:text-white')
              }
            >
              <Palette size={12} />
              {t.name}
              {activeTemplate === t.id && <Check size={12} className="ml-1" />}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-5 max-h-[85vh] overflow-y-auto pr-2">
            
            {/* Personal Info */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-xs uppercase tracking-widest text-white/50 mb-5 flex items-center gap-2">
                <User size={12} /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <User size={10} /> Full Name
                  </label>
                  <input 
                    value={resumeData.name}
                    onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <Briefcase size={10} /> Job Title
                  </label>
                  <input 
                    value={resumeData.title}
                    onChange={(e) => setResumeData({...resumeData, title: e.target.value})}
                    placeholder="Senior Developer"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <Mail size={10} /> Email
                  </label>
                  <input 
                    value={resumeData.email}
                    onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <Phone size={10} /> Phone
                  </label>
                  <input 
                    value={resumeData.phone}
                    onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
                    placeholder="+1 234 567 890"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <MapPin size={10} /> Location
                  </label>
                  <input 
                    value={resumeData.location}
                    onChange={(e) => setResumeData({...resumeData, location: e.target.value})}
                    placeholder="New York, USA"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <GlobeIcon size={10} /> Portfolio
                  </label>
                  <input 
                    value={resumeData.portfolio}
                    onChange={(e) => setResumeData({...resumeData, portfolio: e.target.value})}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <LinkedInIcon size={10} /> LinkedIn
                  </label>
                  <input 
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData({...resumeData, linkedin: e.target.value})}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] uppercase tracking-widest text-white/30 mb-1.5 block flex items-center gap-1">
                    <GitHubIcon size={10} /> GitHub
                  </label>
                  <input 
                    value={resumeData.github}
                    onChange={(e) => setResumeData({...resumeData, github: e.target.value})}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
                <FileText size={12} /> Professional Summary
              </h3>
              <textarea 
                value={resumeData.bio}
                onChange={(e) => setResumeData({...resumeData, bio: e.target.value})}
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none placeholder:text-white/20"
                placeholder="Write a compelling professional summary..."
              />
            </div>

            {/* Skills */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/5">
              <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 flex items-center gap-2">
                <Code size={12} /> Skills
              </h3>
              <input 
                value={resumeData.skills.join(', ')}
                onChange={(e) => setResumeData({...resumeData, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all placeholder:text-white/20"
                placeholder="React, Node.js, Python, TypeScript, AWS..."
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {resumeData.skills.map((skill, i) => (
                  <motion.span 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <Briefcase size={12} /> Work Experience
                </h3>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addExperience} 
                  className="text-[10px] uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Plus size={10} /> Add Experience
                </motion.button>
              </div>
              <div className="space-y-4">
                {resumeData.experience.map((exp, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                  >
                    <button 
                      onClick={() => removeExperience(i)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        value={exp.role}
                        onChange={(e) => updateExperience(i, 'role', e.target.value)}
                        placeholder="Job Title"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-white/20"
                      />
                      <input 
                        value={exp.company}
                        onChange={(e) => updateExperience(i, 'company', e.target.value)}
                        placeholder="Company"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-white/20"
                      />
                    </div>
                    <input 
                      value={exp.duration}
                      onChange={(e) => updateExperience(i, 'duration', e.target.value)}
                      placeholder="Duration (e.g. 2020 - 2023)"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-white/20"
                    />
                    <textarea 
                      value={exp.description}
                      onChange={(e) => updateExperience(i, 'description', e.target.value)}
                      placeholder="Describe your achievements and responsibilities..."
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none placeholder:text-white/20"
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="liquid-glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs uppercase tracking-widest text-white/50 flex items-center gap-2">
                  <GraduationCap size={12} /> Education
                </h3>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addEducation} 
                  className="text-[10px] uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Plus size={10} /> Add Education
                </motion.button>
              </div>
              <div className="space-y-4">
                {resumeData.education.map((edu, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3 relative group"
                  >
                    <button 
                      onClick={() => removeEducation(i)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                    </button>
                    <input 
                      value={edu.degree}
                      onChange={(e) => updateEducation(i, 'degree', e.target.value)}
                      placeholder="Degree / Certification"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-white/20"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        value={edu.school}
                        onChange={(e) => updateEducation(i, 'school', e.target.value)}
                        placeholder="School / University"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-white/20"
                      />
                      <input 
                        value={edu.year}
                        onChange={(e) => updateEducation(i, 'year', e.target.value)}
                        placeholder="Year (e.g. 2015 - 2019)"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 placeholder:text-white/20"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="xl:sticky xl:top-8">
            <div className="liquid-glass rounded-2xl p-4 border border-white/5">
              <h3 className="text-xs uppercase tracking-widest text-white/50 mb-4 text-center flex items-center justify-center gap-2">
                <ExternalLink size={12} /> Live Preview
              </h3>
              <div 
                ref={resumeRef}
                className={currentTemplate.bg + ' ' + currentTemplate.text + ' rounded-xl p-8 overflow-hidden'}
                style={{ aspectRatio: '1/1.414', maxHeight: '800px', overflowY: 'auto' }}
              >
                {/* Modern Template */}
                {activeTemplate === 'modern' && (
                  <div className="font-sans">
                    <div className="border-b-2 border-emerald-500 pb-4 mb-5">
                      <h1 className="text-3xl font-bold tracking-tight">{resumeData.name || 'Your Name'}</h1>
                      <p className="text-sm uppercase tracking-widest text-emerald-400 mt-1">{resumeData.title || 'Job Title'}</p>
                      <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-gray-400">
                        {resumeData.email && <span className="flex items-center gap-1">✉ {resumeData.email}</span>}
                        {resumeData.phone && <span className="flex items-center gap-1">📞 {resumeData.phone}</span>}
                        {resumeData.location && <span className="flex items-center gap-1">📍 {resumeData.location}</span>}
                        {resumeData.portfolio && <span className="flex items-center gap-1">🌐 {resumeData.portfolio}</span>}
                        {resumeData.linkedin && <span className="flex items-center gap-1">💼 LinkedIn</span>}
                        {resumeData.github && <span className="flex items-center gap-1">⚡ GitHub</span>}
                      </div>
                    </div>

                    {resumeData.bio && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-emerald-400 border-b border-emerald-500/30 pb-1 mb-2">Summary</h2>
                        <p className="text-xs text-gray-300 leading-relaxed">{resumeData.bio}</p>
                      </div>
                    )}

                    {resumeData.skills.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-emerald-400 border-b border-emerald-500/30 pb-1 mb-2">Technical Skills</h2>
                        <div className="flex flex-wrap gap-1.5">
                          {resumeData.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[9px] uppercase rounded border border-emerald-500/30">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.experience.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-emerald-400 border-b border-emerald-500/30 pb-1 mb-2">Experience</h2>
                        <div className="space-y-3">
                          {resumeData.experience.map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-sm text-white">{exp.role || 'Role'}</h3>
                                <span className="text-[9px] text-gray-500">{exp.duration}</span>
                              </div>
                              <p className="text-xs text-emerald-400/80 mb-1">{exp.company}</p>
                              <p className="text-[10px] text-gray-400 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.education.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-emerald-400 border-b border-emerald-500/30 pb-1 mb-2">Education</h2>
                        <div className="space-y-2">
                          {resumeData.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                              <div>
                                <h3 className="font-semibold text-sm text-white">{edu.degree}</h3>
                                <p className="text-xs text-gray-400">{edu.school}</p>
                              </div>
                              <span className="text-[9px] text-gray-500">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Minimal Template */}
                {activeTemplate === 'minimal' && (
                  <div className="font-sans text-slate-900">
                    <div className="text-center border-b-2 border-slate-900 pb-4 mb-5">
                      <h1 className="text-3xl font-light tracking-tight">{resumeData.name || 'Your Name'}</h1>
                      <p className="text-sm uppercase tracking-widest text-slate-500 mt-1">{resumeData.title || 'Job Title'}</p>
                      <div className="flex flex-wrap justify-center gap-3 mt-3 text-[10px] text-slate-600">
                        {resumeData.email && <span>{resumeData.email}</span>}
                        {resumeData.phone && <span>• {resumeData.phone}</span>}
                        {resumeData.location && <span>• {resumeData.location}</span>}
                      </div>
                    </div>

                    {resumeData.bio && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-2">Profile</h2>
                        <p className="text-xs text-slate-700 leading-relaxed">{resumeData.bio}</p>
                      </div>
                    )}

                    {resumeData.skills.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-2">Skills</h2>
                        <p className="text-xs text-slate-700">{resumeData.skills.join(' • ')}</p>
                      </div>
                    )}

                    {resumeData.experience.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-2">Experience</h2>
                        <div className="space-y-3">
                          {resumeData.experience.map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-sm">{exp.role || 'Role'}</h3>
                                <span className="text-[9px] text-slate-500">{exp.duration}</span>
                              </div>
                              <p className="text-xs text-slate-600 mb-1">{exp.company}</p>
                              <p className="text-[10px] text-slate-500 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-1 mb-2">Education</h2>
                        <div className="space-y-2">
                          {resumeData.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                              <div>
                                <h3 className="font-semibold text-sm">{edu.degree}</h3>
                                <p className="text-xs text-slate-600">{edu.school}</p>
                              </div>
                              <span className="text-[9px] text-slate-500">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Elegant Template */}
                {activeTemplate === 'elegant' && (
                  <div className="font-serif">
                    <div className="border-l-4 border-amber-400 pl-4 pb-4 mb-5">
                      <h1 className="text-3xl font-bold tracking-tight text-white">{resumeData.name || 'Your Name'}</h1>
                      <p className="text-sm italic text-amber-200 mt-1">{resumeData.title || 'Job Title'}</p>
                      <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-blue-200">
                        {resumeData.email && <span>{resumeData.email}</span>}
                        {resumeData.phone && <span>• {resumeData.phone}</span>}
                        {resumeData.location && <span>• {resumeData.location}</span>}
                      </div>
                    </div>

                    {resumeData.bio && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-amber-400 border-b border-amber-400/30 pb-1 mb-2">Professional Summary</h2>
                        <p className="text-xs text-blue-100 leading-relaxed italic">{resumeData.bio}</p>
                      </div>
                    )}

                    {resumeData.skills.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-amber-400 border-b border-amber-400/30 pb-1 mb-2">Competencies</h2>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill, i) => (
                            <span key={i} className="text-xs text-blue-200">• {skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.experience.length > 0 && (
                      <div className="mb-4">
                        <h2 className="text-[10px] uppercase tracking-widest text-amber-400 border-b border-amber-400/30 pb-1 mb-2">Professional Experience</h2>
                        <div className="space-y-3">
                          {resumeData.experience.map((exp, i) => (
                            <div key={i}>
                              <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold text-sm text-white">{exp.role || 'Role'}</h3>
                                <span className="text-[9px] text-amber-300">{exp.duration}</span>
                              </div>
                              <p className="text-xs text-amber-200/80 mb-1 italic">{exp.company}</p>
                              <p className="text-[10px] text-blue-200 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {resumeData.education.length > 0 && (
                      <div>
                        <h2 className="text-[10px] uppercase tracking-widest text-amber-400 border-b border-amber-400/30 pb-1 mb-2">Education</h2>
                        <div className="space-y-2">
                          {resumeData.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-baseline">
                              <div>
                                <h3 className="font-semibold text-sm text-white">{edu.degree}</h3>
                                <p className="text-xs text-blue-200">{edu.school}</p>
                              </div>
                              <span className="text-[9px] text-amber-300">{edu.year}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default ResumeGenerator;