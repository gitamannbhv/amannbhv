import React from 'react';
import useScrollReveal from '../../Hooks/useScrollReveal';
import Magnetic from '../UI/Magnetic';
import { Github, Linkedin, Mail } from 'lucide-react';

const Reveal = ({ children }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s ease' }}>
      {children}
    </div>
  );
};

const Footer = ({ isDark }) => {
  const socialLinks = [
    { icon: <Mail size={20} />, href: "mailto:amannbhv.cswork@gmail.com", label: "Email" },
    { icon: <Linkedin size={20} />, href: "https://www.linkedin.com/in/amananubhav/", label: "LinkedIn" },
    { icon: <Github size={20} />, href: "https://github.com/gitamannbhv", label: "GitHub" }
  ];

  return (
    <footer className={`min-h-screen flex flex-col justify-center items-center px-6 border-t relative overflow-hidden ${isDark ? 'border-white/10' : 'border-black/10'}`}>
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-black to-black' : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-100/50 via-white to-white'}`}></div>

      <Reveal>
        <h2 className={`text-[15vw] font-black leading-none select-none tracking-tighter font-cyber transition-all duration-500 cursor-default mb-12 ${isDark ? 'text-zinc-900 hover:text-white hover:drop-shadow-[0_0_60px_rgba(255,255,255,0.8)]' : 'text-zinc-100 hover:text-zinc-500 hover:drop-shadow-[0_0_60px_rgba(0,0,0,0.5)]'}`}>
          ANUBHAV
        </h2>
      </Reveal>

      <div className="flex items-center gap-6 relative z-10">
        {socialLinks.map((link, index) => (
          <Magnetic key={index}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 group ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-white hover:bg-white hover:text-black' : 'border-zinc-200 bg-white text-zinc-600 hover:border-black hover:bg-black hover:text-white'}`}
              aria-label={link.label}
            >
              {link.icon}
            </a>
          </Magnetic>
        ))}
      </div>

      <p className={`absolute bottom-10 text-xs font-mono ${isDark ? 'text-zinc-800' : 'text-zinc-300'}`}>&copy; {new Date().getFullYear()} AMAN ANUBHAV. ALL RIGHTS RESERVED.</p>
    </footer>
  );
};

export default Footer;