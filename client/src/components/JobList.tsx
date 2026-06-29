import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Tag, CheckCircle } from 'lucide-react';
import { jobService } from '../services/api';
import { useAuth } from '../context/Authcontext';

export default function JobList() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => { fetchJobs(); }, []);
  
  const fetchJobs = async () => {
    try { 
      const res = await jobService.getAll(); 
      setJobs(res.data); 
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleApply = async (jobId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in first!');
      return;
    }
    setApplying(jobId);
    try {
      const res = await jobService.apply(jobId);
      if (res.data.success) {
        setAppliedJobs([...appliedJobs, jobId]);
        alert('✅ Application sent! Email delivered to company owner.');
      }
    } catch (err: any) {
      alert('❌ Error: ' + (err.response?.data?.message || 'Failed to apply'));
    } finally {
      setApplying(null);
    }
  };

  const filteredJobs = jobs.filter((job) => 
    job.title.toLowerCase().includes(search.toLowerCase()) || 
    job.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="jobs" className="w-full py-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
        <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">Open Positions</h2>
        <p className="text-white/50 text-sm">Browse opportunities from top companies.</p>
      </motion.div>
      
      <div className="relative mb-10">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input 
          type="text" 
          placeholder="Search jobs..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl liquid-glass text-white text-sm placeholder:text-white/30 focus:outline-none" 
        />
      </div>

      {loading ? (
        <div className="text-center text-white/40">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div 
              key={job._id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="liquid-glass rounded-2xl p-6"
            >
              <h3 className="text-white font-medium text-lg mb-2">{job.title}</h3>
              <p className="text-white/50 text-sm mb-4">{job.company?.name}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags?.map((t: string) => (
                  <span key={t} className="text-[10px] uppercase tracking-wider text-white/50 bg-white/5 px-2 py-1 rounded-md">
                    <Tag size={10} className="inline mr-1" />{t}
                  </span>
                ))}
              </div>

              <div className="text-xs text-white/40 mb-4">
                📍 {job.location} | 💰 ${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()}
              </div>

              {isAuthenticated && (
                <button 
                  onClick={() => handleApply(job._id)}
                  disabled={applying === job._id || appliedJobs.includes(job._id)}
                  className={'w-full py-3 rounded-xl text-xs uppercase tracking-widest font-medium transition-all ' + 
                    (appliedJobs.includes(job._id) 
                      ? 'bg-emerald-500/20 text-emerald-300 cursor-default' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                    )
                  }
                >
                  {applying === job._id ? 'Sending...' : appliedJobs.includes(job._id) ? (
                    <><CheckCircle size={14} className="inline mr-2" />Applied</>
                  ) : (
                    <><Send size={14} className="inline mr-2" />Apply & Auto-Email</>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}