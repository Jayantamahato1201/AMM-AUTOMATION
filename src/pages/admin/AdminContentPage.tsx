import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { api } from '../../services/api.js';
import { WebsiteContent } from '../../types.js';

export const AdminContentPage: React.FC = () => {
  const { content, refreshData } = useData();

  const [formData, setFormData] = useState<WebsiteContent>({
    heroHeading: '',
    heroSubheading: '',
    heroDescription: '',
    aboutIntro: '',
    aboutMission: '',
    aboutVision: '',
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    address: '',
    workingHours: '',
    tagline: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({ ...content });
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await api.updateContent(formData);
      await refreshData();
      setFeedback({ type: 'success', message: 'Website content updated successfully! Changes are live immediately.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update website content.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Website Content Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Edit live copywriting, hero headlines, corporate mission, contact phone, and workshop address.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/70 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Hero Section Content */}
        <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs transition-colors duration-300">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Hero & Landing Section</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Controls the primary headline on the homepage banner</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hero Heading Category Badge</label>
              <input
                type="text"
                value={formData.heroHeading || ''}
                onChange={e => setFormData({ ...formData, heroHeading: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hero Main Headline</label>
            <input
              type="text"
              value={formData.heroSubheading || ''}
              onChange={e => setFormData({ ...formData, heroSubheading: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hero Supporting Description</label>
            <textarea
              rows={3}
              value={formData.heroDescription || ''}
              onChange={e => setFormData({ ...formData, heroDescription: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
            />
          </div>
        </div>

        {/* 2. About Us Content */}
        <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs transition-colors duration-300">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Company Introduction, Mission & Vision</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Appears in About Us page and Homepage preview</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Overview / Introduction</label>
            <textarea
              rows={3}
              value={formData.aboutIntro || ''}
              onChange={e => setFormData({ ...formData, aboutIntro: e.target.value })}
              className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Our Mission Statement</label>
              <textarea
                rows={3}
                value={formData.aboutMission || ''}
                onChange={e => setFormData({ ...formData, aboutMission: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Our Vision Statement</label>
              <textarea
                rows={3}
                value={formData.aboutVision || ''}
                onChange={e => setFormData({ ...formData, aboutVision: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Contact Info */}
        <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs transition-colors duration-300">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Official Contact & Location Channels</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">Displayed in Navbar, Footer, Contact Page, and Quotation Modals</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.contactEmail || ''}
                onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.contactPhone || ''}
                onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Number (with country code)</label>
              <input
                type="text"
                value={formData.whatsappNumber || ''}
                onChange={e => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="919204673578"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Office / Works Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.workingHours || ''}
                onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded-md shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Site...' : 'Publish Content Updates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
