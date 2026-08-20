import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Cpu, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { SectionHeader } from '../components/common/SectionHeader.js';
import { ServiceCard } from '../components/common/ServiceCard.js';
import { CTASection } from '../components/common/CTASection.js';

export const SolutionsPage: React.FC = () => {
  const { services, openQuoteModal } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState('All');

  // Filter services
  const filteredServices = services
    .filter(s => s.isActive)
    .filter(s => {
      const matchSearch =
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.subOfferings && s.subOfferings.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchIndustry =
        selectedIndustryFilter === 'All' ||
        (s.relatedIndustries && s.relatedIndustries.includes(selectedIndustryFilter));

      return matchSearch && matchIndustry;
    });

  // Extract unique industries from all services
  const allIndustryNames = Array.from(
    new Set(services.flatMap(s => s.relatedIndustries || []))
  ).filter(Boolean);

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
              Engineering & Automation Solutions
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white italic">
              Industrial Solutions Catalogue
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              From heavy electrical machine overhauls and certified process instrumentation to turnkey PLC/SCADA and autonomous factory robotics.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="bg-white border-b border-slate-200 py-6 sticky top-[69px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search solutions, PLC, pumps, RTD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-none text-xs sm:text-sm focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          {/* Industry Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Domain:
            </span>
            <button
              onClick={() => setSelectedIndustryFilter('All')}
              className={`text-xs px-3 py-1.5 font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                selectedIndustryFilter === 'All'
                  ? 'bg-[#0A192F] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Domains
            </button>
            {allIndustryNames.map(ind => (
              <button
                key={ind}
                onClick={() => setSelectedIndustryFilter(ind)}
                className={`text-xs px-3 py-1.5 font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  selectedIndustryFilter === ind
                    ? 'bg-[#0A192F] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center text-xs text-slate-500">
            <span>Showing {filteredServices.length} dynamic engineering offerings</span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-orange-600 hover:underline font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onQuickQuote={(title) => openQuoteModal(title)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8">
              <Cpu className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No matching solutions found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try adjusting your search keywords or clearing the industry filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustryFilter('All');
                }}
                className="mt-4 text-xs font-semibold bg-blue-900 text-white px-4 py-2 rounded"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
};
