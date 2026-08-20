import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, ArrowRight, MessageSquare, ShieldCheck, Cpu } from 'lucide-react';
import { useData } from '../../context/DataContext.js';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({ title, subtitle }) => {
  const { content, openQuoteModal } = useData();

  const phone = content?.contactPhone || '+91 9204673578';
  const whatsappNumber = (content?.whatsappNumber || '919204673578').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello AMM Automation, I would like to enquire about your industrial automation & engineering solutions.'
  )}`;

  return (
    <section className="bg-[#0A192F] relative overflow-hidden py-16 lg:py-24 text-white border-t border-slate-800">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4">
          Industrial Automation & Engineering
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl mx-auto italic">
          {title || content?.ctaHeading || "Let's Automate Today for a Smarter Tomorrow!"}
        </h2>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          {subtitle ||
            content?.ctaSubheading ||
            'Connect with our engineering specialists to discuss your plant automation, process instrumentation, or custom digital transformation requirements.'}
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            id="cta-contact-us-btn"
            className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-4 transition-all inline-flex items-center gap-2"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-whatsapp-us-btn"
            className="border border-white text-white hover:bg-white hover:text-[#0A192F] font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-4 transition-all inline-flex items-center gap-2"
          >
            {/* WhatsApp icon */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
            </svg>
            <span>WhatsApp Us</span>
          </a>

          <button
            onClick={() => openQuoteModal()}
            className="bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs sm:text-sm uppercase tracking-widest px-6 py-4 transition-all"
          >
            <span>Request Quote</span>
          </button>
        </div>

        {/* Supporting bullet points */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-400 max-w-3xl mx-auto uppercase tracking-wider font-semibold">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Industrial Compliance Standards</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-[#F27D26]" />
            <span>24/7 Breakdown Assistance</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Fast Turnaround on RFQs</span>
          </div>
        </div>
      </div>
    </section>
  );
};
