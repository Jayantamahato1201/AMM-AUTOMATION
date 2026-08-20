import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.js';

interface ThemeToggleProps {
  variant?: 'navbar' | 'mobile' | 'admin' | 'compact' | 'pill';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'navbar',
  className = '',
  showLabel = false
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const tooltipText = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={tooltipText}
        title={tooltipText}
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F27D26] ${
          isDark
            ? 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-slate-500 hover:bg-slate-800 shadow-sm'
            : 'bg-white text-slate-800 border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-xs'
        } ${className}`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* Rotating Sun */}
          <Sun
            className={`w-4 h-4 text-amber-500 transition-all duration-500 transform ${
              isDark
                ? 'opacity-0 scale-50 -rotate-90 pointer-events-none absolute'
                : 'opacity-100 scale-100 rotate-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
            }`}
          />
          {/* Rotating Moon */}
          <Moon
            className={`w-4 h-4 text-[#F27D26] transition-all duration-500 transform ${
              isDark
                ? 'opacity-100 scale-100 rotate-0 drop-shadow-[0_0_8px_rgba(242,125,38,0.6)]'
                : 'opacity-0 scale-50 rotate-90 pointer-events-none absolute'
            }`}
          />
        </div>
        <span className="text-[11px] font-mono select-none">
          {isDark ? 'Dark' : 'Light'}
        </span>
      </button>
    );
  }

  if (variant === 'mobile') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-200'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      } ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
            isDark ? 'bg-slate-800 text-[#F27D26]' : 'bg-white text-amber-500 shadow-xs'
          }`}>
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider">Appearance</p>
            <p className="text-[10px] text-slate-400 font-mono">
              {isDark ? 'Dark Industrial Theme' : 'Clean Precision Light'}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={tooltipText}
          onClick={toggleTheme}
          className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F27D26] ${
            isDark ? 'bg-[#0A192F] border-slate-700' : 'bg-amber-100 border-amber-300'
          }`}
        >
          <span className="sr-only">{tooltipText}</span>
          <span
            className={`pointer-events-none flex h-5.5 w-5.5 transform items-center justify-center rounded-full shadow-md transition duration-300 ease-in-out ${
              isDark
                ? 'translate-x-6.5 bg-[#F27D26] text-white'
                : 'translate-x-0.5 bg-white text-amber-600'
            }`}
          >
            {isDark ? (
              <Moon className="w-3 h-3 transition-transform duration-300 rotate-0" />
            ) : (
              <Sun className="w-3 h-3 transition-transform duration-300 rotate-0" />
            )}
          </span>
        </button>
      </div>
    );
  }

  // Default: navbar & admin toggle button with sliding thumb / animated icon
  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={tooltipText}
        title={tooltipText}
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative inline-flex items-center gap-1.5 h-9 px-2 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F27D26] ${
          isDark
            ? 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/90 text-slate-200 shadow-[0_0_12px_rgba(0,0,0,0.3)] hover:border-slate-600'
            : 'bg-slate-100/90 hover:bg-slate-200/90 border-slate-300 text-slate-800 shadow-xs hover:border-slate-400'
        } ${className}`}
      >
        {/* Toggle sliding container */}
        <div
          className={`relative flex items-center justify-between w-14 h-6 px-1 rounded-full transition-colors duration-300 ${
            isDark ? 'bg-slate-950/90' : 'bg-slate-200/80'
          }`}
        >
          {/* Subtle background icons for both modes */}
          <Sun
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              isDark ? 'text-slate-600 opacity-40' : 'text-amber-500 opacity-100'
            }`}
          />
          <Moon
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              isDark ? 'text-[#F27D26] opacity-100' : 'text-slate-400 opacity-40'
            }`}
          />

          {/* Sliding active thumb */}
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md transform transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              isDark
                ? 'translate-x-8 bg-[#F27D26] text-white shadow-[0_0_10px_rgba(242,125,38,0.7)]'
                : 'translate-x-0 bg-white text-amber-600 shadow-[0_1px_4px_rgba(0,0,0,0.15)]'
            }`}
          >
            {isDark ? (
              <Moon className="w-3 h-3 transform rotate-0 transition-transform duration-300" />
            ) : (
              <Sun className="w-3 h-3 transform rotate-0 transition-transform duration-300" />
            )}
          </span>
        </div>

        {showLabel && (
          <span className="text-[11px] font-bold uppercase tracking-wider font-mono pr-1 select-none">
            {isDark ? 'Dark' : 'Light'}
          </span>
        )}

        {/* Floating Tooltip on Desktop Hover */}
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-950 text-white text-[10px] font-medium tracking-wide uppercase rounded shadow-xl border border-slate-800 whitespace-nowrap z-50 pointer-events-none animate-fadeIn">
            {tooltipText}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 border-t border-l border-slate-800 rotate-45" />
          </div>
        )}
      </button>
    </div>
  );
};
