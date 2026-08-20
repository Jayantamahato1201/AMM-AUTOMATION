import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.js';
import { SectionHeader } from '../components/common/SectionHeader.js';
import { IndustryCard } from '../components/common/IndustryCard.js';
import { CTASection } from '../components/common/CTASection.js';

export const IndustriesPage: React.FC = () => {
  const { industries } = useData();
  const activeIndustries = industries.filter(i => i.isActive);

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
              Industrial Domains
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white italic">
              Industries We Serve
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Specialized engineering, hazardous area instrumentation, turnkey automation, and continuous condition monitoring designed for heavy industry.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Target Sectors"
            title="Engineered Solutions Across 9 Key Sectors"
            subtitle="Explore how AMM Automation solves extreme environment challenges, minimizes unplanned downtime, and guarantees strict safety compliance."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeIndustries.map(industry => (
              <IndustryCard key={industry.id} industry={industry} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};
