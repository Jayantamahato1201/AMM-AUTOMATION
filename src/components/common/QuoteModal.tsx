import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { api } from '../../services/api.js';
import { BrandLogo } from './BrandLogo.js';

export const QuoteModal: React.FC = () => {
  const { isQuoteModalOpen, closeQuoteModal, selectedQuoteService, services } = useData();

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    service: selectedQuoteService || '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync preset service when changed
  React.useEffect(() => {
    if (selectedQuoteService) {
      setFormData(prev => ({ ...prev, service: selectedQuoteService }));
    }
  }, [selectedQuoteService]);

  if (!isQuoteModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.submitQuoteRequest({
        name: formData.name,
        companyName: formData.companyName || undefined,
        email: formData.email,
        phone: formData.phone,
        requiredService: formData.service || 'Industrial Automation Solutions',
        projectDescription: formData.message
      });

      setSuccessMessage(res.message || 'Thank you! Your quote request has been dispatched to AMM engineers.');
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit quote request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={closeQuoteModal}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-lg bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10 animate-scale-up">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-[#071324] px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white p-0.5 rounded-xs flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
              <BrandLogo variant="symbol" className="w-full h-full" />
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#F27D26] tracking-[0.25em] uppercase block">DIRECT INQUIRY</span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Request an Industrial Quote</h3>
            </div>
          </div>
          <button
            onClick={closeQuoteModal}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          {successMessage ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 dark:bg-emerald-500/20 dark:border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">RFQ Received</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">{successMessage}</p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={closeQuoteModal}
                  className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 transition-colors shadow-xs"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 dark:text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Your Name <span className="text-[#F27D26]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jayanta"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Acme Steel Works"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-[#F27D26]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp <span className="text-[#F27D26]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876xxxxxx"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#F27D26]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Service / Solution Required
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#F27D26]"
                >
                  <option value="">-- Select Solution / Service --</option>
                  {services.map(s => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Other Custom Engineering Solution">Other Custom Engineering Solution</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Project Scope / Technical Details <span className="text-[#F27D26]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide specifications, machine capacity, motor rating, transmitter type, or operational timeline..."
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#F27D26] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F27D26] hover:bg-[#d96a1a] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3.5 shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting RFQ...</span>
                  ) : (
                    <>
                      <span>Submit RFQ to Engineering Team</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>Direct Hotline: </span>
                <a href="tel:+919204673578" className="text-[#F27D26] font-semibold hover:underline">
                  +91 9204673578
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
