import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { api } from '../../services/api.js';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  sectionTag?: string;
  helperText?: string;
  aspectHint?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  sectionTag = 'content',
  helperText,
  aspectHint
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only JPG, JPEG, PNG, WEBP, and SVG image formats are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const res = await api.uploadMedia(file, sectionTag, file.name);
      onChange(res.url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-slate-700 dark:text-slate-300">{label}</label>
        {aspectHint && <span className="text-[10px] text-slate-400 font-mono">{aspectHint}</span>}
      </div>

      {value ? (
        <div className="relative group rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#071324] p-2 flex items-center gap-3">
          <div className="w-16 h-16 rounded bg-slate-200 dark:bg-slate-800 shrink-0 overflow-hidden border border-slate-300 dark:border-slate-700 flex items-center justify-center">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">{value}</p>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-[10px] text-orange-600 hover:text-orange-500 dark:text-orange-400 font-semibold cursor-pointer"
              >
                Replace image
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[10px] text-red-500 hover:text-red-400 cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 rounded-lg flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-200">Uploading...</span>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
            isDragging
              ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-[#071324]/50 hover:border-orange-400 dark:hover:border-orange-600'
          }`}
        >
          {isUploading ? (
            <div className="flex items-center gap-2 py-2 text-slate-600 dark:text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
              <span className="text-[11px]">Uploading media asset...</span>
            </div>
          ) : (
            <>
              <Upload className="w-5 h-5 text-slate-400 group-hover:text-orange-500" />
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-orange-600 dark:text-orange-400">Click to upload</span> or drag & drop
              </div>
              <p className="text-[10px] text-slate-400">JPG, PNG, WEBP or SVG (Max 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />

      {error && <p className="text-[11px] text-red-500 dark:text-red-400">{error}</p>}
      {helperText && <p className="text-[10px] text-slate-400">{helperText}</p>}
    </div>
  );
};
