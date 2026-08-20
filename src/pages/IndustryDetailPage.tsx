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
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <Factory className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Industry Not Found</h2>
          <p className="text-xs text-slate-600">The requested industrial sector profile does not exist.</p>
          <Link
            to="/industries"
            className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded"
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
    <div className="bg-slate-50 text-slate-900">
      {/* Banner */}
      <section className="relative bg-[#0A192F] text-white py-16 lg:py-24 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity overflow-hidden">
          <img
            src={optimizeImageUrl(industry.image, 800, 70)}
            alt={industry.name}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/90 to-[#0A192F]/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/industries" className="hover:text-white transition-colors">Industries</Link>
            <span>/</span>
            <span className="text-[#F27D26] font-medium">{industry.name}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F27D26] text-white flex items-center justify-center">
                <DynamicIcon name={industry.iconName} className="w-5 h-5" />
              </div>
              <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
                Industry Solutions
              </p>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white italic">
              {industry.name} Automation & Instrumentation
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              {industry.description}
            </p>

            <div className="pt-2">
              <button
                onClick={() => openQuoteModal(`${industry.name} Engineering`)}
                className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-bold uppercase tracking-widest px-8 py-4 transition-all inline-flex items-center gap-2"
              >
                <span>Request Sector RFQ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Common Operational Challenges */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Common Industry Challenges</span>
              </h2>
              <p className="text-xs text-slate-500">
                Key operational bottlenecks, harsh environmental stressors, and safety hurdles typical in {industry.name}:
              </p>
              <ul className="space-y-3 pt-2">
                {industry.challenges.map((chal, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-amber-50/60 p-3 rounded-md border border-amber-100">
                    <span className="font-mono text-amber-600 font-bold text-xs shrink-0 mt-0.5">0{idx + 1}.</span>
                    <span>{chal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* AMM Automation Engineered Solutions */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>AMM Automation Tailored Solutions</span>
              </h2>
              <p className="text-xs text-slate-500">
                Engineered plant-ready responses designed to mitigate risks and elevate uptime:
              </p>
              <ul className="space-y-3 pt-2">
                {industry.solutions.map((sol, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-emerald-50/60 p-3 rounded-md border border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{sol}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Services */}
            {mappedServices.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Relevant Offerings for {industry.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {mappedServices.map(srv => (
                    <Link
                      key={srv.id}
                      to={`/solutions/${srv.slug}`}
                      className="p-4 rounded-md bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all block group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-blue-900 text-white flex items-center justify-center shrink-0 group-hover:bg-orange-600 transition-colors">
                          <DynamicIcon name={srv.iconName} className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                            {srv.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{srv.shortDescription}</p>
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
            <div className="bg-[#0A192F] text-white p-6 rounded-lg border border-slate-800 space-y-4 sticky top-24">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider block">
                  Sector Specialization
                </span>
                <h3 className="text-base font-bold text-white">Need Engineering Support for {industry.name}?</h3>
                <p className="text-xs text-slate-400 mt-1">Our application engineers are available for site audits, panel retrofits, and sensor calibration.</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openQuoteModal(`${industry.name} Automation`)}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs py-2.5 rounded shadow transition-colors flex items-center justify-center gap-2"
                >
                  <span>Request Plant Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Other Industries */}
            <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Other Industries Served
              </h4>
              <div className="space-y-2">
                {industries
                  .filter(i => i.id !== industry.id && i.isActive)
                  .map(other => (
                    <Link
                      key={other.id}
                      to={`/industries/${other.slug}`}
                      className="block p-2 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 hover:text-blue-900 transition-colors"
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
