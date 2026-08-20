import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { IndustryItem } from '../../types.js';
import { DynamicIcon } from '../../utils/iconHelper.js';
import { optimizeImageUrl } from '../../utils/imageOptimizer.js';

interface IndustryCardProps {
  industry: IndustryItem;
}

export const IndustryCard: React.FC<IndustryCardProps> = ({ industry }) => {
  return (
    <div className="bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800/90 overflow-hidden group hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/50 transition-all duration-300 flex flex-col justify-between border-l-4 border-l-[#0A192F] dark:border-l-slate-700 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26]">
      <div>
        {/* Visual Banner */}
        <div className="relative h-48 overflow-hidden bg-[#0A192F]">
          <img
            src={optimizeImageUrl(industry.image, 520, 70)}
            alt={industry.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />
          
          <div className="absolute top-3 left-3 w-8 h-8 bg-[#F27D26] text-white flex items-center justify-center font-bold shadow-md">
            <DynamicIcon name={industry.iconName} className="w-4 h-4" />
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
              {industry.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed line-clamp-3">
            {industry.description}
          </p>

          {/* Key Solutions Highlights */}
          {industry.solutions && industry.solutions.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400 block">
                Targeted Deployments:
              </span>
              <ul className="space-y-1.5">
                {industry.solutions.slice(0, 2).map((sol, idx) => (
                  <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 line-clamp-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F27D26] shrink-0 mt-0.5" />
                    <span>{sol}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer link */}
      <div className="p-4 bg-slate-50 dark:bg-[#071324] border-t border-slate-100 dark:border-slate-800">
        <Link
          to={`/industries/${industry.slug}`}
          className="text-xs font-bold uppercase tracking-wider text-[#0A192F] dark:text-slate-200 hover:text-[#F27D26] dark:hover:text-[#F27D26] transition-colors inline-flex items-center gap-1.5 w-full justify-between"
        >
          <span>Industry Solutions & Specs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
