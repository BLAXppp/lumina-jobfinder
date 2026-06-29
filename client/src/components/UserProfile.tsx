import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, MapPin, Phone, Briefcase, GraduationCap, Save, Tag, Sparkles } from 'lucide-react';
import { useAuth } from '../context/Authcontext';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || '',
    location: user?.location || '',
    phone: user?.phone || '',
    preferredTags: user?.preferredTags?.join(', ') || ''
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      preferredTags: formData.preferredTags.split(',').map(s => s.trim()).filter(Boolean)
    });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return <div className="w-full py-20 text-center text-white/40">Please sign in to view your profile.</div>;

  return (
    <section className="w-full py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-medium text-white mb-2">Your Profile</h2>
            <p className="text-white/50 text-sm">Manage your information for auto-email applications.</p>
          </div>
          {!editing && (
            <div className="flex gap-3">
              <button onClick={() => setEditing(true)}
                className="px-6 py-3 liquid-glass rounded-xl text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors">
                Edit Profile
              </button>
              <Link to="/resume"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-colors">
                <Sparkles size={14} /> Generate Resume
              </Link>
            </div>
          )}
        </div>

        {saved && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm text-center">
            Profile updated successfully!
          </motion.div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit} className="liquid-glass rounded-2xl p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                  <User size={12} /> Full Name
                </label>
                <input value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                  <Mail size={12} /> Email
                </label>
                <input value={user.email} disabled
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 text-sm cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                <Briefcase size={12} /> Bio / Summary
              </label>
              <textarea value={formData.bio} rows={3}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30 resize-none"
                placeholder="Brief professional summary..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                  <GraduationCap size={12} /> Skills (comma separated)
                </label>
                <input value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  placeholder="React, Node.js, Python..." />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                  <Tag size={12} /> Preferred Job Tags
                </label>
                <input value={formData.preferredTags}
                  onChange={(e) => setFormData({ ...formData, preferredTags: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  placeholder="Remote, AI, Design..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                  <Briefcase size={12} /> Experience
                </label>
                <input value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  placeholder="3 years..." />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                  <MapPin size={12} /> Location
                </label>
                <input value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  placeholder="City, Country..." />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-2">
                  <Phone size={12} /> Phone
                </label>
                <input value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
                  placeholder="+1 234 567..." />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-colors">
                <Save size={14} /> Save Changes
              </button>
              <button type="button" onClick={() => setEditing(false)}
                className="px-6 py-3 liquid-glass rounded-xl text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="liquid-glass rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-6 pb-6 border-b border-white/10">
              <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-medium text-white">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">{user.name}</h3>
                <p className="text-white/40 text-sm">{user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-white/30">
                  {user.location && <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>}
                  {user.phone && <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">Bio</h4>
              <p className="text-white/70 text-sm leading-relaxed">{user.bio || 'No bio added yet.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">{skill}</span>
                  )) || <span className="text-white/30 text-sm">No skills added</span>}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">Job Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {user.preferredTags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs">{tag}</span>
                  )) || <span className="text-white/30 text-sm">No preferences set</span>}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">Experience</h4>
              <p className="text-white/70 text-sm">{user.experience || 'Not specified'}</p>
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}