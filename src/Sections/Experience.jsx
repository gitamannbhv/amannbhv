import React from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

const Reveal = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div 
      ref={ref} 
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
    >
      {children}
    </div>
  );
};

const Experience = ({ resumeData, isDark }) => {
  // Use current color variables for dynamic styling based on theme
  const borderColor = isDark ? 'border-zinc-800' : 'border-zinc-200';
  const dotColor = isDark ? 'border-zinc-500 bg-zinc-950 group-hover:border-white group-hover:bg-white' : 'border-zinc-500 bg-white group-hover:border-black group-hover:bg-black';
  const cardBg = isDark ? 'bg-zinc-900/50 hover:bg-zinc-900' : 'bg-white hover:bg-zinc-50';

  return (
    <section id="experience" className={`px-6 py-40 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
       <div className="max-w-4xl mx-auto">
         <Reveal>
           <h2 className={`text-xs font-cyber tracking-[0.3em] uppercase mb-20 border-b pb-4 ${isDark ? 'text-zinc-600 border-zinc-900' : 'text-zinc-400 border-zinc-200'}`}>
             // 03. Experience Log
           </h2>
         </Reveal>

         {/* Main Vertical Line */}
         <div className={`relative border-l ml-3 md:ml-0 space-y-12 ${borderColor}`}>
           {resumeData.experience.map((exp, i) => (
             <Reveal key={i} delay={i * 120}>
               <div className="relative pl-8 md:pl-12 group">
                 
                 {/* Timeline Dot - Positioned absolutely relative to the vertical line (left: -5px) */}
                 <div 
                    // Adjusted vertical position to align with the top margin of the card
                    className={`absolute -left-[5px] top-0 w-[10px] h-[10px] rounded-full border transition-all duration-300 z-10 group-hover:scale-150 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.7)] ${dotColor}`}
                 ></div>
                 
                 {/* Content Card */}
                 <div className={`p-6 rounded-lg border transition-all duration-500 group-hover:-translate-y-1 relative ${cardBg} ${borderColor} group-hover:border-white/20`}>
                    
                    {/* Role Title and Time */}
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                      <h3 className={`text-xl font-bold tracking-tight transition-colors ${isDark ? 'text-zinc-100 group-hover:text-white' : 'text-zinc-800 group-hover:text-black'}`}>
                        {exp.role}
                      </h3>
                      <span className={`text-[10px] font-cyber mt-2 md:mt-0 px-3 py-1 rounded-full border tracking-wider ${isDark ? 'border-zinc-800 text-zinc-500 bg-zinc-950' : 'border-zinc-200 text-zinc-500 bg-zinc-100'}`}>
                        {exp.time}
                      </span>
                    </div>
                    
                    {/* Organization Name */}
                    <div className={`text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-400'}`}></span>
                      {exp.org}
                    </div>
                    
                    {/* Detail Paragraph */}
                    <p className={`text-sm leading-relaxed max-w-2xl font-sans transition-colors ${isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-zinc-600 group-hover:text-zinc-800'}`}>
                      {exp.detail}
                    </p>
                 </div>
               </div>
             </Reveal>
           ))}
         </div>
       </div>
    </section>
  );
};

export default Experience;