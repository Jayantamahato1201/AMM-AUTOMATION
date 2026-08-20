import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Layers, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { SectionHeader } from '../components/common/SectionHeader.js';
import { ProjectCard } from '../components/common/ProjectCard.js';
import { CTASection } from '../components/common/CTASection.js';

export const PortfolioPage: React.FC = () => {
  const { projects, industries, services } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedService, setSelectedService] = useState('All');

  const filteredProjects = projects.filter(proj => {
    const matchSearch =
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (proj.technologies && proj.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchIndustry =
      selectedIndustry === 'All' || proj.industry === selectedIndustry;

    const matchService =
      selectedService === 'All' ||
      (proj.services && proj.services.includes(selectedService));

    return matchSearch && matchIndustry && matchService;
  });

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Banner */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
              Engineering Case Studies
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white italic">
              Project Portfolio & Case Studies
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Explore our turnkey plant retrofits, instrumentation deployments, and robotics implementations across heavy manufacturing.
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
              placeholder="Search case studies, Siemens, Sinter..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-none text-xs sm:text-sm focus:outline-none focus:border-[#0A192F]"
            />
          </div>

          {/* Select Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-700 px-3 py-2 focus:outline-none focus:border-[#0A192F]"
            >
              <option value="All">All Industries</option>
              {industries.map(ind => (
                <option key={ind.id} value={ind.name}>
                  {ind.name}
                </option>
              ))}
            </select>

            <select
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-xs font-bold uppercase tracking-wider text-slate-700 px-3 py-2 focus:outline-none focus:border-[#0A192F]"
            >
              <option value="All">All Services</option>
              {services.map(srv => (
                <option key={srv.id} value={srv.title}>
                  {srv.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center text-xs text-slate-500">
            <span>Showing {filteredProjects.length} case studies</span>
            {(searchTerm || selectedIndustry !== 'All' || selectedService !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('All');
                  setSelectedService('All');
                }}
                className="text-orange-600 hover:underline font-semibold"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8 space-y-3">
              <Layers className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No project case studies found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No published projects matched your current search filters. Project case studies are managed dynamically via the Admin Dashboard.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedIndustry('All');
                  setSelectedService('All');
                }}
                className="text-xs font-semibold bg-blue-900 text-white px-4 py-2 rounded"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};
