import React from 'react';
import { Award, Star, Trophy } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

const Reveal = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
};

const Achievements = ({ resumeData }) => {
  return (
    <section className="px-6 py-20 bg-zinc-950 border-y border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <Reveal>
           <h2 className="text-xs font-cyber tracking-[0.3em] uppercase text-zinc-600 mb-16 text-center">
             // 04. Honors & Recognition
           </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
           {resumeData.achievements?.map((item, i) => (
             <Reveal key={i} delay={i * 100}>
               <div className="bg-zinc-950 p-8 h-full hover:bg-zinc-900/50 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Trophy size={48} />
                  </div>
                  <div className="flex items-baseline gap-2 mb-4 text-zinc-700 font-mono text-xs">
                    <span>0{i+1}</span>
                    <span className="w-full h-px bg-zinc-900"></span>
                  </div>
                  <p className="text-sm font-cyber text-zinc-300 leading-relaxed">
                    {item}
                  </p>
               </div>
             </Reveal>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;