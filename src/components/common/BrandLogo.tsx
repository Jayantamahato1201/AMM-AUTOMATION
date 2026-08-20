import React from 'react';
import logoImg from '../../assets/images/amm_logo.jpg';

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
        <div className="w-12 h-12 rounded bg-white p-1 flex items-center justify-center shrink-0 shadow-sm border border-slate-700">
          <img
            src={logoImg}
            alt="AMM Automation Logo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black tracking-tight text-white leading-none">
              AMM
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-200 leading-none">
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

  // Default: navbar
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div className="w-11 h-11 bg-white p-1 rounded-sm border border-slate-200 flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#0A192F] transition-all">
        <img
          src={logoImg}
          alt="AMM Automation Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#0A192F] leading-none">
            AMM
          </span>
          <span className="text-xl sm:text-2xl font-bold tracking-tighter text-[#0A192F] leading-none">
            AUTOMATION
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#F27D26] font-bold mt-1 leading-none font-mono">
            Innovate • Automate • Control
          </p>
        )}
      </div>
    </div>
  );
};
