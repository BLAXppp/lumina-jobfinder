import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut, LogIn, Mail, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onSignInClick: () => void;
}

export default function Navbar({ onSignInClick }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      className="w-full flex items-center justify-between py-6 mb-8"
    >
      <Link to="/" className="flex items-center gap-3 text-white hover:opacity-80">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor">
          <path d="M 4.688 136 C 68.373 136 120 187.627 120 251.312 C 120 252.883 119.967 254.445 119.905 256 L 0 256 L 0 136.096 C 1.555 136.034 3.117 136 4.688 136 Z M 251.312 136 C 252.883 136 254.445 136.034 256 136.096 L 256 256 L 136.095 256 C 136.032 254.438 136.001 252.875 136 251.312 C 136 187.627 187.627 136 251.312 136 Z M 119.905 0 C 119.967 1.555 120 3.117 120 4.688 C 120 68.373 68.373 120 4.687 120 C 3.117 120 1.555 119.967 0 119.905 L 0 0 Z M 256 119.905 C 254.445 119.967 252.883 120 251.312 120 C 187.627 120 136 68.373 136 4.687 C 136 3.117 136.033 1.555 136.095 0 L 256 0 Z" />
        </svg>
        <span className="text-2xl font-semibold tracking-tight">LUMINA</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link to="/jobs" className={'text-sm uppercase tracking-widest transition-colors hover:text-white ' + (isActive('/jobs') ? 'text-white font-semibold' : 'text-white/50')}>
          Jobs
        </Link>
        <Link to="/companies" className={'text-sm uppercase tracking-widest transition-colors hover:text-white ' + (isActive('/companies') ? 'text-white font-semibold' : 'text-white/50')}>
          Companies
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/emails" className={'text-sm uppercase tracking-widest transition-colors hover:text-white ' + (isActive('/emails') ? 'text-white font-semibold' : 'text-white/50')}>
              <Mail size={14} className="inline mr-1" /> Emails
            </Link>
            <Link to="/resume" className={'text-sm uppercase tracking-widest transition-colors hover:text-white ' + (isActive('/resume') ? 'text-white font-semibold' : 'text-white/50')}>
              <FileText size={14} className="inline mr-1" /> Resume
            </Link>
          </>
        )}
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <User size={16} />
              <span className="uppercase tracking-widest">{user?.name}</span>
            </Link>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-white/50 hover:text-white">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onSignInClick}
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-white/70 hover:text-white transition-colors"
          >
            <LogIn size={16} /> Sign In
          </button>
        )}
      </div>

      <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/70 hover:text-white">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-4 right-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 md:hidden z-50"
          >
            <div className="flex flex-col gap-4">
              <Link to="/jobs" onClick={() => setMobileOpen(false)} className="text-sm uppercase tracking-widest text-white/70 hover:text-white">
                Jobs
              </Link>
              <Link to="/companies" onClick={() => setMobileOpen(false)} className="text-sm uppercase tracking-widest text-white/70 hover:text-white">
                Companies
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/emails" onClick={() => setMobileOpen(false)} className="text-sm uppercase tracking-widest text-white/70 hover:text-white">
                    <Mail size={14} className="inline mr-1" /> Emails
                  </Link>
                  <Link to="/resume" onClick={() => setMobileOpen(false)} className="text-sm uppercase tracking-widest text-white/70 hover:text-white">
                    <FileText size={14} className="inline mr-1" /> Resume
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-sm text-white/70">
                    Profile
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-white/50 text-left">
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={() => { onSignInClick(); setMobileOpen(false); }} className="text-sm uppercase tracking-widest text-white/70 text-left">
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}