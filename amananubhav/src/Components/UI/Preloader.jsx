import React, { useState, useEffect } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsFinished(true), 300);
          setTimeout(onComplete, 1200); 
          return 100;
        }
        return Math.min(prev + 5, 100); 
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex flex-col justify-between p-8 transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${isFinished ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="flex justify-between text-zinc-500 text-xs font-mono uppercase tracking-widest">
        <span>Portfolio V5</span>
        <span>System Boot</span>
      </div>
      <div className="text-[15vw] font-black leading-none text-white mix-blend-difference text-right">
        {Math.floor(progress)}%
      </div>
      <div className="w-full h-[1px] bg-white/20 overflow-hidden">
        <div className="h-full bg-white transition-all duration-200 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Preloader;