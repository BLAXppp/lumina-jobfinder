import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building2, MapPin, Mail, Globe } from 'lucide-react';
import { companyService } from '../services/api';

export default function CompanySection() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCompanies(); }, []);
  const fetchCompanies = async () => {
    try { const res = await companyService.getAll(); setCompanies(res.data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  return (
    <section id="companies" className="w-full py-20">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-12">
        <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">Partner Companies</h2>
        <p className="text-white/50 text-sm max-w-lg">Connect directly with hiring managers and company owners.</p>
      </motion.div>
      {loading ? (
        <div className="text-center text-white/40">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="liquid-glass rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Building2 size={24} className="text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-lg">{company.name}</h3>
                    <p className="text-white/40 text-xs uppercase tracking-wider">{company.industry}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-white/30 bg-white/5 px-3 py-1 rounded-full">
                  {company.size}
                </span>
              </div>

              <p className="text-white/50 text-sm leading-relaxed mb-6">{company.description}</p>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <MapPin size={12} /> {company.location}
                </span>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                    <Globe size={12} /> Website
                  </a>
                )}
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <Mail size={12} /> {company.ownerEmail}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-white/40">Active Hiring</span>
                <button className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                  View Jobs →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}