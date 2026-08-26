import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Factory,
  Save,
  X,
  AlertCircle,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { api } from '../../services/api.js';
import { IndustryItem } from '../../types.js';
import { DynamicIcon } from '../../utils/iconHelper.js';
import { ImageUploadField } from '../../components/admin/ImageUploadField.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';

export const AdminIndustriesPage: React.FC = () => {
  const { industries, refreshData } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<Partial<IndustryItem>>({
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    iconName: 'Factory',
    image: '',
    challenges: [],
    solutions: [],
    relatedServices: [],
    isActive: true,
    displayOrder: 0
  });

  const [challengesText, setChallengesText] = useState('');
  const [solutionsText, setSolutionsText] = useState('');
  const [servicesText, setServicesText] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      shortDescription: '',
      description: '',
      iconName: 'Factory',
      image: '/images/metal_plant.jpg',
      challenges: [],
      solutions: [],
      relatedServices: [],
      isActive: true,
      displayOrder: industries.length + 1
    });
    setChallengesText('');
    setSolutionsText('');
    setServicesText('');
    setIsEditing(true);
    setFeedback(null);
  };

  const openEditModal = (industry: IndustryItem) => {
    setEditingId(industry.id);
    setFormData({ ...industry });
    setChallengesText((industry.challenges || []).join('\n'));
    setSolutionsText((industry.solutions || []).join('\n'));
    setServicesText((industry.relatedServices || []).join('\n'));
    setIsEditing(true);
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setFeedback(null);

    const payload: Partial<IndustryItem> = {
      ...formData,
      challenges: challengesText.split('\n').map(s => s.trim()).filter(Boolean),
      solutions: solutionsText.split('\n').map(s => s.trim()).filter(Boolean),
      relatedServices: servicesText.split('\n').map(s => s.trim()).filter(Boolean),
      slug: formData.slug || formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    try {
      if (editingId) {
        await api.updateIndustry(editingId, payload);
        setFeedback({ type: 'success', message: 'Industry updated successfully!' });
      } else {
        await api.createIndustry(payload);
        setFeedback({ type: 'success', message: 'New industry created successfully!' });
      }
      await refreshData();
      setIsEditing(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save industry.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setIsDeleting(true);
    setFeedback(null);

    try {
      await api.deleteIndustry(id);
      await refreshData();
      setFeedback({ type: 'success', message: `Industry "${name}" deleted successfully.` });
      setDeleteTarget(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete industry.' });
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (industry: IndustryItem) => {
    try {
      await api.updateIndustry(industry.id, { isActive: !industry.isActive });
      await refreshData();
      setFeedback({ type: 'success', message: `Updated active status for "${industry.name}".` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating status.' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Industries Served Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage the 9 industrial sectors (Power, Steel, Cement, Oil & Gas, etc.) with challenges and engineered solutions.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2.5 rounded shadow flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Industry</span>
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
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Industries Grid / Table */}
      <div className="bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Industry Name & Icon</th>
                <th className="px-5 py-3">Summary</th>
                <th className="px-5 py-3">Key Challenges</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {industries.map(ind => (
                <tr key={ind.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400 font-semibold">{ind.displayOrder}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded bg-[#0A192F] dark:bg-orange-600 text-white flex items-center justify-center shrink-0">
                        <DynamicIcon name={ind.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-xs">{ind.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">/industries/{ind.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {ind.shortDescription || ind.description}
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                    {ind.challenges && ind.challenges.length > 0 ? (
                      <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {ind.challenges.length} challenges mapped
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(ind)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                        ind.isActive
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {ind.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{ind.isActive ? 'Active' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(ind)}
                      className="p-1.5 rounded text-[#0A192F] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Edit Industry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(ind.id, ind.name)}
                      className="p-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Delete Industry"
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Industry Sector"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? All associated challenges and engineering solutions will be removed from public website.`}
        confirmLabel="Delete Industry"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
      />

      {/* Modal Form */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#0A192F] text-slate-900 dark:text-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 transition-colors duration-300">
            <div className="bg-slate-100 dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingId ? `Edit Industry: ${formData.name}` : 'Add New Industry Sector'}
                </h3>
                <span className="text-xs text-orange-600 dark:text-orange-400">AMM Automation Sector Profiles</span>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Industry Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. power-energy"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    value={formData.iconName || 'Factory'}
                    onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                    placeholder="Flame, Zap, Boxes, ShieldCheck..."
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={e => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="true">Active (Visible)</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <ImageUploadField
                label="Industry Feature Image / Manufacturing Plant Photo"
                value={formData.image}
                onChange={url => setFormData({ ...formData, image: url })}
                sectionTag="industry"
                helperText="Upload industrial sector photo or equipment diagram."
              />

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Industry Challenges (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={challengesText}
                    onChange={e => setChallengesText(e.target.value)}
                    placeholder="High thermal stress in furnaces&#10;Corrosive chemical atmospheres&#10;Zero-downtime grid requirements"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    AMM Solutions (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={solutionsText}
                    onChange={e => setSolutionsText(e.target.value)}
                    placeholder="High-temperature ceramic thermocouples&#10;Redundant dual-PLC hot standby&#10;24/7 on-call emergency rewinding"
                    className="w-full bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded font-semibold flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saveLoading ? 'Saving...' : 'Save Industry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
