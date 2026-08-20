import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Factory,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { DynamicIcon } from '../utils/iconHelper.js';
import { CTASection } from '../components/common/CTASection.js';
import { optimizeImageUrl } from '../utils/imageOptimizer.js';

export const IndustryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { industries, services, openQuoteModal } = useData();

  const industry = industries.find(i => i.slug === slug);

  if (!industry) {
    return (
      <div className="min-h-[60vh] bg-slate-50 dark:bg-[#050D1A] flex items-center justify-center p-6 text-center transition-colors duration-300">
        <div className="max-w-md space-y-4">
          <Factory className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Industry Not Found</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">The requested industrial sector profile does not exist.</p>
          <Link
            to="/industries"
            className="inline-flex items-center gap-1.5 bg-[#0A192F] dark:bg-[#F27D26] text-white text-xs font-semibold px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Industries</span>
          </Link>
        </div>
      </div>
    );
  }

  // Find mapped services
  const mappedServices = services.filter(
    s =>
      (industry.relatedServices && industry.relatedServices.includes(s.title)) ||
      (s.relatedIndustries && s.relatedIndustries.includes(industry.name))
  );

  return (
    <div className="bg-slate-50 dark:bg-[#050D1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Banner */}
      <section className="relative bg-[#0A192F] dark:bg-[#071324] text-white py-12 sm:py-14 lg:py-20 border-b border-slate-800 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity overflow-hidden pointer-events-none">
          <img
            src={optimizeImageUrl(industry.image, 800, 70)}
            alt={industry.name}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] dark:from-[#071324] via-[#0A192F]/90 dark:via-[#071324]/90 to-[#0A192F]/80 dark:to-[#071324]/80" />
        </div>

        <div className="relative w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/industries" className="hover:text-white transition-colors">Industries</Link>
            <span>/</span>
            <span className="text-[#F27D26] font-medium truncate max-w-[200px] sm:max-w-xs">{industry.name}</span>
          </div>

          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#F27D26] text-white flex items-center justify-center shrink-0">
                <DynamicIcon name={industry.iconName} className="w-5 h-5" />
              </div>
              <p className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm">
                Industry Solutions
              </p>
            </div>

            <h1 className="text-fluid-h1 font-bold tracking-tight text-white italic">
              {industry.name} Automation & Instrumentation
            </h1>

            <p className="text-fluid-lead text-slate-300 leading-relaxed max-w-2xl font-light">
              {industry.description}
            </p>

            <div className="pt-2">
              <button
                onClick={() => openQuoteModal(`${industry.name} Engineering`)}
                className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-bold uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Request Sector RFQ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Common Operational Challenges */}
            <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Common Industry Challenges</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key operational bottlenecks, harsh environmental stressors, and safety hurdles typical in {industry.name}:
              </p>
              <ul className="space-y-3 pt-2">
                {industry.challenges.map((chal, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-amber-50/60 dark:bg-amber-950/30 p-3 border border-amber-100 dark:border-amber-900/40">
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-xs shrink-0 mt-0.5">0{idx + 1}.</span>
                    <span>{chal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AMM Automation Engineered Solutions */}
            <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>AMM Automation Tailored Solutions</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Engineered plant-ready responses designed to mitigate risks and elevate uptime:
              </p>
              <ul className="space-y-3 pt-2">
                {industry.solutions.map((sol, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-emerald-50/60 dark:bg-emerald-950/30 p-3 border border-emerald-100 dark:border-emerald-900/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{sol}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Services */}
            {mappedServices.length > 0 && (
              <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                  Relevant Offerings for {industry.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {mappedServices.map(srv => (
                    <Link
                      key={srv.id}
                      to={`/solutions/${srv.slug}`}
                      className="p-4 bg-slate-50 dark:bg-[#071324] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all block group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#0A192F] dark:bg-slate-800 text-white flex items-center justify-center shrink-0 group-hover:bg-[#F27D26] dark:group-hover:bg-[#F27D26] transition-colors">
                          <DynamicIcon name={srv.iconName} className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#F27D26] transition-colors">
                            {srv.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{srv.shortDescription}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: RFQ & Other Industries */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0A192F] dark:bg-[#071324] text-white p-6 border border-slate-800 space-y-4 sticky top-24">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-[#F27D26] tracking-wider block">
                  Sector Specialization
                </span>
                <h3 className="text-base font-bold text-white">Need Engineering Support for {industry.name}?</h3>
                <p className="text-xs text-slate-400 mt-1">Our application engineers are available for site audits, panel retrofits, and sensor calibration.</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openQuoteModal(`${industry.name} Automation`)}
                  className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-white font-semibold text-xs py-3 tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Request Plant Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Other Industries */}
            <div className="bg-white dark:bg-[#0A192F] p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Other Industries Served
              </h4>
              <div className="space-y-2">
                {industries
                  .filter(i => i.id !== industry.id && i.isActive)
                  .map(other => (
                    <Link
                      key={other.id}
                      to={`/industries/${other.slug}`}
                      className="block p-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#071324] hover:text-[#F27D26] dark:hover:text-[#F27D26] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span>{other.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
};
