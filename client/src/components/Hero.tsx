import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="w-full py-20 md:py-32 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-xs uppercase tracking-widest text-white/70">AI-Powered Job Matching</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Find Your Next <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Cosmic Opportunity
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with top companies worldwide. Set your skills and preferences, 
          and let our auto-email system send your profile to matching employers instantly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/jobs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-sm uppercase tracking-widest font-semibold hover:bg-white/90 transition-all shadow-lg"
          >
            Explore Jobs <ArrowRight size={16} />
          </a>
          <button 
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-sm uppercase tracking-widest font-medium hover:bg-white/20 transition-all"
          >
            Get Started
          </button>
        </div>
      </motion.div>
    </section>
  );
}