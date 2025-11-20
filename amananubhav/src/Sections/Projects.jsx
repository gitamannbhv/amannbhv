import React from 'react';
import { ArrowRight } from 'lucide-react';
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

const Projects = ({ isDark, resumeData }) => {
  return (
    <section id="projects" className="px-6 py-40 max-w-7xl mx-auto">
      <Reveal>
        <h2 className={`text-xs font-mono mb-20 tracking-widest uppercase border-b pb-4 font-cyber ${isDark ? 'text-zinc-500 border-zinc-800' : 'text-zinc-400 border-zinc-200'}`}>Selected Works (05)</h2>
      </Reveal>
      <div className="flex flex-col">
        {resumeData.projects.map((p, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <a href={p.link} target="_blank" className={`group relative border-t py-12 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 transition-colors px-4 -mx-4 rounded-lg ${isDark ? 'border-zinc-900 hover:bg-white/5' : 'border-zinc-200 hover:bg-black/5'}`}>
               <span className="text-xs font-cyber w-24 text-zinc-500">{p.year}</span>
               <div className="flex-1">
                 <h3 className={`text-3xl md:text-5xl font-bold mb-2 transition-colors font-cyber ${isDark ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-800 group-hover:text-black'}`}>{p.title}</h3>
                 <div className="flex flex-wrap gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    {p.tech.map(t => <span key={t} className={`text-[10px] uppercase tracking-wider border px-2 py-1 rounded-full font-cyber ${isDark ? 'border-white/10 text-zinc-400' : 'border-black/10 text-zinc-600'}`}>{t}</span>)}
                 </div>
               </div>
               <div className={`md:w-1/3 text-sm font-light leading-relaxed transition-colors font-cyber ${isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-900'}`}>{p.desc}</div>
               <div className={`absolute right-8 top-12 opacity-0 group-hover:opacity-100 transition-all duration-300 -rotate-45 group-hover:rotate-0 ${isDark ? 'text-white' : 'text-black'}`}><ArrowRight size={24} /></div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Projects;