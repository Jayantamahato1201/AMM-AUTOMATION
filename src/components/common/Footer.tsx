import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { BrandLogo } from './BrandLogo.js';

export const Footer: React.FC = () => {
  const { content, services, industries } = useData();

  const phone = content?.contactPhone || '+91 9204673578';
  const email = content?.contactEmail || 'ammautomationsr@gmail.com';
  const whatsappNumber = (content?.whatsappNumber || '919204673578').replace(/[^0-9]/g, '');
  const address = content?.address || 'Industrial Corridor, Bokaro / Ranchi, Jharkhand, India';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello AMM Automation, I would like to enquire about your industrial automation & engineering solutions.'
  )}`;

  return (
    <footer className="bg-[#050D1A] text-slate-400 border-t border-slate-800 text-sm">
      {/* Editorial Highlights Bar */}
      <div className="bg-[#0A192F] border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-8 text-slate-300">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Email Us</span>
              <a href={`mailto:${email}`} className="text-sm font-bold text-white hover:text-[#F27D26] transition-colors mt-0.5">
                {email}
              </a>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Direct Call / WhatsApp</span>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm font-bold text-white hover:text-[#F27D26] transition-colors mt-0.5">
                {phone}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Domains:</span>
            <div className="flex flex-wrap gap-1.5">
              <span className="bg-[#050D1A] border border-slate-700 text-[9px] px-2.5 py-1 font-bold text-slate-200 tracking-wider">STEEL</span>
              <span className="bg-[#050D1A] border border-slate-700 text-[9px] px-2.5 py-1 font-bold text-slate-200 tracking-wider">POWER</span>
              <span className="bg-[#050D1A] border border-slate-700 text-[9px] px-2.5 py-1 font-bold text-slate-200 tracking-wider">CEMENT</span>
              <span className="bg-[#050D1A] border border-slate-700 text-[9px] px-2.5 py-1 font-bold text-slate-200 tracking-wider">OIL & GAS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Company Profile */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <BrandLogo variant="footer" />
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed pr-2">
              {content?.companyDescription ||
                'AMM Automation is a reliable partner in the field of industrial automation, process instrumentation, and smart Industry 4.0 solutions. We specialize in delivering advanced, cost-effective, and plant-ready solutions designed to improve operational efficiency, safety, productivity, and reliability.'}
            </p>

            <div className="space-y-2 pt-2 text-xs border-t border-slate-800/80">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-[#F27D26] shrink-0" />
                <span>{content?.workingHours || 'Mon - Sat: 9:00 AM - 6:30 PM (24/7 Breakdown on-call)'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Key Solutions */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
              Key Solutions
            </h4>
            <ul className="space-y-2 text-xs">
              {services.slice(0, 6).map(srv => (
                <li key={srv.id}>
                  <Link
                    to={`/solutions/${srv.slug}`}
                    className="hover:text-[#F27D26] transition-colors block py-0.5 truncate"
                  >
                    {srv.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/solutions"
                  className="text-[#F27D26] hover:underline text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 pt-1"
                >
                  <span>View All 10 Solutions</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Industries Served */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
              Industries
            </h4>
            <ul className="space-y-2 text-xs">
              {industries.slice(0, 6).map(ind => (
                <li key={ind.id}>
                  <Link
                    to={`/industries/${ind.slug}`}
                    className="hover:text-[#F27D26] transition-colors block py-0.5 truncate"
                  >
                    {ind.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/industries"
                  className="text-[#F27D26] hover:underline text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 pt-1"
                >
                  <span>All Industries</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Engineering Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
              Engineering RFQ
            </h4>
            <div className="space-y-3 text-xs">
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with our engineering desk for technical audits, panel quotations, or 24/7 on-site breakdown assistance.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-bold uppercase tracking-widest py-3 px-4 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-300 inline-flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Management Portal Access</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-slate-800/80 bg-[#02060D] py-4 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} AMM AUTOMATION. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center space-x-6 text-[11px] font-semibold uppercase tracking-wider">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link to="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
