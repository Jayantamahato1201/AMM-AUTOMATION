import React, { useEffect, useState } from 'react';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Globe,
  Tag,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { api } from '../../services/api.js';
import { PartnerCompanyItem } from '../../types.js';
import { useData } from '../../context/DataContext.js';
import { ImageUploadField } from '../../components/admin/ImageUploadField.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';

export const AdminPartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<PartnerCompanyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    companyName: string;
    slug: string;
    websiteUrl: string;
    displayUrl: string;
    category: string;
    shortDescription: string;
    fullDescription: string;
    tags: string;
    establishedRole: string;
    logo: string;
    isActive: boolean;
    displayOrder: number;
  }>({
    companyName: '',
    slug: '',
    websiteUrl: '',
    displayUrl: '',
    category: 'Technology & Digital Solutions Partner',
    shortDescription: '',
    fullDescription: '',
    tags: 'Modern Web Solutions, Software Development, Digital Transformation',
    establishedRole: 'Digital & Software Solutions Partner',
    logo: '',
    isActive: true,
    displayOrder: 1
  });

  const { refreshData } = useData();

  const loadPartners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getPartners(true);
      setPartners(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load partner companies.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const resetForm = () => {
    setFormData({
      companyName: '',
      slug: '',
      websiteUrl: '',
      displayUrl: '',
      category: 'Technology & Digital Solutions Partner',
      shortDescription: '',
      fullDescription: '',
      tags: 'Modern Web Solutions, Software Development, Digital Transformation',
      establishedRole: 'Digital & Software Solutions Partner',
      logo: '',
      isActive: true,
      displayOrder: partners.length + 1
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEdit = (partner: PartnerCompanyItem) => {
    setFormData({
      companyName: partner.companyName,
      slug: partner.slug,
      websiteUrl: partner.websiteUrl,
      displayUrl: partner.displayUrl || partner.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      category: partner.category,
      shortDescription: partner.shortDescription,
      fullDescription: partner.fullDescription || '',
      tags: (partner.tags || []).join(', '),
      establishedRole: partner.establishedRole || '',
      logo: partner.logo || '',
      isActive: partner.isActive !== false,
      displayOrder: partner.displayOrder || 1
    });
    setEditingId(partner.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setIsDeleting(true);
    setError(null);

    try {
      await api.deletePartner(id);
      // Immediately remove from local component state
      setPartners(prev => prev.filter(p => p.id !== id && p.slug !== id));
      setSuccessMsg(`Partner company "${name}" deleted successfully.`);
      setDeleteTarget(null);
      await loadPartners();
      await refreshData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete partner.');
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      companyName: formData.companyName.trim(),
      slug: formData.slug.trim() || formData.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      websiteUrl: formData.websiteUrl.trim(),
      displayUrl: formData.displayUrl.trim() || formData.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      category: formData.category.trim(),
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim() || undefined,
      tags: tagsArray,
      establishedRole: formData.establishedRole.trim() || undefined,
      logo: formData.logo.trim() || undefined,
      isActive: formData.isActive,
      displayOrder: Number(formData.displayOrder) || 1
    };

    try {
      if (editingId) {
        await api.updatePartner(editingId, payload);
        setSuccessMsg(`Partner company "${formData.companyName}" updated successfully.`);
      } else {
        await api.createPartner(payload);
        setSuccessMsg(`Partner company "${formData.companyName}" created successfully.`);
      }

      resetForm();
      await loadPartners();
      await refreshData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save partner company.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Handshake className="w-5 h-5 text-[#0A192F] dark:text-blue-400" />
            <span>Partner Companies Management</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage strategic industrial and technology collaborations dynamically (e.g. Global Infosoft).
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="bg-[#0A192F] dark:bg-orange-600 hover:bg-slate-800 dark:hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded shadow transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Partner</span>
          </button>
        )}
      </div>

      {/* Alert Notices */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Editor Form Modal/Inline */}
      {isEditing && (
        <div className="bg-white dark:bg-[#0A192F] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Partner Company' : 'Add New Partner Company'}
            </h2>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Global Infosoft"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Partnership Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Technology & Digital Solutions Partner"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.websiteUrl}
                  onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://globalinfosoft.com"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display URL Text
                </label>
                <input
                  type="text"
                  value={formData.displayUrl}
                  onChange={e => setFormData({ ...formData, displayUrl: e.target.value })}
                  placeholder="globalinfosoft.com"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Established Role / Subheading
                </label>
                <input
                  type="text"
                  value={formData.establishedRole}
                  onChange={e => setFormData({ ...formData, establishedRole: e.target.value })}
                  placeholder="e.g. Digital & Software Solutions Partner"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <ImageUploadField
              label="Partner Company Logo / Brand Emblem"
              value={formData.logo}
              onChange={url => setFormData({ ...formData, logo: url })}
              sectionTag="partner"
              helperText="Upload transparent PNG, SVG, or high-res company logo."
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Overview / Mission Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.shortDescription}
                onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Global Infosoft is a technology and digital solutions partner, supporting businesses with modern web solutions, software development, digital transformation, and innovative technology services."
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Capability Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Modern Web Solutions, Software Development, Digital Transformation, Innovative Technology Services"
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-[#071324] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="partnerActive"
                checked={formData.isActive}
                onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <label htmlFor="partnerActive" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Active & Published on Public Website
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-5 py-2 rounded shadow transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Update Partner' : 'Create Partner'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partners List */}
      <div className="bg-white dark:bg-[#0A192F] rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-300">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            All Partner Companies ({partners.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Stored dynamically in database</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            Loading partners from database...
          </div>
        ) : partners.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No partner companies registered yet. Click "Add New Partner" above.
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {partners.map(partner => (
              <div key={partner.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{partner.companyName}</h4>
                    <span className="bg-blue-50 dark:bg-blue-950/60 text-[#0A192F] dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {partner.category}
                    </span>
                    {partner.isActive !== false ? (
                      <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {partner.shortDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0A192F] dark:text-blue-400 hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 font-medium"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{partner.displayUrl || partner.websiteUrl}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    {partner.tags && partner.tags.length > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <Tag className="w-3 h-3" />
                        <span>{partner.tags.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="p-2 text-[#0A192F] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Edit Partner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(partner.id, partner.companyName)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Delete Partner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Partner Company"
        message={`Are you sure you want to delete "${deleteTarget?.name}" from partner companies? This will remove the listing from both the admin management system and the public website.`}
        confirmLabel="Delete Partner"
        cancelLabel="Keep Partner"
        isLoading={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
};
