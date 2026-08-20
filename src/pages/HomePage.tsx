import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Settings,
  Flame,
  Boxes,
  Lock,
  PhoneCall,
  Activity,
  Layers,
  Wrench
} from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { SectionHeader } from '../components/common/SectionHeader.js';
import { ServiceCard } from '../components/common/ServiceCard.js';
import { IndustryCard } from '../components/common/IndustryCard.js';
import { ProjectCard } from '../components/common/ProjectCard.js';
import { CTASection } from '../components/common/CTASection.js';

export const HomePage: React.FC = () => {
  const { content, services, industries, projects, openQuoteModal } = useData();

  const activeServices = services.filter(s => s.isActive);
  const activeIndustries = industries.filter(i => i.isActive);
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0A192F] text-white overflow-hidden border-b border-slate-800">
        {/* Subtle Industrial Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

        {/* Industrial Imagery Overlay */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 opacity-20 lg:opacity-35 mix-blend-luminosity pointer-events-none overflow-hidden">
          <img
            src="/images/hero_automation.jpg"
            alt="Industrial Automation & Control Systems"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl space-y-6">
            {/* Tag / Category */}
            <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
              {content?.heroHeading || 'Industrial Automation & Engineering'}
            </p>

            {/* Main Headline - Editorial Display Style */}
            <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6 italic">
              {content?.heroSubheading || (
                <>
                  Smart Solutions.<br />
                  Safer Operations.
                </>
              )}
            </h1>

            {/* Supporting Description */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mb-8 leading-relaxed font-light">
              {content?.heroDescription ||
                'Reliable partner in process instrumentation, smart Industry 4.0, and plant-ready solutions designed for maximum efficiency and productivity.'}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/solutions"
                id="hero-explore-solutions-btn"
                className="bg-[#F27D26] text-white px-8 py-4 font-bold tracking-wider hover:bg-[#d96a1a] transition-all text-xs sm:text-sm uppercase inline-flex items-center gap-2"
              >
                <span>EXPLORE SOLUTIONS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => openQuoteModal()}
                id="hero-get-quote-btn"
                className="border border-white text-white px-8 py-4 font-bold tracking-wider hover:bg-white hover:text-[#0A192F] transition-all text-xs sm:text-sm uppercase inline-flex items-center gap-2"
              >
                <span>GET A QUOTE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/about"
                className="text-slate-300 hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-4 transition-colors inline-flex items-center gap-1.5"
              >
                <span>ABOUT US →</span>
              </Link>
            </div>

            {/* Metric Highlights Strip */}
            <div className="pt-10 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6 text-slate-300">
              <div>
                <div className="text-2xl font-bold text-white flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>100%</span>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">Plant-Ready Certified</p>
              </div>

              <div>
                <div className="text-2xl font-bold text-white flex items-center gap-1.5 font-mono">
                  <Activity className="w-5 h-5 text-[#F27D26]" />
                  <span>10+</span>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">Engineering Solutions</p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-white flex items-center gap-1.5 font-mono">
                  <PhoneCall className="w-5 h-5 text-blue-400" />
                  <span>24/7</span>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">Breakdown Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT PREVIEW SECTION */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image & Stats */}
            <div className="lg:col-span-5 relative">
              <div className="relative border border-slate-200 shadow-md">
                <img
                  src="/images/plc_control_panel.jpg"
                  alt="AMM Automation Engineering Workshop"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-80 lg:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 bg-[#0A192F] p-4 border border-slate-700 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#F27D26] flex items-center justify-center text-white font-bold text-sm">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#F27D26]">Engineering Rigor</h4>
                      <p className="text-xs text-slate-300">Turnkey electrical, automation, and instrumentation capabilities.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Intro Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm block">
                ABOUT AMM AUTOMATION
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0A192F] leading-snug">
                Engineering Turnkey Automation & High-Precision Instrumentation
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {content?.aboutIntro ||
                  'AMM Automation is dedicated to engineering excellence, offering complete turnkey automation, process instrumentation, electrical engineering, and smart manufacturing integration for heavy industries and modern enterprises.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-slate-50 border-l-2 border-[#0A192F]">
                  <h4 className="text-sm font-bold text-[#0A192F] flex items-center gap-2 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-[#F27D26]" />
                    <span>Field-Proven Execution</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Plant-ready architectures designed to endure harsh temperatures, dust, vibration, and continuous heavy duty.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 border-l-2 border-[#0A192F]">
                  <h4 className="text-sm font-bold text-[#0A192F] flex items-center gap-2 uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4 text-[#F27D26]" />
                    <span>Industry 4.0 Integration</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Bridging shop floor PLC/SCADA signals with real-time enterprise IIoT, EMS, and predictive diagnostics.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/about"
                  id="about-learn-more-btn"
                  className="bg-[#0A192F] hover:bg-[#F27D26] text-white text-xs uppercase tracking-widest font-bold px-6 py-3.5 transition-all inline-flex items-center gap-2"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. KEY SOLUTIONS SECTION */}
      <section className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Solutions Catalogue"
            title="Industrial Automation & Engineering Solutions"
            subtitle="Explore our 10 core industrial domains engineered to optimize operational uptime, precision control, and workplace safety."
          />

          {/* 10 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onQuickQuote={(title) => openQuoteModal(title)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 bg-[#0A192F] hover:bg-[#F27D26] text-white text-xs uppercase tracking-widest font-bold px-8 py-4 transition-all"
            >
              <span>Explore Detailed Solutions Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE AMM AUTOMATION */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Engineering Rigor"
            title="Engineered for Reliability, Safety & Measured ROI"
            subtitle="Four core principles driving every engineering deployment, instrumentation calibration, and industrial software architecture."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Point 1 */}
            <div className="p-6 bg-slate-50 border-l-2 border-[#0A192F] hover:border-[#F27D26] transition-colors space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">PILLAR 01</span>
              <h3 className="text-lg font-bold text-[#0A192F]">Advanced Technology</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                State-of-the-art multi-vendor PLC/SCADA systems, LiDAR SLAM autonomous robotics, smart IIoT edge sensors, and modern software architectures.
              </p>
            </div>

            {/* Point 2 */}
            <div className="p-6 bg-slate-50 border-l-2 border-[#0A192F] hover:border-[#F27D26] transition-colors space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">PILLAR 02</span>
              <h3 className="text-lg font-bold text-[#0A192F]">Cost-Effective Solutions</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Maximized ROI through targeted energy management (EMS), legacy system retrofits, extended equipment lifecycle, and rapid commissioning.
              </p>
            </div>

            {/* Point 3 */}
            <div className="p-6 bg-slate-50 border-l-2 border-[#0A192F] hover:border-[#F27D26] transition-colors space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">PILLAR 03</span>
              <h3 className="text-lg font-bold text-[#0A192F]">Improved Safety & Reliability</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Comprehensive Lockout-Tagout (LOTO) procedures, SIL-rated safety interlocks, and Class F/H insulation materials ensuring continuous operation.
              </p>
            </div>

            {/* Point 4 */}
            <div className="p-6 bg-slate-50 border-l-2 border-[#0A192F] hover:border-[#F27D26] transition-colors space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">PILLAR 04</span>
              <h3 className="text-lg font-bold text-[#0A192F]">Enhanced Efficiency</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eliminating bottlenecks with automated material transit, real-time OEE tracking, and intuitive operator dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIES SECTION */}
      <section className="py-16 lg:py-24 bg-[#0A192F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Domain Expertise"
            title="Industries We Serve"
            subtitle="Tailored engineering architectures meeting the specialized environmental, safety, and regulatory demands of heavy manufacturing."
            dark
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeIndustries.map(industry => (
              <IndustryCard key={industry.id} industry={industry} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs uppercase tracking-widest font-bold px-8 py-4 transition-colors"
            >
              <span>Explore All Industry Architectures</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PORTFOLIO / CASE STUDIES PREVIEW */}
      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-2 block">
                PROVEN ENGINEERING RECORD
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A192F]">
                Recent Projects & Deployments
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-xl">
                Dynamically managed case studies demonstrating our capabilities across automation retrofits, process instrumentation, and robotics.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/portfolio"
                className="text-xs uppercase tracking-wider font-bold text-[#F27D26] hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 p-8">
              <p className="text-slate-600 font-medium text-sm">No portfolio items published yet.</p>
              <p className="text-xs text-slate-400 mt-1">Authorized staff can add verified project case studies via the Admin Dashboard.</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. FINAL DARK NAVY CTA SECTION */}
      <CTASection />
    </div>
  );
};
