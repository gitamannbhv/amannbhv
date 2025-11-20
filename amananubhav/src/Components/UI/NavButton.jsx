import React from 'react';

const NavButton = ({ id, label, onClick, active, isDark }) => (
  <button 
    onClick={() => {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      if (onClick) onClick(id);
    }}
    className={`relative px-4 py-2 text-xs font-bold tracking-widest transition-all duration-300 font-cyber ${
      active 
        ? (isDark ? 'text-white' : 'text-black font-black border-b border-black') 
        : (isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-500 hover:text-black')
    }`}
  >
    {label}
  </button>
);

export default NavButton;