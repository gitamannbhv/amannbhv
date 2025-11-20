import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const Reveal = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: isVisible ? 1 : 0, 
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

const Experience = ({ isDark, resumeData }) => {
  return (
    <section id="experience" className={`px-6 py-40 ${isDark ? 'bg-zinc-950/50' : 'bg-zinc-50'}`}>
       <div className="max-w-7xl mx-auto">
         <Reveal>
           <div className={`flex justify-between items-end mb-20 border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
             <h2 className="text-xs font-cyber text-zinc-500 tracking-widest uppercase">Experience Log</h2>
             <span className="text-xs font-cyber text-zinc-500">2020 — 2025</span>
           </div>
         </Reveal>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
           {resumeData.experience.map((exp, i) => (
             <Reveal key={i} delay={i * 0.1}>
               <div className={`group border-l pl-6 transition-colors duration-500 ${isDark ? 'border-zinc-800 hover:border-white' : 'border-zinc-300 hover:border-black'}`}>
                 <span className="block text-xs font-cyber text-zinc-500 mb-2">{exp.time}</span>
                 <h3 className={`text-xl font-bold mb-1 font-cyber ${isDark ? 'text-white' : 'text-black'}`}>{exp.role}</h3>
                 <div className="text-sm text-zinc-400 mb-4 font-cyber">{exp.org}</div>
                 <p className={`text-sm leading-relaxed transition-colors font-cyber ${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-900'}`}>{exp.detail}</p>
               </div>
             </Reveal>
           ))}
         </div>
       </div>
    </section>
  );
};

export default Experience;