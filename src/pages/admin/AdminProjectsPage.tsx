import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Layers,
  Save,
  X,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext.js';
import { api } from '../../services/api.js';
import { ProjectItem } from '../../types.js';
import { optimizeImageUrl } from '../../utils/imageOptimizer.js';

export const AdminProjectsPage: React.FC = () => {
  const { projects, industries, services, refreshData } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<Partial<ProjectItem>>({
    title: '',
    slug: '',
    industry: industries[0]?.name || 'Power & Energy',
    services: [],
    clientType: '',
    location: '',
    completionYear: new Date().getFullYear().toString(),
    shortDescription: '',
    fullDescription: '',
    featuredImage: '',
    gallery: [],
    technologies: [],
    status: 'Completed'
  });

  const [techText, setTechText] = useState('');
  const [galleryText, setGalleryText] = useState('');
  const [servicesText, setServicesText] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      industry: industries[0]?.name || 'Power & Energy',
      services: [],
      clientType: 'Private Sector Industrial Enterprise',
      location: 'Industrial Corridor, Jharkhand',
      completionYear: '2024',
      shortDescription: '',
      fullDescription: '',
      featuredImage: '/images/hero_automation.jpg',
      gallery: [],
      technologies: [],
      status: 'Completed'
    });
    setTechText('');
    setGalleryText('');
    setServicesText('');
    setIsEditing(true);
    setFeedback(null);
  };

  const openEditModal = (project: ProjectItem) => {
    setEditingId(project.id);
    setFormData({ ...project });
    setTechText((project.technologies || []).join('\n'));
    setGalleryText((project.gallery || []).join('\n'));
    setServicesText((project.services || []).join('\n'));
    setIsEditing(true);
    setFeedback(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setFeedback(null);

    const payload: Partial<ProjectItem> = {
      ...formData,
      technologies: techText.split('\n').map(s => s.trim()).filter(Boolean),
      gallery: galleryText.split('\n').map(s => s.trim()).filter(Boolean),
      services: servicesText.split('\n').map(s => s.trim()).filter(Boolean),
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    };

    try {
      if (editingId) {
        await api.updateProject(editingId, payload);
        setFeedback({ type: 'success', message: 'Project case study updated!' });
      } else {
        await api.createProject(payload);
        setFeedback({ type: 'success', message: 'New project added to portfolio!' });
      }
      await refreshData();
      setIsEditing(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to save project.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete project "${title}"?`)) return;

    try {
      await api.deleteProject(id);
      await refreshData();
      setFeedback({ type: 'success', message: `Project "${title}" deleted.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete project.' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Portfolio & Case Studies Management</h1>
          <p className="text-xs text-slate-500">
            Add real customer project deployments, machinery retrofits, PLC programming, and plant upgrades.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded shadow flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Case Study</span>
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

      {/* Projects Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Project Title & Slug</th>
                  <th className="px-5 py-3">Industry</th>
                  <th className="px-5 py-3">Location & Year</th>
                  <th className="px-5 py-3">Technologies</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map(proj => (
                  <tr key={proj.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={optimizeImageUrl(proj.featuredImage, 120, 60)}
                          alt={proj.title}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">{proj.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">/portfolio/{proj.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">{proj.industry}</td>
                    <td className="px-5 py-4 text-slate-500">
                      <div>{proj.location || '-'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{proj.completionYear}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(proj.technologies || []).slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                        {(proj.technologies || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold self-center">
                            +{(proj.technologies || []).length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 rounded text-blue-900 hover:bg-blue-50 transition-colors"
                        title="Edit Project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-3">
            <Layers className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-800">No project case studies in portfolio</p>
            <p className="text-xs text-slate-400">Click "Add New Case Study" to create your first real project writeup.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0A192F] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? `Edit Project: ${formData.title}` : 'Add Project Case Study'}
                </h3>
                <span className="text-xs text-orange-400">Verified Plant Deployments</span>
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
                  <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
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
                    placeholder="e.g. sinter-plant-automation"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                  <select
                    value={formData.industry || ''}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  >
                    {industries.map(ind => (
                      <option key={ind.id} value={ind.name}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Commissioning Year</label>
                  <input
                    type="text"
                    value={formData.completionYear || ''}
                    onChange={e => setFormData({ ...formData, completionYear: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status || 'Completed'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Client Sector Type</label>
                  <input
                    type="text"
                    value={formData.clientType || ''}
                    onChange={e => setFormData({ ...formData, clientType: e.target.value })}
                    placeholder="Heavy Steel Enterprise"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Site Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Bokaro Steel City, Jharkhand"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Featured Image Path / URL</label>
                <input
                  type="text"
                  value={formData.featuredImage || ''}
                  onChange={e => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="/images/hero_automation.jpg"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Summary (Preview card)</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription || ''}
                  onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Case Study Writeup</label>
                <textarea
                  rows={4}
                  value={formData.fullDescription || ''}
                  onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Technologies / Hardware (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={techText}
                    onChange={e => setTechText(e.target.value)}
                    placeholder="Siemens S7-1500&#10;WinCC SCADA&#10;Class H Insulation"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Services Deployed (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={servicesText}
                    onChange={e => setServicesText(e.target.value)}
                    placeholder="PLC & SCADA Automation&#10;Electrical Rewinding"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-900 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gallery Image Paths / URLs (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={galleryText}
                    onChange={e => setGalleryText(e.target.value)}
                    placeholder="/images/plc_control_panel.jpg&#10;/images/scada_system.jpg"
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
                  <span>{saveLoading ? 'Saving...' : 'Save Case Study'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
