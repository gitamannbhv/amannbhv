import React from 'react';
import { Terminal, Lock, Sun, Moon } from 'lucide-react';
import NavButton from '../UI/NavButton';

const Navbar = ({ activeSection, setActiveSection, isDark, toggleTheme, openTerminal, openVault }) => {
  return (
    <nav className={`fixed top-0 w-full z-40 backdrop-blur-none border-b-0 transition-colors duration-500`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <span 
          className={`text-xl font-bold tracking-tighter cursor-pointer z-50 font-cyber ${isDark ? 'text-white' : 'text-black'}`} 
          onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
        >
          AA.
        </span>
        
        <div className="hidden md:flex gap-10">
           {['projects', 'experience'].map(id => (
             <NavButton 
                key={id} 
                id={id} 
                label={id.toUpperCase()} 
                onClick={setActiveSection} 
                active={activeSection === id} 
                isDark={isDark} 
             />
           ))}
           <NavButton 
                id="footer" 
                label="CONTACT" 
                onClick={() => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth'})} 
                isDark={isDark} 
            />
        </div>

        <div className="flex items-center gap-4 z-50">
          <button onClick={toggleTheme} className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-zinc-400 hover:text-white' : 'hover:bg-black/5 text-zinc-600 hover:text-black'}`}>
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={openTerminal} className={`p-2 transition-colors ${isDark ? 'hover:text-green-400' : 'hover:text-blue-600'}`} title="Open AI Terminal">
            <Terminal size={18}/>
          </button>
          <button 
            onClick={openVault}
            className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold tracking-widest rounded-sm transition-colors border font-cyber ${isDark ? 'bg-red-900/20 text-red-500 border-red-900/50 hover:bg-red-900/40' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}
          >
            <Lock size={12} /> VAULT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;