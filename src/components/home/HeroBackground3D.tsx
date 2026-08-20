import React, { useEffect, useRef } from 'react';

interface HeroBackground3DProps {
  mouseX: number;
  mouseY: number;
}

export const HeroBackground3D: React.FC<HeroBackground3DProps> = ({ mouseX, mouseY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic particle canvas for automation data telemetry
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes definition
    const particleCount = Math.min(Math.floor(width / 35), 45);
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    const colors = ['#f27d26', '#38bdf8', '#64748b', '#0284c7'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();

        // Draw thin connection lines between adjacent particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.globalAlpha = (1 - dist / 110) * 0.15;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* LAYER 1: Industrial Control-Room Background Image */}
      <div
        className="absolute inset-y-0 right-0 w-full lg:w-3/5 opacity-10 dark:opacity-30 mix-blend-multiply dark:mix-blend-luminosity overflow-hidden transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseX * -12}px, ${mouseY * -8}px, 0)`,
        }}
      >
        <img
          src="/images/hero_automation.jpg"
          alt="Industrial Automation Control Systems"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#071324] dark:via-[#071324]/80 dark:to-transparent" />
      </div>

      {/* LAYER 2: 3D Technical Perspective Grid with Flowing Scan Wave */}
      <div
        className="absolute inset-0 opacity-25 dark:opacity-20 transition-transform duration-500 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(${mouseY * 4}deg) rotateY(${mouseX * 4}deg) translate3d(${mouseX * -8}px, ${mouseY * -6}px, 0)`,
        }}
      >
        <div className="w-full h-full bg-[linear-gradient(to_right,#94a3b8_1px,transparent_1px),linear-gradient(to_bottom,#94a3b8_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      </div>

      {/* LAYER 3: Interactive Automation Telemetry Particles Canvas */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseX * -20}px, ${mouseY * -15}px, 0)`,
        }}
      >
        <canvas ref={canvasRef} className="w-full h-full opacity-60 dark:opacity-80" />
      </div>

      {/* LAYER 4: Thin Engineering Circuit & Bus Wireframe Vectors */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30 transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${mouseX * 15}px, ${mouseY * 10}px, 0)`,
        }}
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 100 200 L 350 200 L 450 300 L 900 300 L 1000 180 L 1400 180"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="6 4"
        />
        <path
          d="M 200 450 L 500 450 L 600 380 L 1100 380 L 1250 500 L 1440 500"
          stroke="#f27d26"
          strokeWidth="1"
          strokeDasharray="8 6"
        />
        <circle cx="450" cy="300" r="3" fill="#38bdf8" />
        <circle cx="900" cy="300" r="3" fill="#38bdf8" />
        <circle cx="600" cy="380" r="3.5" fill="#f27d26" />
        <circle cx="1100" cy="380" r="3.5" fill="#f27d26" />
      </svg>

      {/* LAYER 5: Soft Floating Radial Ambient Spotlights (Warm Orange & Electric Blue) */}
      <div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-[#f27d26]/10 dark:bg-[#f27d26]/15 blur-3xl transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${mouseX * 30}px, ${mouseY * 25}px, 0)`,
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 rounded-full bg-sky-500/10 dark:bg-sky-500/15 blur-3xl transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          transform: `translate3d(${mouseX * -25}px, ${mouseY * -20}px, 0)`,
        }}
      />
    </div>
  );
};
