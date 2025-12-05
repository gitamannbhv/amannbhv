import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import useScrollReveal from '../Hooks/useScrollReveal'; // Note: Corrected casing if your folder is 'Hooks'
import { ADVENTURES } from '../Data/adventures';

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

const Adventures = ({ onOpenStory }) => {
  return (
    <section id="adventures" className="px-6 py-40 bg-zinc-950 border-t border-zinc-900/50">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-zinc-900 pb-4">
            <div>
              <h2 className="text-xs font-cyber tracking-[0.3em] uppercase text-zinc-600 mb-2 flex items-center gap-2">
                <Sparkles size={12} className="text-green-500" />
                The Lab & Life
              </h2>
              <h3 className="text-3xl font-bold text-white">Adventures & Inventions</h3>
            </div>
            <p className="text-zinc-500 text-sm max-w-md mt-4 md:mt-0 text-right font-mono text-[10px] tracking-wide">
              [ LOGS: EXPERIMENTAL_PROJECTS // PERSONAL_QUESTS ]
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ADVENTURES.map((story, i) => (
            <Reveal key={story.id} delay={i * 100}>
              <div
                onClick={() => onOpenStory(story)}
                className="group cursor-pointer relative aspect-[4/5] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  {/* Top Label */}
                  <div className="mb-auto flex justify-between w-full transform -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-[9px] font-cyber text-green-400 uppercase tracking-wider">
                      {story.category}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[10px] font-mono text-zinc-500 mb-3 block border-b border-zinc-800 pb-2 w-fit">
                      {story.date}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-green-400 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 font-sans font-light">
                      {story.subtitle}
                    </p>

                    {/* 'Read' indicator */}
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-cyber text-zinc-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <span>ACCESS_LOG</span>
                      <ArrowUpRight size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Adventures;