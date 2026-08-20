import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
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
import { PartnersSection } from '../components/common/PartnersSection.js';
import { CTASection } from '../components/common/CTASection.js';
import { HeroScene } from '../components/home/HeroScene.js';
import { HeroBackground3D } from '../components/home/HeroBackground3D.js';
import { AnimatedStatCounter } from '../components/home/AnimatedStatCounter.js';
import { TiltCard } from '../components/common/TiltCard.js';

export const HomePage: React.FC = () => {
  const { content, services, industries, openQuoteModal } = useData();
  const shouldReduceMotion = useReducedMotion();

  // Mouse Parallax coordinates for hero (-1 to 1 normalized)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
  }, [shouldReduceMotion]);

  const handleHeroMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 });
  }, []);

  const activeServices = services.filter(s => s.isActive);
  const activeIndustries = industries.filter(i => i.isActive);

  // Stagger animation variants for hero content
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const eyebrowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const headlineLineVariants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const buttonGroupVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const buttonItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const statsContainerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div className="bg-slate-50 dark:bg-[#050D1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* 1. HERO SECTION WITH 3D EXPERIENCE */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative bg-white dark:bg-[#071324] text-slate-900 dark:text-white overflow-hidden border-b border-slate-200 dark:border-slate-800 transition-colors duration-300"
      >
        {/* Layered 3D Multi-Depth Technical Background */}
        <HeroBackground3D mouseX={mousePos.x} mouseY={mousePos.y} />

        <div className="relative w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column: Staggered Editorial Typography */}
            <motion.div
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7 space-y-5 sm:space-y-6 z-10"
            >
              {/* Eyebrow / Tag */}
              <motion.div variants={eyebrowVariants} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse shadow-[0_0_8px_rgba(242,125,38,0.6)]" />
                <p className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm font-mono">
                  {content?.heroHeading || 'INDUSTRIAL AUTOMATION & SMART SOLUTIONS'}
                </p>
              </motion.div>

              {/* Main Headline - Line by Line Staggered Editorial Reveal */}
              <motion.h1
                variants={headlineVariants}
                className="text-fluid-display font-bold tracking-tight text-[#0A192F] dark:text-white italic leading-tight"
              >
                {content?.heroSubheading ? (
                  <motion.span variants={headlineLineVariants} className="block">
                    {content.heroSubheading}
                  </motion.span>
                ) : (
                  <>
                    <motion.span variants={headlineLineVariants} className="block">
                      Smart Solutions.
                    </motion.span>
                    <motion.span variants={headlineLineVariants} className="block text-slate-700 dark:text-slate-200">
                      Safer Operations.
                    </motion.span>
                    <motion.span variants={headlineLineVariants} className="block text-[#F27D26]">
                      Stronger Tomorrow.
                    </motion.span>
                  </>
                )}
              </motion.h1>

              {/* Supporting Description */}
              <motion.p
                variants={descriptionVariants}
                className="text-slate-600 dark:text-slate-300 text-fluid-lead max-w-2xl leading-relaxed font-light"
              >
                {content?.heroDescription ||
                  'Reliable partner in process instrumentation, smart Industry 4.0, and plant-ready solutions designed for maximum efficiency and productivity.'}
              </motion.p>

              {/* Interactive Staggered CTAs with Framer Motion Micro-Interactions */}
              <motion.div
                variants={buttonGroupVariants}
                className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4"
              >
                {/* Primary Explore Solutions Button with Spring Interaction */}
                <motion.div variants={buttonItemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/solutions"
                    id="hero-explore-solutions-btn"
                    className="group relative bg-[#F27D26] hover:bg-[#e06c17] text-white px-7 sm:px-8 py-3.5 sm:py-4 font-bold tracking-wider transition-all duration-300 text-xs sm:text-sm uppercase flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(242,125,38,0.3)] hover:shadow-[0_8px_30px_rgba(242,125,38,0.45)] text-center rounded-xs overflow-hidden"
                  >
                    <span className="relative z-10">EXPLORE SOLUTIONS</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>
                </motion.div>

                {/* Secondary Request a Quote with Border Lift */}
                <motion.div variants={buttonItemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button
                    onClick={() => openQuoteModal()}
                    id="hero-get-quote-btn"
                    className="group w-full sm:w-auto border border-[#0A192F] dark:border-white/80 text-[#0A192F] dark:text-white px-6 sm:px-8 py-3.5 sm:py-4 font-bold tracking-wider hover:bg-[#0A192F] hover:text-white dark:hover:bg-white dark:hover:text-[#0A192F] transition-all duration-300 text-xs sm:text-sm uppercase flex items-center justify-center gap-2 cursor-pointer text-center rounded-xs shadow-xs"
                  >
                    <span>GET A QUOTE</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                {/* Tertiary About Link */}
                <motion.div variants={buttonItemVariants}>
                  <Link
                    to="/about"
                    className="text-slate-700 dark:text-slate-300 hover:text-[#F27D26] dark:hover:text-white font-bold text-xs uppercase tracking-widest px-4 py-3 sm:py-4 transition-all duration-200 inline-flex items-center justify-center gap-1.5 text-center group"
                  >
                    <span>ABOUT US</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Metric Highlights Strip with In-View Animated Counters */}
              <motion.div
                variants={statsContainerVariants}
                className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800/90 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-slate-700 dark:text-slate-300"
              >
                <AnimatedStatCounter
                  icon={<ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                  value="100%"
                  label="Plant-Ready Certified"
                  accentColor="#10b981"
                  progressPercent={100}
                />

                <AnimatedStatCounter
                  icon={<Activity className="w-5 h-5 text-[#F27D26]" />}
                  value="10+"
                  label="Engineering Solutions"
                  accentColor="#f27d26"
                  progressPercent={92}
                />

                <AnimatedStatCounter
                  icon={<PhoneCall className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  value="24/7"
                  label="Breakdown Support"
                  accentColor="#38bdf8"
                  progressPercent={100}
                />
              </motion.div>
            </motion.div>

            {/* Right Column: 3D Animated Automation & Control Experience */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
              className="lg:col-span-5 relative w-full flex items-center justify-center"
            >
              <HeroScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT PREVIEW SECTION WITH SCROLL MOTION */}
      <section className="py-14 sm:py-16 lg:py-24 bg-white dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Image & Stats with 3D Tilt Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <TiltCard maxTilt={5} scale={1.01}>
                <div className="relative border border-slate-200 dark:border-slate-700 shadow-md group overflow-hidden">
                  <img
                    src="/images/plc_control_panel.jpg"
                    alt="AMM Automation Engineering Workshop"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#0A192F]/95 dark:bg-[#071324]/95 backdrop-blur-sm p-3.5 sm:p-4 border border-slate-700 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#F27D26] shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#F27D26] truncate">Engineering Rigor</h4>
                        <p className="text-xs text-slate-300 line-clamp-2">Turnkey electrical, automation, and instrumentation capabilities.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Right Intro Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-5 sm:space-y-6"
            >
              <span className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm block font-mono">
                ABOUT AMM AUTOMATION
              </span>

              <h2 className="text-fluid-h2 font-bold tracking-tight text-[#0A192F] dark:text-white leading-snug">
                Engineering Turnkey Automation & High-Precision Instrumentation
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-fluid-body leading-relaxed">
                {content?.aboutIntro ||
                  'AMM Automation is dedicated to engineering excellence, offering complete turnkey automation, process instrumentation, electrical engineering, and smart manufacturing integration for heavy industries and modern enterprises.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <TiltCard maxTilt={4} scale={1.01}>
                  <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-600 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26] transition-colors h-full">
                    <h4 className="text-sm font-bold text-[#0A192F] dark:text-white flex items-center gap-2 uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0" />
                      <span>Field-Proven Execution</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
                      Plant-ready architectures designed to endure harsh temperatures, dust, vibration, and continuous heavy duty.
                    </p>
                  </div>
                </TiltCard>

                <TiltCard maxTilt={4} scale={1.01}>
                  <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-600 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26] transition-colors h-full">
                    <h4 className="text-sm font-bold text-[#0A192F] dark:text-white flex items-center gap-2 uppercase tracking-wide">
                      <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0" />
                      <span>Industry 4.0 Integration</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
                      Bridging shop floor PLC/SCADA signals with real-time enterprise IIoT, EMS, and predictive diagnostics.
                    </p>
                  </div>
                </TiltCard>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/about"
                  id="about-learn-more-btn"
                  className="bg-[#0A192F] dark:bg-[#F27D26] hover:bg-[#F27D26] dark:hover:bg-[#d96a1a] text-white text-xs uppercase tracking-widest font-bold px-6 py-3.5 transition-all inline-flex items-center gap-2 shadow-xs hover:-translate-y-0.5"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. KEY SOLUTIONS SECTION WITH STAGGERED REVEALS */}
      <section className="py-14 sm:py-16 lg:py-24 bg-slate-50 dark:bg-[#050D1A] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <SectionHeader
            badge="Solutions Catalogue"
            title="Industrial Automation & Engineering Solutions"
            subtitle="Explore our 10 core industrial domains engineered to optimize operational uptime, precision control, and workplace safety."
          />

          {/* 10 Services Grid with 3D Tilt Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activeServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard maxTilt={5} scale={1.015}>
                  <ServiceCard
                    service={service}
                    onQuickQuote={(title) => openQuoteModal(title)}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 bg-[#0A192F] dark:bg-[#F27D26] hover:bg-[#F27D26] dark:hover:bg-[#d96a1a] text-white text-xs uppercase tracking-widest font-bold px-6 sm:px-8 py-3.5 sm:py-4 transition-all shadow-xs hover:-translate-y-0.5"
            >
              <span>Explore Detailed Solutions Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE AMM AUTOMATION (4 PILLARS) */}
      <section className="py-14 sm:py-16 lg:py-24 bg-white dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <SectionHeader
            badge="Engineering Rigor"
            title="Engineered for Reliability, Safety & Measured ROI"
            subtitle="Four core principles driving every engineering deployment, instrumentation calibration, and industrial software architecture."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              <TiltCard maxTilt={5} scale={1.02} className="h-full">
                <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26] transition-colors space-y-3 h-full">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 font-mono">PILLAR 01</span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0A192F] dark:text-white">Advanced Technology</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                    State-of-the-art multi-vendor PLC/SCADA systems, LiDAR SLAM autonomous robotics, smart IIoT edge sensors, and modern software architectures.
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <TiltCard maxTilt={5} scale={1.02} className="h-full">
                <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26] transition-colors space-y-3 h-full">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 font-mono">PILLAR 02</span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0A192F] dark:text-white">Cost-Effective Solutions</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                    Maximized ROI through targeted energy management (EMS), legacy system retrofits, extended equipment lifecycle, and rapid commissioning.
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <TiltCard maxTilt={5} scale={1.02} className="h-full">
                <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26] transition-colors space-y-3 h-full">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 font-mono">PILLAR 03</span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0A192F] dark:text-white">Improved Safety & Reliability</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                    Comprehensive Lockout-Tagout (LOTO) procedures, SIL-rated safety interlocks, and Class F/H insulation materials ensuring continuous operation.
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* Pillar 4 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <TiltCard maxTilt={5} scale={1.02} className="h-full">
                <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 hover:border-l-[#F27D26] dark:hover:border-l-[#F27D26] transition-colors space-y-3 h-full">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400 font-mono">PILLAR 04</span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0A192F] dark:text-white">Enhanced Efficiency</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                    Eliminating bottlenecks with automated material transit, real-time OEE tracking, and intuitive operator dashboards.
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. INDUSTRIES SECTION WITH STAGGERED REVEALS */}
      <section className="py-14 sm:py-16 lg:py-24 bg-slate-100 dark:bg-[#030812] text-slate-900 dark:text-white transition-colors duration-300 border-b border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <SectionHeader
            badge="Domain Expertise"
            title="Industries We Serve"
            subtitle="Tailored engineering architectures meeting the specialized environmental, safety, and regulatory demands of heavy manufacturing."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activeIndustries.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard maxTilt={5} scale={1.015}>
                  <IndustryCard industry={industry} />
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 sm:mt-12 text-center">
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 bg-[#0A192F] dark:bg-[#F27D26] hover:bg-[#F27D26] dark:hover:bg-[#d96a1a] text-white text-xs uppercase tracking-widest font-bold px-6 sm:px-8 py-3.5 sm:py-4 transition-colors shadow-xs hover:-translate-y-0.5"
            >
              <span>Explore All Industry Architectures</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PARTNER COMPANIES SECTION */}
      <PartnersSection id="partners" showExploreLink={true} />

      {/* 7. FINAL DARK NAVY CTA SECTION */}
      <CTASection />
    </div>
  );
};
