import { motion } from 'motion/react';
import { MapPin, DollarSign, Clock, Users, Send, Tag } from 'lucide-react';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { jobService } from '../services/api';

interface JobCardProps { job: Job; index: number; }

export default function JobCard({ job, index }: JobCardProps) {
  const { isAuthenticated } = useAuth();
  const [applied, setApplied] = useState(false);
  const [sending, setSending] = useState(false);

  const handleApply = async () => {
    if (!isAuthenticated) return;
    setSending(true);
    try { await jobService.apply(job._id); setApplied(true); } catch (err) { console.error(err); } finally { setSending(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
      className="liquid-glass rounded-2xl p-6 hover:bg-white/[0.03] transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white font-medium text-lg">{job.company.name.charAt(0)}</div>
          <div><h3 className="text-white font-medium text-lg">{job.title}</h3><p className="text-white/50 text-sm">{job.company.name}</p></div>
        </div>
        <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${job.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{job.status}</span>
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{job.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-1 rounded-md"><Tag size={10} />{tag}</span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-5">
        <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
        <span className="flex items-center gap-1"><DollarSign size={12} />{job.salary.currency}{job.salary.min} - {job.salary.max}</span>
        <span className="flex items-center gap-1"><Clock size={12} />{job.type}</span>
        <span className="flex items-center gap-1"><Users size={12} />{job.vacancies} open</span>
      </div>
      {isAuthenticated && (
        <button onClick={handleApply} disabled={applied || sending}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-widest font-medium transition-all ${applied ? 'bg-emerald-500/20 text-emerald-300 cursor-default' : 'bg-white/10 text-white hover:bg-white/20'}`}>
          <Send size={14} />{sending ? 'Sending...' : applied ? 'Application Sent' : 'Apply & Auto-Email'}
        </button>
      )}
    </motion.div>
  );
}