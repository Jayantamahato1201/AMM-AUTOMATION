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
      <div className="min-h-[60vh] bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <Cpu className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Solution Not Found</h2>
          <p className="text-xs text-slate-600">The requested industrial solution catalog entry does not exist or may have been moved.</p>
          <Link
            to="/solutions"
            className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-xs font-semibold px-4 py-2 rounded"
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
    <div className="bg-slate-50 text-slate-900">
      {/* Banner / Header */}
      <section className="relative bg-[#0A192F] text-white py-14 lg:py-24 border-b border-slate-800 overflow-hidden">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity overflow-hidden">
          <img
            src={optimizeImageUrl(service.image, 800, 70)}
            alt={service.title}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/90 to-[#0A192F]/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <span>/</span>
            <span className="text-[#F27D26] font-medium">{service.title}</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F27D26] text-white flex items-center justify-center">
                <DynamicIcon name={service.iconName} className="w-5 h-5" />
              </div>
              <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
                Turnkey Engineering
              </p>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white italic">
              {service.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-light">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Full Details */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Section */}
            <div className="bg-white p-6 sm:p-8 border border-slate-200 border-l-4 border-l-[#0A192F] shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-[#0A192F] border-b border-slate-100 pb-3">
                Technical Overview & Scope
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {service.fullDescription}
              </p>

              {/* Sub-Offerings if available */}
              {service.subOfferings && service.subOfferings.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Specific Specializations & Equipment:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {service.subOfferings.map((sub, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50 border-l-2 border-[#0A192F] p-2.5 text-xs font-bold text-slate-800 flex items-center gap-2"
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
              <div className="bg-white p-6 sm:p-8 border border-slate-200 border-l-4 border-l-[#0A192F] shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-[#0A192F] border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Key Features & Engineering Deliverables</span>
                </h2>
                <ul className="grid grid-cols-1 gap-3 pt-2">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Industrial Applications */}
            {service.applications && service.applications.length > 0 && (
              <div className="bg-white p-6 sm:p-8 border border-slate-200 border-l-4 border-l-[#0A192F] shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-[#0A192F] border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Factory className="w-5 h-5 text-[#0A192F]" />
                  <span>Typical Plant Applications</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {service.applications.map((app, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 border-l-2 border-[#0A192F] text-xs text-slate-700 space-y-1"
                    >
                      <span className="font-bold text-[#0A192F] block">{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Industries */}
            {service.relatedIndustries && service.relatedIndustries.length > 0 && (
              <div className="bg-[#0A192F] text-white p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold">Recommended for Industries</h3>
                <p className="text-xs text-slate-300">This solution is heavily implemented across the following industrial sectors:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {service.relatedIndustries.map((ind, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800 text-[#F27D26] border border-slate-700 text-xs font-semibold px-3 py-1.5"
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
            <div className="bg-[#0A192F] text-white p-6 border border-slate-800 shadow-md space-y-4 sticky top-24">
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
                    className="w-full bg-[#F27D26] hover:bg-[#d96a1a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3 shadow transition-all flex items-center justify-center gap-1.5"
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
            <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Explore Other Offerings
              </h4>
              <div className="space-y-2">
                {otherServices.map(other => (
                  <Link
                    key={other.id}
                    to={`/solutions/${other.slug}`}
                    className="block p-2 rounded hover:bg-slate-50 text-xs font-medium text-slate-700 hover:text-blue-900 transition-colors"
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
