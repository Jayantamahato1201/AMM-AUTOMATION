import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Cpu,
  Save,
  X,
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { api } from '../../services/api.js';
import { ServiceItem } from '../../types.js';
import { DynamicIcon } from '../../utils/iconHelper.js';

export const AdminServicesPage: React.FC = () => {
  const { services, refreshData } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Cpu',
    image: '',
    features: [],
    applications: [],
    subOfferings: [],
    relatedIndustries: [],
    isActive: true,
    displayOrder: 0
  });

  // String helpers for list fields
  const [featuresText, setFeaturesText] = useState('');
  const [applicationsText, setApplicationsText] = useState('');
  const [subOfferingsText, setSubOfferingsText] = useState('');
  const [industriesText, setIndustriesText] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      iconName: 'Cpu',
      image: '/images/hero_automation.jpg',
      features: [],
      applications: [],
      subOfferings: [],
      relatedIndustries: [],
      isActive: true,
      displayOrder: services.length + 1
    });
    setFeaturesText('');
    setApplicationsText('');
    setSubOfferingsText('');
    setIndustriesText('');
    setIsEditing(true);
    setFeedback(null);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingId(service.id);
    setFormData({ ...service });
    setFeaturesText((service.features || []).join('\n'));
    setApplicationsText((service.applications || []).join('\n'));
    setSubOfferingsText((service.subOfferings || []).join('\n'));
    setIndustriesText((service.relatedIndustries || []).join('\n'));
    setIsEditing(true);
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setFeedback(null);

    const payload: Partial<ServiceItem> = {
      ...formData,
      features: featuresText.split('\n').map(s => s.trim()).filter(Boolean),
      applications: applicationsText.split('\n').map(s => s.trim()).filter(Boolean),
      subOfferings: subOfferingsText.split('\n').map(s => s.trim()).filter(Boolean),
      relatedIndustries: industriesText.split('\n').map(s => s.trim()).filter(Boolean),
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    try {
      if (editingId) {
        await api.updateService(editingId, payload);
        setFeedback({ type: 'success', message: 'Service updated successfully!' });
      } else {
        await api.createService(payload);
        setFeedback({ type: 'success', message: 'New service created successfully!' });
      }
      await refreshData();
      setIsEditing(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save service.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) return;

    try {
      await api.deleteService(id);
      await refreshData();
      setFeedback({ type: 'success', message: `Service "${title}" deleted.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete service.' });
    }
  };

  const handleToggleActive = async (service: ServiceItem) => {
    try {
      await api.updateService(service.id, { isActive: !service.isActive });
      await refreshData();
    } catch (err: any) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Services & Solutions Management</h1>
          <p className="text-xs text-slate-500">
            Configure the 10 industrial solutions, equipment overhauling, sensor calibrations, and robotics.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Service Name & Icon</th>
                <th className="px-5 py-3">Short Summary</th>
                <th className="px-5 py-3">Sub-Offerings</th>
                <th className="px-5 py-3 text-center">Active Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map(srv => (
                <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-400 font-semibold">{srv.displayOrder}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-blue-900 text-white flex items-center justify-center shrink-0">
                        <DynamicIcon name={srv.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block text-xs">{srv.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">/solutions/{srv.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 max-w-xs truncate">
                    {srv.shortDescription}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {srv.subOfferings && srv.subOfferings.length > 0 ? (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {srv.subOfferings.length} areas
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(srv)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                        srv.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {srv.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{srv.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(srv)}
                      className="p-1.5 rounded text-blue-900 hover:bg-blue-50 transition-colors"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id, srv.title)}
                      className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0A192F] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? `Edit Service: ${formData.title}` : 'Add New Solution / Offering'}
                </h3>
                <span className="text-xs text-orange-400">AMM Automation Engineering Catalogue</span>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. electrical-rewinding"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={formData.iconName || 'Cpu'}
                    onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                    placeholder="Cpu, Zap, Gauge, Bot, ShieldCheck..."
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Sequence Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Image Path / URL</label>
                <input
                  type="text"
                  value={formData.image || ''}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/hero_automation.jpg"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (Card preview)</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Technical Description</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription || ''}
                  onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresText}
                    onChange={e => setFeaturesText(e.target.value)}
                    placeholder="SIL-2 safety rating&#10;Dynamic rotor balancing&#10;24/7 on-call dispatch"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Industrial Applications (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={applicationsText}
                    onChange={e => setApplicationsText(e.target.value)}
                    placeholder="Boiler feedwater pumps&#10;Blast furnace ventilation fans&#10;Conveyor drive units"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Specific Sub-Offerings (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={subOfferingsText}
                    onChange={e => setSubOfferingsText(e.target.value)}
                    placeholder="HT/LT Motor Rewinding&#10;Impeller Dynamic Balancing&#10;Bearing Alignment"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Industries (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={industriesText}
                    onChange={e => setIndustriesText(e.target.value)}
                    placeholder="Power & Energy&#10;Steel & Metallurgy&#10;Cement & Mining"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded font-semibold flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving...' : 'Save Offering'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
