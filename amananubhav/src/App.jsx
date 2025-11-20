import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './utils/firebase';

// Components
import LensHero from './components/Hero/LensHero';
import Navbar from './components/Layout/Navbar';
import About from './sections/About';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Achievements from './sections/Achievements';
import Footer from './components/Layout/Footer';
import Preloader from './components/UI/Preloader';
import SecureVault from './components/UI/SecureVault';
import TerminalOverlay from './components/UI/TerminalOverlay';
import { RESUME } from './data/resume';

const App = () => {
  // FIXED: Added ('home') initialization
  const [activeSection, setActiveSection] = useState('home');
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Theme State - Defaults to Dark
  const [isDark, setIsDark] = useState(true); 

  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, setUser);
      signInAnonymously(auth).catch(console.error);
      return () => unsub();
    }
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      <div className={`font-sans min-h-screen transition-colors duration-700 selection:bg-gray-500/30 ${isDark ? 'bg-black text-zinc-400' : 'bg-white text-zinc-600'}`}>
        
        {isVaultOpen && <SecureVault onClose={() => setIsVaultOpen(false)} isDark={isDark} />}
        <TerminalOverlay isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        
        <Navbar 
            activeSection={activeSection} 
            setActiveSection={setActiveSection} 
            isDark={isDark} 
            toggleTheme={toggleTheme}
            openTerminal={() => setIsTerminalOpen(true)}
            openVault={() => setIsVaultOpen(true)}
        />

        <LensHero isDark={isDark} />
        
        {RESUME ? (
            <main className={`relative z-10 ${isDark ? 'bg-zinc-950' : 'bg-gray-50'}`}>
                <About resumeData={RESUME} />
                <Projects resumeData={RESUME} isDark={isDark} />
                <Experience resumeData={RESUME} isDark={isDark} />
                <Achievements resumeData={RESUME} />
            </main>
        ) : (
            <div className="p-20 text-center text-red-500 font-mono">Error: System Data Corrupted.</div>
        )}

        <Footer isDark={isDark} />
      </div>
    </>
  );
};

export default App;