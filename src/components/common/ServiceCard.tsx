import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { ServiceItem } from '../../types.js';
import { DynamicIcon } from '../../utils/iconHelper.js';

interface ServiceCardProps {
  service: ServiceItem;
  onQuickQuote?: (serviceTitle: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onQuickQuote }) => {
  const serviceIndex = String(service.order || 1).padStart(2, '0');

  return (
    <div className="bg-white border border-slate-200 p-6 sm:p-7 flex flex-col justify-between group hover:shadow-lg transition-all duration-300 relative border-l-4 border-l-[#0A192F] hover:border-l-[#F27D26]">
      <div>
        {/* Header Metadata & Numbering */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A192F] text-white flex items-center justify-center group-hover:bg-[#F27D26] transition-colors">
              <DynamicIcon name={service.iconName} className="w-5 h-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              SERVICE {serviceIndex}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#0A192F] mb-3 group-hover:text-[#F27D26] transition-colors leading-snug">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-5">
          {service.shortDescription}
        </p>

        {/* Sub-Offerings Pills */}
        {service.subOfferings && service.subOfferings.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
              Core Capabilities:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {service.subOfferings.map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[10px] bg-slate-50 text-slate-700 font-semibold px-2 py-0.5 border border-slate-200 uppercase tracking-wider"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          to={`/solutions/${service.slug}`}
          className="text-[#F27D26] text-xs font-bold uppercase tracking-wider hover:underline inline-flex items-center gap-1.5"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {onQuickQuote && (
          <button
            onClick={() => onQuickQuote(service.title)}
            className="text-[10px] font-bold uppercase tracking-widest text-[#0A192F] hover:text-[#F27D26] transition-colors"
          >
            Quick Quote →
          </button>
        )}
      </div>
    </div>
  );
};
