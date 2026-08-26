import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  FileImage,
  Database
} from 'lucide-react';
import { api } from '../../services/api.js';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.js';

interface MediaItemData {
  id: string;
  fileName: string;
  publicUrl: string;
  fileSize: number;
  mimeType: string;
  altText?: string;
  relatedSection?: string;
  createdAt: string;
}

export const AdminMediaPage: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const data = await api.getMediaList();
      setMediaList(data || []);
    } catch (err: any) {
      console.warn('Failed to load media list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFeedback(null);

    try {
      const res = await api.uploadMedia(file, 'library', file.name);
      setFeedback({ type: 'success', message: `Uploaded ${file.name} successfully!` });
      await fetchMedia();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Upload failed.' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setIsDeleting(true);
    setFeedback(null);

    try {
      await api.deleteMedia(id);
      setMediaList(prev => prev.filter(m => m.id !== id));
      setFeedback({ type: 'success', message: 'Image deleted from storage.' });
      setDeleteTarget(null);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete image.' });
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMedia = mediaList.filter(item =>
    item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.relatedSection && item.relatedSection.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-[#0A192F] p-6 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors duration-300">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-600" />
            <span>Persistent Media & Asset Storage</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload, manage, and inspect all persistent images stored in MongoDB and cloud storage for the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded shadow-xs flex items-center gap-2 transition-all cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload New Image'}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>

          <button
            onClick={fetchMedia}
            className="p-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
            title="Refresh Library"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
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
          <span className="font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media files by name or section..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#0A192F] border border-slate-200 dark:border-slate-800 rounded pl-9 pr-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-500" />
          <span>Total Stored Assets: <strong className="text-slate-800 dark:text-slate-200">{mediaList.length}</strong></span>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading persistent media records...</div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white dark:bg-[#0A192F] p-12 rounded-lg border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <FileImage className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No media assets found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery ? 'No images match your search term.' : 'Upload photos, control cabinet diagrams, partner logos, or hero graphics to store them securely.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#0A192F] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs group flex flex-col justify-between transition-all hover:border-orange-500/50"
            >
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center">
                <img
                  src={item.publicUrl}
                  alt={item.altText || item.fileName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {(item.fileSize / 1024).toFixed(1)} KB
                </span>
              </div>

              <div className="p-3 space-y-2 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white truncate" title={item.fileName}>
                    {item.fileName}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                    {item.publicUrl}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.publicUrl, item.id)}
                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={item.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                      title="Open full size"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(item.id, item.fileName)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 cursor-pointer"
                      title="Delete image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Media File"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}" from media storage? Any webpage referencing this URL will no longer be able to display it.`}
        confirmLabel="Delete Media"
        cancelLabel="Cancel"
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
