import React from 'react';
import { Link } from 'react-router-dom';
import { Handshake, ShieldCheck, Cpu, ArrowRight, Globe, CheckCircle2, Building, Mail } from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { PartnerCard } from '../components/common/PartnerCard.js';
import { CTASection } from '../components/common/CTASection.js';

export const PartnersPage: React.FC = () => {
  const { partners } = useData();

  const activePartners = (partners || []).filter(p => p.isActive !== false);

  return (
    <div className="bg-slate-50 dark:bg-[#050D1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. Header Banner */}
      <section className="bg-[#0A192F] dark:bg-[#071324] text-white py-14 sm:py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
        <div className="relative w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <p className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm">
              STRATEGIC PARTNERSHIPS
            </p>
            <h1 className="text-fluid-h1 font-bold tracking-tight text-white italic">
              Our Partner Companies
            </h1>
            <p className="text-fluid-lead text-slate-300 leading-relaxed font-light">
              AMM Automation collaborates with trusted technology and business partners to deliver better industrial automation and digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Partner Companies Grid */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white dark:bg-[#0A192F] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-8 sm:mb-10 max-w-3xl">
            <span className="text-[#F27D26] font-bold tracking-[0.25em] uppercase text-xs sm:text-sm block">
              TRUSTED TECHNOLOGY COLLABORATION
            </span>
            <h2 className="text-fluid-h2 font-bold text-[#0A192F] dark:text-white mt-1">
              Technology & Industry Alliance Network
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm lg:text-base mt-2 leading-relaxed">
              We partner with industry-leading digital engineering and software providers to ensure our industrial automation and plant-ready systems are powered by modern, reliable, and scalable technology stacks.
            </p>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8 max-w-4xl">
            {activePartners.map(partner => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Alliance Framework */}
      <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 dark:bg-[#050D1A] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm block">
              COLLABORATION PILLARS
            </span>
            <h2 className="text-fluid-h2 font-bold text-[#0A192F] dark:text-white mt-1">
              How We Create Value Together
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2">
              Our strategic partnership framework focuses on measurable industrial outcomes, zero downtime architectures, and cutting-edge software integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-8 bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-[#0A192F] dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5 text-[#F27D26]" />
              </div>
              <h3 className="text-base font-bold text-[#0A192F] dark:text-white">Digital & Software Synergy</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Bridging shop-floor PLC/SCADA signals with modern web architectures, enterprise dashboards, and secure data analytics.
              </p>
            </div>

            <div className="p-5 sm:p-8 bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-[#0A192F] dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-[#0A192F] dark:text-white">Rigorous Quality Standards</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Joint deployments adhering to strict industrial safety, international communication protocols, and turnkey delivery.
              </p>
            </div>

            <div className="p-5 sm:p-8 bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-[#0A192F] dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                <Handshake className="w-5 h-5 text-[#F27D26]" />
              </div>
              <h3 className="text-base font-bold text-[#0A192F] dark:text-white">Integrated Client Support</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Coordinated engineering evaluations, combined lifecycle assistance, and dedicated technical help desks for enterprise clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Strategic Alliance Inquiry Box */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0A192F] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="bg-[#0A192F] dark:bg-[#071324] text-white p-6 sm:p-8 lg:p-12 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2 sm:space-y-3 max-w-2xl text-center lg:text-left">
              <span className="text-[#F27D26] font-bold tracking-[0.25em] uppercase text-xs">
                STRATEGIC ALLIANCES & COLLABORATION
              </span>
              <h3 className="text-fluid-h2 font-bold tracking-tight text-white">
                Interested in Partnering with AMM Automation?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
                We welcome discussions with specialized technology providers, industrial equipment manufacturers, and system integrators seeking synergy in automation and Industry 4.0.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/contact"
                className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-bold text-xs uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Connect With Us</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA Section */}
      <CTASection />
    </div>
  );
};
