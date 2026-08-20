import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  Zap,
  Target,
  Compass,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Bot,
  Layers,
  Wrench,
  Flame,
  Award
} from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { SectionHeader } from '../components/common/SectionHeader.js';
import { CTASection } from '../components/common/CTASection.js';
import { BrandLogo } from '../components/common/BrandLogo.js';

export const AboutPage: React.FC = () => {
  const { content, openQuoteModal } = useData();

  return (
    <div className="bg-slate-50 dark:bg-[#050D1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Header Banner */}
      <section className="bg-[#0A192F] dark:bg-[#071324] text-white py-14 sm:py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
        <div className="relative w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl space-y-3 sm:space-y-4">
            <p className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm">
              Corporate Profile & Engineering Philosophy
            </p>
            <h1 className="text-fluid-h1 font-bold tracking-tight text-white italic">
              About AMM Automation
            </h1>
            <p className="text-fluid-lead text-slate-300 leading-relaxed font-light">
              A trusted engineering partner specializing in industrial automation, process instrumentation, electrical services, and Industry 4.0 transformation.
            </p>
          </div>
        </div>
      </section>

      {/* 1. Who We Are */}
      <section className="py-14 sm:py-16 lg:py-24 bg-white dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <span className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm block">
                WHO WE ARE
              </span>

              <h2 className="text-fluid-h2 font-bold tracking-tight text-[#0A192F] dark:text-white leading-snug">
                Precision Automation & Resilient Industrial Engineering
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-fluid-body leading-relaxed">
                {content?.aboutIntro ||
                  'AMM Automation is dedicated to engineering excellence, offering complete turnkey automation, process instrumentation, electrical engineering, and smart manufacturing integration for heavy industries and modern enterprises.'}
              </p>

              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                We combine deep field-level understanding of industrial machinery—from high-voltage pump motors and blast furnace thermocouples to automated guided robotics and SCADA systems—with modern digital architectures. Our goal is always singular: delivering reliable, plant-ready systems that enhance safety and maximize operational throughput.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => openQuoteModal()}
                  className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-bold text-xs uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Request Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 relative space-y-4">
              <div className="border border-slate-200 dark:border-slate-700 shadow-md overflow-hidden">
                <img
                  src="/images/instrumentation_field.jpg"
                  alt="Industrial Process Control & Instrumentation"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-64 sm:h-72 lg:h-80 object-cover"
                />
                <div className="p-3.5 sm:p-4 bg-[#0A192F] dark:bg-[#030812] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs font-semibold uppercase tracking-wider truncate">Safety & Quality Protocols</span>
                  </div>
                  <span className="text-xs text-[#F27D26] font-mono font-bold shrink-0">AMM-ENG-STD</span>
                </div>
              </div>

              {/* Official Brand Identity Card */}
              <div className="p-4 sm:p-5 bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white dark:bg-white p-1 rounded-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  <BrandLogo variant="symbol" className="w-full h-full" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0A192F] dark:text-white uppercase tracking-wide">
                    AMM Automation Official Identity
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Operating under rigorous engineering standards across Eastern India's core industrial corridors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="py-14 sm:py-16 lg:py-24 bg-slate-50 dark:bg-[#050D1A] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Mission */}
            <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 space-y-4 shadow-sm">
              <div className="w-10 h-10 bg-[#0A192F] dark:bg-slate-800 text-white flex items-center justify-center">
                <Target className="w-5 h-5 text-[#F27D26]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A192F] dark:text-white">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {content?.aboutMission ||
                  'To empower industrial operations with resilient, high-precision automation and intelligent digital monitoring solutions that optimize uptime, elevate plant safety, and drive measurable efficiency.'}
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                  <span>Deliver plant-ready, turnkey solutions with zero compromise on engineering standards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                  <span>Reduce operational downtime through precision calibration and preventive diagnostic systems.</span>
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 space-y-4 shadow-sm">
              <div className="w-10 h-10 bg-[#0A192F] dark:bg-slate-800 text-white flex items-center justify-center">
                <Compass className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A192F] dark:text-white">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {content?.aboutVision ||
                  'To be the most trusted industrial engineering and automation partner across process and manufacturing industries, recognized for technical depth, robust execution, and customer-first commitment.'}
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                  <span>Pioneer smart Industry 4.0 transitions for heavy manufacturing and utility plants.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                  <span>Establish the benchmark for safety compliance (LOTO) and zero-hazard engineering environments.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Approach */}
      <section className="py-14 sm:py-16 lg:py-24 bg-white dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <SectionHeader
            badge="Execution Methodology"
            title="Our Engineering Approach"
            subtitle="A systematic, lifecycle-driven process ensuring technical accuracy from initial site audit to lifelong plant maintenance."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Step 1 */}
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400">PHASE 01</span>
              <h4 className="text-base font-bold text-[#0A192F] dark:text-white">Site Audit & Scoping</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Detailed on-site assessment of existing instrumentation, PLC panels, motors, electrical load, and specific plant pain points.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400">PHASE 02</span>
              <h4 className="text-base font-bold text-[#0A192F] dark:text-white">System Architecture & Design</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Selection of calibrated sensors, PLC/SCADA tag mapping, control panel GA drawings, and fail-safe safety interlock design.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400">PHASE 03</span>
              <h4 className="text-base font-bold text-[#0A192F] dark:text-white">Fabrication & Commissioning</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Precision panel fabrication, Class F/H motor rewinding, field cabling, loop checking, and integrated plant trial runs.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0A192F] border-l-2 border-[#0A192F] dark:border-l-slate-700 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400">PHASE 04</span>
              <h4 className="text-base font-bold text-[#0A192F] dark:text-white">Lifecycle Support & 24/7 AMC</h4>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed">
                Operator training, technical documentation, scheduled preventive maintenance, and rapid 24/7 on-call breakdown response.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Expertise */}
      <section className="py-14 sm:py-16 lg:py-24 bg-[#0A192F] dark:bg-[#030812] text-white transition-colors duration-300">
        <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <SectionHeader
            badge="Core Disciplines"
            title="Multidisciplinary Engineering Capabilities"
            subtitle="Bridging electrical, instrumentation, automation, robotics, and custom software systems under one cohesive partner."
            dark
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 bg-slate-900/90 dark:bg-[#071324] border border-slate-800 border-l-2 border-l-[#F27D26] space-y-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h4 className="text-base font-bold text-white">Electrical Systems</h4>
              <p className="text-xs text-slate-400 leading-relaxed">HT/LT motor rewinding, dynamic balancing, vibration analysis, pump overhauling.</p>
            </div>

            <div className="p-5 sm:p-6 bg-slate-900/90 dark:bg-[#071324] border border-slate-800 border-l-2 border-l-[#F27D26] space-y-2">
              <Cpu className="w-5 h-5 text-[#F27D26]" />
              <h4 className="text-base font-bold text-white">PLC & SCADA Automation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Siemens, Rockwell, Schneider control architecture, HMI interfaces, VFD drive panels.</p>
            </div>

            <div className="p-5 sm:p-6 bg-slate-900/90 dark:bg-[#071324] border border-slate-800 border-l-2 border-l-[#F27D26] space-y-2">
              <Gauge className="w-5 h-5 text-blue-400" />
              <h4 className="text-base font-bold text-white">Process Instrumentation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">RTDs, thermocouples, thermal imaging condition monitoring, smart level & flow transmitters.</p>
            </div>

            <div className="p-5 sm:p-6 bg-slate-900/90 dark:bg-[#071324] border border-slate-800 border-l-2 border-l-[#F27D26] space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">LOTO & Plant Safety</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Hazardous energy isolation, custom Lockout Tagout hardware, safety interlocks.</p>
            </div>

            <div className="p-5 sm:p-6 bg-slate-900/90 dark:bg-[#071324] border border-slate-800 border-l-2 border-l-[#F27D26] space-y-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-bold text-white">Industrial Robotics & AMR</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Autonomous mobile robots (AMR/AGV) for line-side logistics, palletizers, lifting.</p>
            </div>

            <div className="p-5 sm:p-6 bg-slate-900/90 dark:bg-[#071324] border border-slate-800 border-l-2 border-l-[#F27D26] space-y-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base font-bold text-white">Industry 4.0 & Custom Software</h4>
              <p className="text-xs text-slate-400 leading-relaxed">EMS, BMS, custom shop floor portals, ERP/CRM implementations, mobile apps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
};
