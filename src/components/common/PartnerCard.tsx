import React from 'react';
import { ExternalLink, Globe, ArrowRight, ShieldCheck, Code2, Cpu, CheckCircle2 } from 'lucide-react';
import { PartnerCompanyItem } from '../../types.js';

interface PartnerCardProps {
  partner: PartnerCompanyItem | {
    id: string;
    companyName?: string;
    name?: string;
    websiteUrl?: string;
    website?: string;
    displayUrl?: string;
    category: string;
    shortDescription?: string;
    description?: string;
    tags?: string[];
    establishedRole?: string;
  };
  variant?: 'featured' | 'standard';
}

export const PartnerCard: React.FC<PartnerCardProps> = ({ partner, variant = 'featured' }) => {
  const companyName = partner.companyName || (partner as any).name || 'Global Infosoft';
  const websiteUrl = partner.websiteUrl || (partner as any).website || 'https://globalinfosoft.com';
  const displayUrl = partner.displayUrl || websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const description = partner.shortDescription || (partner as any).description || '';
  const tags = partner.tags || [];

  // Generate initials for the logo placeholder
  const initials = companyName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      id={`partner-card-${partner.id}`}
      className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800/90 shadow-sm hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-300 flex flex-col justify-between border-l-4 border-l-[#0A192F] dark:border-l-slate-700 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26] relative overflow-hidden group"
    >
      {/* Subtle Industrial Grid Background overlay */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[linear-gradient(to_right,#F1F5F9_1px,transparent_1px),linear-gradient(to_bottom,#F1F5F9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-60 dark:opacity-20 pointer-events-none" />

      {/* Top Banner & Header */}
      <div className="p-5 sm:p-6 lg:p-8 relative space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#0A192F] dark:text-slate-200">
            <Code2 className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
            <span className="truncate">{partner.category}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono min-w-0">
            <Globe className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 dark:text-slate-300 hover:text-[#F27D26] dark:hover:text-[#F27D26] transition-colors font-semibold truncate max-w-[180px] sm:max-w-xs"
            >
              {displayUrl}
            </a>
          </div>
        </div>

        {/* Company Name & Icon */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#0A192F] dark:bg-slate-800 text-white flex items-center justify-center shrink-0 border border-slate-700 shadow-xs group-hover:bg-[#F27D26] dark:group-hover:bg-[#F27D26] transition-colors duration-300">
            <span className="font-mono font-black text-lg sm:text-xl tracking-tighter">{initials}</span>
          </div>

          <div className="space-y-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A192F] dark:text-white group-hover:text-[#F27D26] dark:group-hover:text-[#F27D26] transition-colors break-words">
              {companyName}
            </h3>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#F27D26]">
              {partner.establishedRole || 'Verified Strategic Technology Partner'}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-300 text-fluid-body leading-relaxed">
          {description}
        </p>

        {/* Core Capabilities / Tags */}
        {tags && tags.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
              Core Expertise & Collaboration Scope:
            </span>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-slate-50 dark:bg-[#071324] border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-none"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Strip */}
      <div className="p-4 sm:p-6 lg:px-8 bg-slate-50 dark:bg-[#071324] border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-medium">Direct Collaboration & Verified Alliance</span>
        </div>

        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          id={`partner-${partner.id}-visit-btn`}
          className="bg-[#0A192F] dark:bg-[#F27D26] hover:bg-[#F27D26] dark:hover:bg-[#d96a1a] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 transition-all inline-flex items-center justify-center gap-2 shadow-xs group/btn text-center"
        >
          <span>Visit Website</span>
          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};
