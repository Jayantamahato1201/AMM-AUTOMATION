import React from 'react';
import { motion } from 'motion/react';

const logoImg = '/images/amm_logo.jpg';

interface BrandLogoProps {
  variant?: 'navbar' | 'footer' | 'symbol' | 'full' | 'admin';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'navbar',
  className = '',
  showTagline = true,
}) => {
  if (variant === 'symbol') {
    return (
      <div className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}>
        <img
          src={logoImg}
          alt="AMM Automation Symbol"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <img
          src={logoImg}
          alt="AMM Automation Logo - Innovate • Automate • Control"
          referrerPolicy="no-referrer"
          className="w-auto h-auto max-h-16 object-contain"
        />
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        <div className="w-12 h-12 rounded bg-white p-1 flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
          <img
            src={logoImg}
            alt="AMM Automation Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
              AMM
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-200 leading-none">
              AUTOMATION
            </span>
          </div>
          {showTagline && (
            <p className="text-[10px] text-[#F27D26] font-bold uppercase tracking-[0.2em] mt-1 font-mono">
              Innovate • Automate • Control
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'admin') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="w-9 h-9 rounded bg-white p-0.5 flex items-center justify-center shrink-0 shadow-sm border border-slate-700">
          <img
            src={logoImg}
            alt="AMM Automation Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black tracking-tight text-white leading-none">
            AMM AUTOMATION
          </span>
          <span className="text-[9px] text-[#F27D26] font-mono uppercase tracking-widest mt-0.5">
            Control Console
          </span>
        </div>
      </div>
    );
  }

  // Default: navbar - Premium 3D depth with subtle animation & interactive tilt
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -2 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02 }}
      className={`flex items-center gap-2 sm:gap-3 group min-w-0 ${className}`}
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="w-9 h-9 sm:w-11 sm:h-11 bg-white p-1 rounded-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#F27D26] group-hover:shadow-[0_4px_16px_rgba(242,125,38,0.22)] transition-all duration-300 transform-gpu group-hover:[transform:rotateY(-8deg)_rotateX(6deg)_translateZ(6px)]"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={logoImg}
          alt="AMM Automation Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
        />
      </div>
      <div
        className="flex flex-col min-w-0 transform-gpu group-hover:[transform:translateZ(4px)] transition-transform duration-300"
      >
        <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
          <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tighter text-[#0A192F] dark:text-white leading-none transition-colors">
            AMM
          </span>
          <span className="text-base sm:text-xl lg:text-2xl font-bold tracking-tighter text-[#0A192F] dark:text-slate-200 leading-none transition-colors">
            AUTOMATION
          </span>
        </div>
        {showTagline && (
          <p className="text-[8px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[#F27D26] font-bold mt-0.5 sm:mt-1 leading-none font-mono truncate">
            Innovate • Automate • Control
          </p>
        )}
      </div>
    </motion.div>
  );
};
