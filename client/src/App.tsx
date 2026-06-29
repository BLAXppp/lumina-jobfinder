import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './context/Authcontext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobList from './components/JobList';
import CompanySection from './components/CompanySection';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import AutoMailPanel from './components/AutoMailPanel';
import EmailHistory from './components/EmailHistory';
import ResumeGenerator from './components/ResumeGenerator';

function App() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Open modal when URL has ?auth=login BUT user is NOT authenticated
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('auth') === 'login' && !isAuthenticated) {
      setAuthModalOpen(true);
    }
  }, [location, isAuthenticated]);  // isAuthenticated add karo

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    // Remove ?auth=login from URL
    if (location.search.includes('auth=login')) {
      navigate(location.pathname, { replace: true });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4" 
      />
      <div className="fixed inset-0 bg-black/60 z-[1]" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <Navbar onSignInClick={() => setAuthModalOpen(true)} />
          <main className="w-full flex-1">
            <Routes>
              <Route path="/" element={<>
                <Hero onGetStarted={() => setAuthModalOpen(true)} />
                <JobList />
                <CompanySection />
                {isAuthenticated && user?.role === 'user' && <AutoMailPanel />}
              </>} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/companies" element={<CompanySection />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/emails" element={<EmailHistory />} />
              <Route path="/resume" element={<ResumeGenerator />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
      
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
export default App;