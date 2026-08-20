import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake, ShieldCheck, Cpu } from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { PartnerCard } from './PartnerCard.js';

interface PartnersSectionProps {
  id?: string;
  showExploreLink?: boolean;
  className?: string;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({
  id = 'partners',
  showExploreLink = false,
  className = ''
}) => {
  const { partners } = useData();

  // Filter only active partners
  const activePartners = (partners || []).filter(p => p.isActive !== false);

  return (
    <section
      id={id}
      className={`py-16 lg:py-24 bg-white dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors duration-300 ${className}`}
    >
      {/* Subtle Industrial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#F1F5F9_1px,transparent_1px),linear-gradient(to_bottom,#F1F5F9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70 dark:opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm block">
              STRATEGIC PARTNERSHIPS
            </span>
            <h2 className="text-fluid-h2 font-bold tracking-tight text-[#0A192F] dark:text-white">
              Our Partner Companies
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-fluid-body leading-relaxed font-normal pt-1">
              AMM Automation collaborates with trusted technology and business partners to deliver better industrial automation and digital solutions.
            </p>
          </div>

          {showExploreLink && (
            <div className="shrink-0 pt-2 md:pt-0">
              <Link
                to="/partners"
                className="text-xs uppercase tracking-wider font-bold text-[#F27D26] hover:text-[#d96a1a] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Strategic Alliances</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Partner Cards Grid */}
        <div className={`grid grid-cols-1 ${activePartners.length > 1 ? 'md:grid-cols-2' : 'max-w-4xl'} gap-6 lg:gap-8`}>
          {activePartners.map(partner => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>

        {/* Partnership Value Strip */}
        <div className="mt-10 sm:mt-12 p-5 sm:p-8 bg-[#0A192F] dark:bg-[#030812] text-white border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#F27D26] text-white flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Technological Synergy</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Combining shop-floor OT automation with modern IT/cloud software and scalable digital infrastructure.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#F27D26] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Engineering Quality</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Adhering to strict safety, performance, and industrial reliability benchmarks across all joint engagements.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-1">
            <div className="w-9 h-9 bg-[#F27D26] text-white flex items-center justify-center shrink-0">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">End-to-End Delivery</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Seamless turnkey execution spanning process instrumentation, custom software, and 24/7 technical support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
