import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Factory,
  ShieldCheck,
  Send,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { DynamicIcon } from '../utils/iconHelper.js';
import { api } from '../services/api.js';
import { CTASection } from '../components/common/CTASection.js';
import { optimizeImageUrl } from '../utils/imageOptimizer.js';

export const SolutionDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { services, openQuoteModal, content } = useData();

  const service = services.find(s => s.slug === slug);

  // Embedded RFQ Form state
  const [rfqName, setRfqName] = useState('');
  const [rfqEmail, setRfqEmail] = useState('');
  const [rfqPhone, setRfqPhone] = useState('');
  const [rfqCompany, setRfqCompany] = useState('');
  const [rfqDetails, setRfqDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!service) {
    return (
      <div className="min-h-[60vh] bg-slate-50 dark:bg-[#050D1A] flex items-center justify-center p-6 text-center transition-colors duration-300">
        <div className="max-w-md space-y-4">
          <Cpu className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Solution Not Found</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">The requested industrial solution catalog entry does not exist or may have been moved.</p>
          <Link
            to="/solutions"
            className="inline-flex items-center gap-1.5 bg-[#0A192F] dark:bg-[#F27D26] text-white text-xs font-semibold px-4 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Solutions</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleRfqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const res = await api.submitEnquiry({
        name: rfqName,
        companyName: rfqCompany,
        email: rfqEmail,
        phone: rfqPhone,
        service: service.title,
        subject: `Enquiry for ${service.title}`,
        message: rfqDetails
      });

      setSubmitSuccess(res.message || 'Thank you! Your enquiry has been received.');
      setRfqName('');
      setRfqEmail('');
      setRfqPhone('');
      setRfqCompany('');
      setRfqDetails('');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const otherServices = services
    .filter(s => s.id !== service.id && s.isActive)
    .slice(0, 4);

  return (
    <div className="bg-slate-50 dark:bg-[#050D1A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Banner / Header */}
      <section className="relative bg-[#0A192F] dark:bg-[#071324] text-white py-12 sm:py-14 lg:py-20 border-b border-slate-800 overflow-hidden transition-colors duration-300">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity overflow-hidden pointer-events-none">
          <img
            src={optimizeImageUrl(service.image, 800, 70)}
            alt={service.title}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] dark:from-[#071324] via-[#0A192F]/90 dark:via-[#071324]/90 to-[#0A192F]/80 dark:to-[#071324]/80" />
        </div>

        <div className="relative w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-4">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <span>/</span>
            <span className="text-[#F27D26] font-medium truncate max-w-[200px] sm:max-w-xs">{service.title}</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#F27D26] text-white flex items-center justify-center shrink-0">
                <DynamicIcon name={service.iconName} className="w-5 h-5" />
              </div>
              <p className="text-[#F27D26] font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-xs sm:text-sm">
                Turnkey Engineering
              </p>
            </div>

            <h1 className="text-fluid-h1 font-bold tracking-tight text-white italic">
              {service.title}
            </h1>

            <p className="text-fluid-lead text-slate-300 leading-relaxed max-w-2xl font-light">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Full Details */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Section */}
            <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#0A192F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Technical Overview & Scope
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {service.fullDescription}
              </p>

              {/* Sub-Offerings if available */}
              {service.subOfferings && service.subOfferings.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Specific Specializations & Equipment:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.subOfferings.map((sub, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 dark:bg-[#071324] border-l-2 border-[#0A192F] dark:border-l-slate-700 p-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-[#F27D26]" />
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Key Features & Specifications */}
            {service.features && service.features.length > 0 && (
              <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-[#0A192F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Key Features & Engineering Deliverables</span>
                </h2>
                <ul className="grid grid-cols-1 gap-3 pt-2">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Industrial Applications */}
            {service.applications && service.applications.length > 0 && (
              <div className="bg-white dark:bg-[#0A192F] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0A192F] dark:border-l-slate-700 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-[#0A192F] dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <Factory className="w-5 h-5 text-[#0A192F] dark:text-white" />
                  <span>Typical Plant Applications</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.applications.map((app, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 dark:bg-[#071324] border-l-2 border-[#0A192F] dark:border-l-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1"
                    >
                      <span className="font-bold text-[#0A192F] dark:text-white block">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Industries */}
            {service.relatedIndustries && service.relatedIndustries.length > 0 && (
              <div className="bg-[#0A192F] dark:bg-[#030812] text-white p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold">Recommended for Industries</h3>
                <p className="text-xs text-slate-300">This solution is heavily implemented across the following industrial sectors:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {service.relatedIndustries.map((ind, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800 dark:bg-slate-800 text-[#F27D26] border border-slate-700 text-xs font-semibold px-3 py-1.5"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick RFQ Form & Other Services */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct RFQ Box */}
            <div className="bg-[#0A192F] dark:bg-[#071324] text-white p-6 border border-slate-800 shadow-md space-y-4 sticky top-24">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-xs uppercase font-bold text-[#F27D26] tracking-[0.2em] block">
                  Quick Quotation / RFQ
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Enquire About This Solution</h3>
                <p className="text-xs text-slate-400 mt-0.5">Direct line to our technical specialists</p>
              </div>

              {submitSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-200">{submitSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleRfqSubmit} className="space-y-3">
                  {submitError && (
                    <div className="p-2.5 bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={rfqName}
                      onChange={e => setRfqName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Company / Plant</label>
                    <input
                      type="text"
                      value={rfqCompany}
                      onChange={e => setRfqCompany(e.target.value)}
                      placeholder="Company name"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={rfqEmail}
                      onChange={e => setRfqEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={rfqPhone}
                      onChange={e => setRfqPhone(e.target.value)}
                      placeholder="+91 9876xxxxxx"
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">Requirements / Specs *</label>
                    <textarea
                      required
                      rows={2}
                      value={rfqDetails}
                      onChange={e => setRfqDetails(e.target.value)}
                      placeholder="Quantity, rating, machine model, site location..."
                      className="w-full bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F27D26] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F27D26] hover:bg-[#d96a1a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3 shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSubmitting ? <span>Dispatching...</span> : (
                      <>
                        <span>Submit Specification RFQ</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1 font-mono">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>Call: {content?.contactPhone || '+91 9204673578'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span className="truncate">{content?.contactEmail || 'ammautomationsr@gmail.com'}</span>
                </p>
              </div>
            </div>

            {/* Other Solutions Links */}
            <div className="bg-white dark:bg-[#0A192F] p-5 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
                Explore Other Offerings
              </h4>
              <div className="space-y-2">
                {otherServices.map(other => (
                  <Link
                    key={other.id}
                    to={`/solutions/${other.slug}`}
                    className="block p-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#071324] hover:text-[#F27D26] dark:hover:text-[#F27D26] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{other.title}</span>
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
