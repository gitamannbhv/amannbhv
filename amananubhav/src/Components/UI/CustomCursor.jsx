import React, { useEffect, useState } from 'react';

const CustomCursor = ({ isHovering, isDark }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999] mix-blend-difference transition-transform duration-100 ease-out"
      style={{ 
        left: pos.x, 
        top: pos.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Triangular Space Cursor */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin-slow">
        <path 
          d="M20 5L35 35H5L20 5Z" 
          stroke={isDark ? "white" : "black"} 
          strokeWidth="1.5"
          fill="none"
          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
        {/* Inner Dot Blink */}
        <circle cx="20" cy="25" r="2" fill={isDark ? "white" : "black"} className="animate-ping" />
      </svg>
    </div>
  );
};

export default CustomCursor;