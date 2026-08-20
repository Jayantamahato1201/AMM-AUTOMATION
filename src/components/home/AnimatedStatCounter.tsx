import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedStatCounterProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  accentColor?: string;
  progressPercent?: number;
}

export const AnimatedStatCounter: React.FC<AnimatedStatCounterProps> = ({
  icon,
  value,
  label,
  accentColor = '#f27d26',
  progressPercent = 100,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Handle numeric count up
    const numericMatch = value.match(/\d+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatch[0], 10);
    const suffix = value.replace(numericMatch[0], '');
    const prefix = value.substring(0, value.indexOf(numericMatch[0]));

    let start = 0;
    const duration = 1400; // ms
    const startTime = performance.now();

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * targetNum);

      setDisplayValue(`${prefix}${current}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className="group relative bg-slate-50 sm:bg-transparent dark:bg-slate-900/40 dark:sm:bg-transparent p-3 sm:p-0 rounded sm:rounded-none border border-slate-200 sm:border-none dark:border-slate-800/60 dark:sm:border-none transition-all"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={isInView ? { scale: [0.8, 1.15, 1], rotate: [0, -5, 0] } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="shrink-0 group-hover:scale-110 transition-transform"
        >
          {icon}
        </motion.div>
        <span className="text-2xl font-bold text-[#0A192F] dark:text-white font-mono tracking-tight">
          {displayValue}
        </span>
      </div>

      <p className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1 font-semibold">
        {label}
      </p>

      {/* Thin Animated Accent Progress Line */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-[2px] mt-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${progressPercent}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="h-full"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </div>
  );
};
