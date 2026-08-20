import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Building,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { CTASection } from '../components/common/CTASection.js';
import { optimizeImageUrl } from '../utils/imageOptimizer.js';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects, openQuoteModal } = useData();

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
          <p className="text-xs text-slate-600">The requested project case study does not exist or may have been updated.</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Banner */}
      <section className="relative bg-[#0A192F] text-white py-14 lg:py-24 border-b border-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity overflow-hidden">
          <img
            src={optimizeImageUrl(project.featuredImage, 800, 70)}
            alt={project.title}
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
            <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <span>/</span>
            <span className="text-[#F27D26] font-medium truncate">{project.title}</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs">
                {project.industry}
              </p>
              <span className="text-slate-500 font-mono">|</span>
              <span
                className={`text-xs font-bold uppercase px-2.5 py-0.5 text-white ${
                  project.status === 'Completed' ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                {project.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white italic">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              {project.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Case Study */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Image */}
            <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
              <img
                src={optimizeImageUrl(project.featuredImage, 800, 75)}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>

            {/* Detailed Description */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Project Scope & Engineering Execution
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.fullDescription || project.shortDescription}
              </p>
            </div>

            {/* Gallery Images if available */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Site Installation & Field Gallery
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {project.gallery.map((img, idx) => (
                    <div key={idx} className="rounded-lg overflow-hidden border border-slate-200 h-48 bg-slate-900">
                      <img
                        src={optimizeImageUrl(img, 480, 70)}
                        alt={`Site Installation ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Project Metadata */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
                Engineering Specifications
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Industry Sector:</span>
                  <span className="font-semibold text-slate-800 text-sm">{project.industry}</span>
                </div>

                {project.clientType && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Client Type:</span>
                    <span className="font-semibold text-slate-800">{project.clientType}</span>
                  </div>
                )}

                {project.location && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Location:</span>
                    <span className="font-semibold text-slate-800">{project.location}</span>
                  </div>
                )}

                {project.completionYear && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">Year of Commissioning:</span>
                    <span className="font-semibold text-slate-800">{project.completionYear}</span>
                  </div>
                )}
              </div>

              {/* Technologies Used */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Technologies / Hardware Deployed:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-100 text-slate-800 font-mono font-medium px-2 py-1 rounded border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Services */}
              {project.services && project.services.length > 0 && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    Associated Core Services:
                  </span>
                  <ul className="space-y-1 text-xs">
                    {project.services.map((srv, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-blue-900 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{srv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quick Action Box */}
            <div className="bg-[#0A192F] text-white p-6 rounded-lg border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">Need a Similar Solution?</h4>
              <p className="text-xs text-slate-300">
                Contact our engineering team to schedule a technical scoping call or request a retrofit proposal.
              </p>
              <button
                onClick={() => openQuoteModal(project.title)}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold py-2.5 rounded shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Request Case Study Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
    </div>
  );
};
