import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { useData } from '../context/DataContext.js';
import { api } from '../services/api.js';
import { SectionHeader } from '../components/common/SectionHeader.js';

export const ContactPage: React.FC = () => {
  const { content, services } = useData();

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    subject: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const phone = content?.contactPhone || '+91 9204673578';
  const email = content?.contactEmail || 'ammautomationsr@gmail.com';
  const address = content?.address || 'Industrial Corridor, Bokaro / Ranchi, Jharkhand, India';
  const whatsappNumber = (content?.whatsappNumber || '919204673578').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello AMM Automation, I would like to enquire about your industrial automation and engineering solutions.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic frontend checks
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all mandatory fields (*).');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.submitEnquiry({
        name: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'Industrial Engineering Enquiry',
        service: formData.service || 'General Enquiry',
        message: formData.message
      });

      setSuccessMessage(res.message || 'Thank you! Your enquiry has been received by our engineering office.');
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        subject: '',
        service: '',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again or reach out directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900">
      {/* Banner */}
      <section className="bg-[#0A192F] text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm">
              Engineering Support & RFQs
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white italic">
              Contact AMM Automation
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Connect directly with our automation engineers, instrumentation specialists, and field service team.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Direct Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs sm:text-sm block mb-1">
                  OFFICIAL COMMUNICATION
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] leading-snug">
                  Let's Discuss Your Industrial Project
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Whether you are planning a plant shutdown retrofit, seeking calibrated process sensors, or exploring autonomous warehouse robotics, we provide prompt technical evaluations.
                </p>
              </div>

              {/* Contact Information Cards */}
              <div className="space-y-4">
                {/* Email */}
                <div className="bg-white p-5 border border-slate-200 border-l-4 border-l-[#0A192F] shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0A192F] text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#F27D26]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</h4>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm font-semibold text-[#0A192F] hover:text-[#F27D26] transition-colors block mt-0.5"
                    >
                      {email}
                    </a>
                    <span className="text-[11px] text-slate-500">Official proposals & procurement inquiries</span>
                  </div>
                </div>

                {/* Phone & WhatsApp */}
                <div className="bg-white p-5 border border-slate-200 border-l-4 border-l-[#0A192F] shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0A192F] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#F27D26]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone / WhatsApp</h4>
                    <a
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="text-sm font-semibold text-[#0A192F] hover:text-[#F27D26] transition-colors block mt-0.5"
                    >
                      {phone}
                    </a>
                    <span className="text-[11px] text-slate-500">Direct technical desk & emergency on-call</span>
                  </div>
                </div>

                {/* WhatsApp Quick CTA */}
                <div className="bg-[#0A192F] p-5 text-white border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Instant WhatsApp Chat</h4>
                    <p className="text-xs text-slate-400">Message our engineers directly</p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 shadow transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Open WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Address & Hours */}
                <div className="bg-white p-5 border border-slate-200 border-l-4 border-l-slate-300 shadow-sm space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0A192F] uppercase tracking-wider block">Engineering Workshop & Office</span>
                      <span>{address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                    <Clock className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0A192F] uppercase tracking-wider block">Operating Hours</span>
                      <span>{content?.workingHours || 'Mon - Sat: 9:00 AM - 6:30 PM (24/7 Breakdown on-call)'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <span className="text-[#F27D26] font-bold tracking-[0.3em] uppercase text-xs block mb-1">
                    ONLINE SUBMISSION
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0A192F]">
                    Send Us an Industrial Enquiry / RFQ
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in the form below to receive a formal technical and commercial quote.
                  </p>
                </div>

                {successMessage ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-xl font-bold text-[#0A192F]">Enquiry Dispatched Successfully</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      {successMessage}
                    </p>
                    <button
                      onClick={() => setSuccessMessage(null)}
                      className="mt-4 bg-[#0A192F] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Full Name <span className="text-[#F27D26]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. jayanta"
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Company / Plant Name
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. Acme Industrial Works"
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Email Address <span className="text-[#F27D26]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Phone / WhatsApp Number <span className="text-[#F27D26]">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 9876xxxxxx"
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Service Interested In
                        </label>
                        <select
                          value={formData.service}
                          onChange={e => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#0A192F] focus:bg-white"
                        >
                          <option value="">-- Select Solution --</option>
                          {services.map(s => (
                            <option key={s.id} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                          <option value="General Industrial Automation">General Industrial Automation</option>
                          <option value="Emergency Plant Breakdown">Emergency Plant Breakdown</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Subject / RFQ Title
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={e => setFormData({ ...formData, subject: e.target.value })}
                          placeholder="e.g. 250kW Motor Rewinding Enquiry"
                          className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Detailed Project Requirements / Specifications <span className="text-[#F27D26]">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide details on equipment ratings, quantity, PLC platform, sensor operating temperature, or site timeline..."
                        className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0A192F] focus:bg-white resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#F27D26] hover:bg-[#d96a1a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-4 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <span>Submitting to Engineering Desk...</span>
                        ) : (
                          <>
                            <span>Submit Industrial Enquiry</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 text-center pt-1 font-mono">
                      Our application team typically responds to technical RFQs within 4 to 24 business hours.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
