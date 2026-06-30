import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setFormData({ name: '', email: '', password: '', role: 'user', otp: '' });
      setCountdown(0);
    }
  }, [isOpen, mode]);

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOTP = async () => {
    if (!formData.email) { alert('Please enter email'); return; }
    
    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/api/auth/send-otp' : '/api/auth/send-login-otp';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      
      const data = await res.json();
      if (data.success) {
        setStep('otp');
        startCountdown();
        alert('✅ OTP sent! Check your email.');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'form' && mode === 'signup') {
      await sendOTP();
      return;
    }
    
    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/verify-and-register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        
        if (data.success) {
          await login(data.token);  // await kar lo
          onClose();                // bas close karo, reload mat karo!
          // ❌ window.location.reload() - YE HATAO!
        } else {
          alert(data.message);
        }
      } else {
        // Login
        const credentials: any = { email: formData.email, password: formData.password };
        if (formData.otp) credentials.otp = formData.otp;
        
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        const data = await res.json();
        
        if (data.success) {
          await login(data.token);  // await kar lo
          onClose();                // bas close karo!
          // ❌ window.location.reload() - YE HATAO!
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      alert('Authentication failed');
    } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md liquid-glass rounded-3xl p-8 relative"
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {step === 'otp' ? '🔐 Enter OTP' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-white/50 text-sm mt-2">
              {step === 'otp' ? `Code sent to ${formData.email}` : 'Secure access with OTP'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'form' ? (
              <>
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="you@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {mode === 'signup' && (
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Account Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'user' })}
                        className={`py-2 rounded-xl text-sm ${formData.role === 'user' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-white/5 text-white/50 border border-white/10'}`}
                      >
                        Job Seeker
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, role: 'company' })}
                        className={`py-2 rounded-xl text-sm ${formData.role === 'company' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-white/5 text-white/50 border border-white/10'}`}
                      >
                        Company
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Sending...' : mode === 'signup' ? 'Send OTP' : 'Sign In'}
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.otp}
                    onChange={e => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="000000"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || formData.otp.length !== 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>

                <div className="flex justify-between text-sm">
                  <button type="button" onClick={() => setStep('form')} className="text-white/40 hover:text-white">
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={countdown > 0}
                    className="text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setStep('form');
              }}
              className="text-white/40 hover:text-white text-sm"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}