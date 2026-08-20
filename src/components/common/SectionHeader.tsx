import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  dark = false
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`mb-10 lg:mb-14 ${isCentered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
      {badge && (
        <span className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm mb-3 block">
          {badge}
        </span>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
          dark ? 'text-white' : 'text-[#0A192F]'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-sm sm:text-base leading-relaxed ${
            dark ? 'text-slate-300 font-light' : 'text-slate-500'
          }`}
        >
          {subtitle}
        </p>
      )}
      <div className={`mt-4 flex items-center gap-1.5 ${isCentered ? 'justify-center' : ''}`}>
        <div className="w-10 h-1 bg-[#F27D26]" />
        <div className="w-4 h-1 bg-[#0A192F] dark:bg-white" />
      </div>
    </div>
  );
};
