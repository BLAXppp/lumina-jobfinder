import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Clock, CheckCircle, XCircle, RefreshCw, Send, FileText } from 'lucide-react';
import { emailService } from '../services/api';
import { useAuth } from '../context/Authcontext';

export default function EmailHistory() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => { 
    if (isAuthenticated) fetchEmails(); 
  }, [isAuthenticated]);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await emailService.getHistory();
      setEmails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="w-full py-20 text-center">
        <Mail size={48} className="text-white/20 mx-auto mb-4" />
        <p className="text-white/40 text-lg">Please sign in to view email history.</p>
      </section>
    );
  }

  const sentCount = emails.filter((e: any) => e.status === 'sent').length;
  const failedCount = emails.filter((e: any) => e.status === 'failed').length;

  return (
    <section className="w-full py-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-2">Email History</h2>
            <p className="text-white/50 text-sm">
              {sentCount} delivered • {failedCount} failed • {emails.length} total
            </p>
          </div>
          <button 
            onClick={fetchEmails}
            className="flex items-center gap-2 px-4 py-3 liquid-glass rounded-xl text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/50"></div>
          </div>
        ) : emails.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass rounded-2xl p-12 text-center"
          >
            <Send size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No emails sent yet.</p>
            <p className="text-white/30 text-sm mt-2">Apply to jobs or use Auto-Email to see your history here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {emails.map((email, index) => (
              <motion.div
                key={email._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="liquid-glass rounded-2xl p-6 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={'w-12 h-12 rounded-xl flex items-center justify-center ' + 
                      (email.status === 'sent' ? 'bg-emerald-500/20' : 
                       email.status === 'failed' ? 'bg-red-500/20' : 
                       'bg-white/10')
                    }>
                      {email.status === 'sent' ? <CheckCircle size={20} className="text-emerald-300" /> :
                       email.status === 'failed' ? <XCircle size={20} className="text-red-300" /> :
                       <Clock size={20} className="text-white/50" />}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{email.jobTitle || 'General Application'}</h4>
                      <p className="text-white/50 text-sm">{email.companyName}</p>
                      {email.resumeAttached && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <FileText size={10} /> Resume Attached
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={'text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ' +
                      (email.status === 'sent' ? 'bg-emerald-500/20 text-emerald-300' : 
                       email.status === 'failed' ? 'bg-red-500/20 text-red-300' : 
                       'bg-white/10 text-white/50')
                    }>
                      {email.status}
                    </span>
                    {email.isBulk && (
                      <span className="block mt-2 text-[10px] uppercase tracking-widest text-white/30 bg-white/5 px-2 py-0.5 rounded">
                        BULK SEND
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> 
                      {new Date(email.sentAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <span className="text-xs text-white/20">
                    ID: {email._id.slice(-6)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}