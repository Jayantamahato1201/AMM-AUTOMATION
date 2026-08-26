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
  Sparkles,
  Image as ImageIcon,
  Share2,
  Globe,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { api } from '../../services/api.js';
import { WebsiteContent } from '../../types.js';
import { ImageUploadField } from '../../components/admin/ImageUploadField.js';

export const AdminContentPage: React.FC = () => {
  const { content, refreshData } = useData();

  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'cta' | 'contact' | 'branding' | 'seo'>('hero');

  const [formData, setFormData] = useState<WebsiteContent>({
    companyName: 'AMM AUTOMATION',
    tagline: '',
    companyLogo: '',
    favicon: '',
    heroHeading: '',
    heroSubheading: '',
    heroDescription: '',
    heroBadge: '',
    heroPrimaryBtnText: 'Request Engineering Consultation',
    heroPrimaryBtnLink: '/quote',
    heroSecondaryBtnText: 'Explore Turnkey Solutions',
    heroSecondaryBtnLink: '/services',
    heroImage: '',
    heroBgImage: '',
    heroImageAlt: '',
    aboutTitle: '',
    aboutHeading: '',
    aboutIntro: '',
    aboutMission: '',
    aboutVision: '',
    aboutApproach: '',
    aboutImage: '',
    aboutImageSecondary: '',
    ctaHeading: '',
    ctaSubheading: '',
    ctaButtonText: 'Initiate Automation Assessment',
    ctaButtonLink: '/quote',
    ctaImage: '',
    contactEmail: '',
    contactPhone: '',
    alternatePhone: '',
    emergencyPhone: '',
    whatsappNumber: '',
    address: '',
    workingHours: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    bannerNotice: '',
    footerDescription: '',
    copyrightText: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      youtube: ''
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (content) {
      setFormData(prev => ({
        ...prev,
        ...content,
        socialLinks: {
          ...prev.socialLinks,
          ...(content.socialLinks || {})
        }
      }));
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      await api.updateContent(formData);
      await refreshData();
      setFeedback({ type: 'success', message: 'Website content updated successfully! Changes are live across the site.' });
      setTimeout(() => setFeedback(null), 5000);
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
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Website CMS & Global Content</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control dynamic copywriting, hero imagery, company branding, and contact channels in real-time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold text-xs rounded shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Publishing...' : 'Save All Changes'}</span>
        </button>
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
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'hero', label: 'Hero & Banner', icon: Sparkles },
          { id: 'about', label: 'About & Mission', icon: FileText },
          { id: 'cta', label: 'Call to Action', icon: ArrowRight },
          { id: 'contact', label: 'Contact & Channels', icon: Phone },
          { id: 'branding', label: 'Branding & Socials', icon: Share2 },
          { id: 'seo', label: 'SEO & Notices', icon: Globe }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-orange-600 text-orange-600 dark:text-orange-400 font-bold bg-orange-50/30 dark:bg-orange-950/20 rounded-t'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Hero Tab */}
        {activeTab === 'hero' && (
          <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs transition-colors duration-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Homepage Hero & Showcase</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Primary landing banner elements and 3D digital twin presentation</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Hero Category Badge</label>
                <input
                  type="text"
                  value={formData.heroHeading || ''}
                  onChange={e => setFormData({ ...formData, heroHeading: e.target.value })}
                  placeholder="e.g. INDUSTRIAL AUTOMATION & ROBOTICS"
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Engineering Precision for Modern Industry"
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
                placeholder="e.g. Next-Generation Automation Solutions for Global Manufacturing"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-orange-500"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Button Text</label>
                <input
                  type="text"
                  value={formData.heroPrimaryBtnText || ''}
                  onChange={e => setFormData({ ...formData, heroPrimaryBtnText: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Button Link</label>
                <input
                  type="text"
                  value={formData.heroPrimaryBtnLink || ''}
                  onChange={e => setFormData({ ...formData, heroPrimaryBtnLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <ImageUploadField
                label="Hero Image / Automation Graphic"
                value={formData.heroImage}
                onChange={url => setFormData({ ...formData, heroImage: url })}
                sectionTag="hero"
                aspectHint="16:9 or 4:3"
                helperText="Upload industrial photo or engineering render."
              />

              <ImageUploadField
                label="Hero Background Pattern / Texture"
                value={formData.heroBgImage}
                onChange={url => setFormData({ ...formData, heroBgImage: url })}
                sectionTag="hero_bg"
                helperText="Subtle overlay pattern (optional)."
              />
            </div>
          </div>
        )}

        {/* 2. About Tab */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs transition-colors duration-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <span>Company Background, Mission & Vision</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Presented on About Us page, homepage spotlight, and corporate profile</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Overview & Introduction</label>
              <textarea
                rows={4}
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

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Engineering Approach & Methodology</label>
              <textarea
                rows={3}
                value={formData.aboutApproach || ''}
                onChange={e => setFormData({ ...formData, aboutApproach: e.target.value })}
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <ImageUploadField
                label="Primary About Us Photo / Facility Image"
                value={formData.aboutImage}
                onChange={url => setFormData({ ...formData, aboutImage: url })}
                sectionTag="about"
                aspectHint="16:10 or 4:3"
              />

              <ImageUploadField
                label="Secondary Team / Laboratory Photo"
                value={formData.aboutImageSecondary}
                onChange={url => setFormData({ ...formData, aboutImageSecondary: url })}
                sectionTag="about_secondary"
              />
            </div>
          </div>
        )}

        {/* 3. CTA Tab */}
        {activeTab === 'cta' && (
          <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs transition-colors duration-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-orange-600" />
                <span>Call to Action (CTA) Section</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Controls the conversion banner positioned before the footer across all pages</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">CTA Headline</label>
              <input
                type="text"
                value={formData.ctaHeading || ''}
                onChange={e => setFormData({ ...formData, ctaHeading: e.target.value })}
                placeholder="Ready to Automate Your Manufacturing Operations?"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">CTA Subheading / Value Proposition</label>
              <textarea
                rows={2}
                value={formData.ctaSubheading || ''}
                onChange={e => setFormData({ ...formData, ctaSubheading: e.target.value })}
                placeholder="Speak directly with our senior automation architects for custom control panel design."
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.ctaButtonText || ''}
                  onChange={e => setFormData({ ...formData, ctaButtonText: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Button Target Link</label>
                <input
                  type="text"
                  value={formData.ctaButtonLink || ''}
                  onChange={e => setFormData({ ...formData, ctaButtonLink: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                />
              </div>
            </div>

            <ImageUploadField
              label="CTA Banner Graphic / Background"
              value={formData.ctaImage}
              onChange={url => setFormData({ ...formData, ctaImage: url })}
              sectionTag="cta"
            />
          </div>
        )}

        {/* 4. Contact Channels Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs transition-colors duration-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Contact Channels & Office Details</span>
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Phone Number</label>
                <input
                  type="text"
                  value={formData.contactPhone || ''}
                  onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp Hotline</label>
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Factory & Office Address</label>
                <textarea
                  rows={2}
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Operating Hours</label>
                <textarea
                  rows={2}
                  value={formData.workingHours || ''}
                  onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. Branding Tab */}
        {activeTab === 'branding' && (
          <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs transition-colors duration-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-orange-600" />
                <span>Branding & Social Network Handles</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Company name, vector logos, and social media connectivity</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Trade Name</label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Copyright Statement</label>
                <input
                  type="text"
                  value={formData.copyrightText || ''}
                  onChange={e => setFormData({ ...formData, copyrightText: e.target.value })}
                  placeholder="© 2025 AMM Automation. All rights reserved."
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <ImageUploadField
                label="Company Custom Logo (PNG / SVG)"
                value={formData.companyLogo}
                onChange={url => setFormData({ ...formData, companyLogo: url })}
                sectionTag="logo"
                helperText="Transparent PNG or SVG recommended."
              />

              <ImageUploadField
                label="Favicon / Icon"
                value={formData.favicon}
                onChange={url => setFormData({ ...formData, favicon: url })}
                sectionTag="favicon"
                aspectHint="1:1"
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <h4 className="font-bold text-slate-800 dark:text-slate-200">Social Media Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.linkedin || ''}
                    onChange={e => setFormData({
                      ...formData,
                      socialLinks: { ...(formData.socialLinks || {}), linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/company/amm-automation"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Twitter / X Profile</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.twitter || ''}
                    onChange={e => setFormData({
                      ...formData,
                      socialLinks: { ...(formData.socialLinks || {}), twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/amm_automation"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. SEO & Notices Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-xs transition-colors duration-300">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-600" />
                <span>SEO Metadata & Sitewide Announcement Banner</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Search engine tags and top-of-page broadcast notices</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sitewide Top Announcement Notice</label>
              <input
                type="text"
                value={formData.bannerNotice || ''}
                onChange={e => setFormData({ ...formData, bannerNotice: e.target.value })}
                placeholder="e.g. ISO 9001:2015 Certified Automation Partner • Accepting New High-Volume Turnkey Projects"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Global Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="AMM Automation | Industrial Automation, PLC Panels & Turnkey Systems"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Global Meta Description</label>
              <textarea
                rows={3}
                value={formData.metaDescription || ''}
                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Turnkey industrial automation engineering, custom PLC/SCADA control cabinets, robotic automation, and machine retrofits."
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">SEO Keywords (Comma-separated)</label>
              <input
                type="text"
                value={formData.metaKeywords || ''}
                onChange={e => setFormData({ ...formData, metaKeywords: e.target.value })}
                placeholder="industrial automation, PLC panel manufacturing, SCADA systems, robotics integration"
                className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
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
