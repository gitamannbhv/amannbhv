import { useState, useEffect } from 'react';

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId;
    const updateMousePosition = ev => {
      animationFrameId = window.requestAnimationFrame(() => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
