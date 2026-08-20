import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Sliders,
  Radio,
  Workflow,
  Sparkles,
} from 'lucide-react';

export interface HeroSceneProps {
  className?: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Normalized mouse coordinates (-1 to 1)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth lerp animation loop for physical camera parallax
  useEffect(() => {
    if (shouldReduceMotion) return;

    let animId: number;
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const tick = () => {
      setMousePos((prev) => ({
        x: lerp(prev.x, targetPos.x, 0.06),
        y: lerp(prev.y, targetPos.y, 0.06),
      }));
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [targetPos, shouldReduceMotion]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || shouldReduceMotion) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setTargetPos({ x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) });
    },
    [shouldReduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTargetPos({ x: 0, y: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Parallax translation offsets
  const bgTranslateX = mousePos.x * -12;
  const bgTranslateY = mousePos.y * -8;
  const fgTranslateX = mousePos.x * 10;
  const fgTranslateY = mousePos.y * 8;
  const cardRotateY = mousePos.x * 5;
  const cardRotateX = mousePos.y * -4;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-[620px] lg:max-w-none h-[420px] sm:h-[480px] lg:h-[530px] flex items-center justify-center select-none perspective-[1200px] ${className}`}
    >
      {/* Outer Glow & Architectural Ambient Grounding (Light Theme) */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-slate-200/40 via-blue-50/50 to-orange-50/40 rounded-2xl blur-2xl -z-10 pointer-events-none" />

      {/* 3D Parallax Master Stage */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          transform: shouldReduceMotion
            ? 'none'
            : `rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.12),0_1px_3px_rgba(15,23,42,0.08)] border border-slate-200/90 bg-slate-100"
      >
        {/* =================================================================== */}
        {/* LAYER 1: BACKGROUND INDUSTRIAL PLANT ENVIRONMENT (Depth of Field) */}
        {/* =================================================================== */}
        <div
          style={{
            transform: shouldReduceMotion
              ? 'scale(1.05)'
              : `scale(1.08) translate3d(${bgTranslateX}px, ${bgTranslateY}px, -20px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {/* Real Industrial Facility & Process Plant Background */}
          <img
            src="/images/hero_automation.jpg"
            alt="Modern Industrial Process Facility with Stainless Pipelines"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter blur-[2px] brightness-[1.02] contrast-[0.98]"
          />

          {/* Clean High-Key Architectural Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-slate-900/25" />
          
          {/* Subtle Technical Engineering Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* =================================================================== */}
        {/* LAYER 2: FOREGROUND REALISTIC PLC CONTROL CABINET (Razor Sharp Focus) */}
        {/* =================================================================== */}
        <div
          style={{
            transform: shouldReduceMotion
              ? 'none'
              : `translate3d(${fgTranslateX}px, ${fgTranslateY}px, 20px)`,
            transition: 'transform 0.1s ease-out',
          }}
          className="absolute inset-3 sm:inset-4 md:inset-5 rounded-lg overflow-hidden border border-white/60 shadow-[0_12px_36px_rgba(0,0,0,0.25)] bg-slate-900"
        >
          {/* High-Resolution Photograph of Industrial PLC & Wiring Cabinet */}
          <img
            src="/images/plc_control_panel.jpg"
            alt="Industrial Automation PLC Control Cabinet with Terminal Blocks and Wiring Harnesses"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-[1.02] filter contrast-[1.05] brightness-[0.98]"
          />

          {/* Specular Metallic Light Reflection Sweep */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: ['-100%', '200%'],
                  }
            }
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-12 pointer-events-none"
          />

          {/* Realistic Cabinet Bezel Edge Highlights */}
          <div className="absolute inset-0 border border-white/20 rounded-lg pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* ================================================================= */}
          {/* HARDWARE MICRO-LEDS & DIAGNOSTIC EMITTERS (Physically mapped) */}
          {/* ================================================================= */}
          
          {/* 1. PLC CPU Master RUN / COMM Indicators */}
          <div className="absolute top-[28%] left-[24%] flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
            {/* DC 24V Power (Solid Emerald) */}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            {/* CPU RUN (Pulsing Emerald) */}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            {/* PROFINET BUS TX/RX (Rapid Micro Flicker) */}
            <motion.span
              animate={{ opacity: [1, 0.3, 0.9, 0.2, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]"
            />
            {/* AMM System Alert (Soft Orange) */}
            <span className="w-1.5 h-1.5 rounded-full bg-[#f27d26] shadow-[0_0_6px_#f27d26]" />
          </div>

          {/* 2. I/O Slice Scanning LED Array (Simulated High-Speed Fieldbus Scan) */}
          <div className="absolute top-[44%] left-[32%] grid grid-cols-4 gap-1 p-1 bg-black/50 rounded-xs border border-white/10 backdrop-blur-xs">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.span
                key={i}
                animate={{
                  opacity: i % 2 === 0 ? [0.9, 0.3, 0.9] : [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 0.6 + (i % 4) * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={`w-1 h-1 rounded-full ${
                  i === 3 ? 'bg-[#f27d26]' : 'bg-emerald-400'
                } shadow-[0_0_4px_currentColor]`}
              />
            ))}
          </div>

          {/* 3. Integrated HMI Touch Panel Screen Live Sparkline */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xs p-2 sm:p-2.5 shadow-xl flex items-center gap-3">
            <div className="w-10 sm:w-12 h-6 bg-slate-900 rounded-xs border border-slate-800 flex items-center justify-center overflow-hidden relative">
              {/* Animated Live SCADA Waveform */}
              <svg className="w-full h-full text-emerald-400" viewBox="0 0 40 20">
                <path
                  d="M0 10 Q 10 2, 20 10 T 40 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="animate-pulse"
                />
              </svg>
              <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-[#f27d26]" />
            </div>
            <div>
              <div className="text-[9px] font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>HMI SCADA // 60 FPS</span>
              </div>
              <span className="text-[8px] font-mono text-slate-400">
                Process Loop: 4-20mA Active
              </span>
            </div>
          </div>

          {/* 4. Atmospheric Shimmering Dust Micro-Motes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            {[10, 30, 50, 70, 85].map((left, idx) => (
              <motion.div
                key={idx}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: ['0%', '-100%'],
                        opacity: [0, 0.8, 0],
                      }
                }
                transition={{
                  duration: 6 + idx * 1.5,
                  repeat: Infinity,
                  delay: idx * 0.8,
                  ease: 'linear',
                }}
                style={{ left: `${left}%`, top: '100%' }}
                className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px]"
              />
            ))}
          </div>
        </div>

        {/* =================================================================== */}
        {/* LAYER 3: FLOATING B2B ENGINEERING TELEMETRY BADGES (Light Theme) */}
        {/* Clean, frosted glassmorphic UI panels with high-contrast text */}
        {/* =================================================================== */}

        {/* BADGE 1 (Top Right): Central PLC Operating Status */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            transform: shouldReduceMotion
              ? 'none'
              : `translate3d(${fgTranslateX * 1.3}px, ${fgTranslateY * 1.3}px, 35px)`,
          }}
          className="absolute top-3 sm:top-5 right-3 sm:right-5 z-20 pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_8px_24px_rgba(15,23,42,0.12)] px-3.5 py-2.5 rounded-xs flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#0A192F] uppercase block">
                  PLC CONTROLLER // RUN
                </span>
                <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-xs font-mono">
                  ONLINE
                </span>
              </div>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                Scan Cycle: 0.8ms • Deterministic
              </p>
            </div>
          </div>
        </motion.div>

        {/* BADGE 2 (Bottom Left): Plant Instrumentation & OEE */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            transform: shouldReduceMotion
              ? 'none'
              : `translate3d(${fgTranslateX * 1.2}px, ${fgTranslateY * 1.2}px, 30px)`,
          }}
          className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 z-20 pointer-events-none max-w-[210px]"
        >
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-[0_12px_28px_rgba(15,23,42,0.14)] p-3 rounded-xs space-y-2">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F27D26] flex items-center gap-1 font-mono">
                <Activity className="w-3.5 h-3.5" />
                <span>Field Instrumentation</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-bold">
                99.8% OEE
              </span>
            </div>
            <div className="space-y-1 text-[9px] font-mono text-slate-600">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">PROFINET / MODBUS</span>
                <span className="text-emerald-600 font-semibold">SYNCED</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#0284c7] via-[#f27d26] to-[#10b981] h-full w-[98%]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* BADGE 3 (Top Left): Safety & IEC Compliance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            transform: shouldReduceMotion
              ? 'none'
              : `translate3d(${fgTranslateX * 1.1}px, ${fgTranslateY * 1.1}px, 25px)`,
          }}
          className="absolute top-4 sm:top-5 left-3 sm:left-5 z-20 pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xs flex items-center gap-2 shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#0A192F] font-mono block">
                SIL-3 / IEC 62061
              </span>
              <span className="text-[8px] text-slate-500 font-mono">
                Fail-Safe Certified
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
