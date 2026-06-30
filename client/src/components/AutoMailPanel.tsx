import { useState } from 'react';
import { motion } from "framer-motion";
import { Send, Zap, Tag, CheckCircle } from 'lucide-react';
import { emailService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AutoMailPanel() {
  const { user } = useAuth();
  const [selectedTag, setSelectedTag] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const tags = ['React', 'Node.js', 'Python', 'Design', 'AI/ML', 'Remote'];

  const handleBulkSend = async () => {
    if (!selectedTag) return;
    setLoading(true);
    try {
      const res = await emailService.sendBulk({ tag: selectedTag, message });
      setResult(res.data);
    } catch (err: any) {
      setResult({ error: err.response?.data?.message || 'Failed to send emails' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Zap size={24} className="text-white/70" />
          <div>
            <h2 className="text-3xl font-medium text-white">Auto-Email Center</h2>
            <p className="text-white/50 text-sm">Send your profile to all matching companies instantly.</p>
          </div>
        </div>

        <div className="liquid-glass rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/50 mb-3 block">Select Your Skill Tag</label>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={'px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all ' + (selectedTag === tag ? 'bg-white text-black' : 'liquid-glass text-white/60 hover:text-white')}>
                  <Tag size={12} className="inline mr-1" />{tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-white/50 mb-2 block">
              Custom Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
              placeholder="Add a personalized message to your application..."
            />
          </div>

          <button
            onClick={handleBulkSend}
            disabled={!selectedTag || loading}
            className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={16} />
            {loading ? 'Sending...' : 'Send Auto-Emails (' + (selectedTag || 'Select tag') + ')'}
          </button>

          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={'p-4 rounded-xl ' + (result.error ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300') + ' text-sm'}>
              {result.error ? result.error : (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  Successfully sent to {result.sent} companies!
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}