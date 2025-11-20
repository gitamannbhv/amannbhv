import React, { useEffect, useRef } from 'react';

const WireframeTunnel = ({ 
  gridColor = "rgba(255,255,255,0.1)", 
  burstColor = "rgba(255,255,255,1)", 
  isDark = true 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Configuration
    const numRings = 40; 
    const numSlices = 24;
    const rotationSpeed = 0.001; 
    const speed = 0.005; 

    // State
    let rotation = 0;
    let offset = 0;
    let pulses = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawnPulse = () => {
      pulses.push({
        slice: Math.floor(Math.random() * numSlices),
        depth: 0, 
        speed: 0.015 + Math.random() * 0.01, 
        length: 0.15, 
        opacity: 1
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.sqrt(cx**2 + cy**2);

      rotation += rotationSpeed;
      offset = (offset + speed) % 1;

      if (Math.random() < 0.05) spawnPulse();

      ctx.lineWidth = 1;
      
      const ringRadii = [];
      for (let i = 0; i < numRings; i++) {
        const progress = (i / numRings + offset) % 1;
        const r = Math.pow(progress, 3) * maxRadius;
        ringRadii.push({ r, progress });
      }
      ringRadii.sort((a, b) => a.r - b.r);

      // 1. Radial Lines
      for (let s = 0; s < numSlices; s++) {
        const baseAngle = (s / numSlices) * Math.PI * 2 + rotation;
        ctx.beginPath();
        let firstPoint = true;

        for (let i = 0; i < ringRadii.length; i++) {
           const { r, progress } = ringRadii[i];
           const twist = progress * 0.5; 
           const angle = baseAngle + twist;
           const x = cx + Math.cos(angle) * r;
           const y = cy + Math.sin(angle) * r;

           if (firstPoint) { ctx.moveTo(x, y); firstPoint = false; } 
           else { ctx.lineTo(x, y); }
        }
        ctx.strokeStyle = isDark ? `rgba(255,255,255,0.08)` : `rgba(0,0,0,0.08)`;
        ctx.stroke();
      }

      // 2. Concentric Rings
      for (let i = 0; i < ringRadii.length; i++) {
        const { r, progress } = ringRadii[i];
        ctx.beginPath();
        for (let s = 0; s <= numSlices; s++) {
           const baseAngle = (s / numSlices) * Math.PI * 2 + rotation;
           const twist = progress * 0.5;
           const angle = baseAngle + twist;
           const x = cx + Math.cos(angle) * r;
           const y = cy + Math.sin(angle) * r;
           if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isDark ? `rgba(255,255,255,${0.05 + progress * 0.1})` : `rgba(0,0,0,${0.05 + progress * 0.1})`;
        ctx.stroke();
      }

      // 3. Light Bursts
      ctx.lineCap = 'round';
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.depth += p.speed;
        if (p.depth > 1) { pulses.splice(i, 1); continue; }

        const headDepth = p.depth;
        const tailDepth = Math.max(0, p.depth - p.length);
        const rHead = Math.pow(headDepth, 3) * maxRadius;
        const rTail = Math.pow(tailDepth, 3) * maxRadius;
        const baseAngle = (p.slice / numSlices) * Math.PI * 2 + rotation;
        const angleHead = baseAngle + (headDepth * 0.5);
        const angleTail = baseAngle + (tailDepth * 0.5);
        const xHead = cx + Math.cos(angleHead) * rHead;
        const yHead = cy + Math.sin(angleHead) * rHead;
        const xTail = cx + Math.cos(angleTail) * rTail;
        const yTail = cy + Math.sin(angleTail) * rTail;

        ctx.shadowBlur = 10;
        ctx.shadowColor = burstColor;
        ctx.strokeStyle = burstColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xTail, yTail);
        ctx.lineTo(xHead, yHead);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridColor, burstColor, isDark]);

  // FIXED: Added pointer-events-none class explicitly
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default WireframeTunnel;