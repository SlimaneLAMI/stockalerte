'use client';
import { useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';

export default function CloudinaryUpload({ value, onChange, folder = 'StockAlerte', label = 'Image', aspectRatio = '16/9' }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: fd }).then(r => r.json());
    setUploading(false);
    if (res.url) onChange(res.url);
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative rounded-sm overflow-hidden border border-[var(--border)]" style={{ aspectRatio }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/50 to-transparent">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium text-white cursor-pointer transition-opacity hover:opacity-90" style={{ backgroundColor: 'var(--orange)' }}>
              {uploading ? <Loader2 size={12} className="animate-spin" /> : <ImagePlus size={12} />}
              Remplacer
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="w-7 h-7 rounded-sm flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors"
            >
              <X size={13} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed cursor-pointer transition-colors hover:border-[var(--orange)]" style={{ borderColor: 'var(--border)', aspectRatio, minHeight: '120px' }}>
          {uploading
            ? <Loader2 size={22} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} />
            : <ImagePlus size={22} style={{ color: 'var(--muted-foreground)' }} />}
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {uploading ? 'Envoi en cours...' : `Cliquer pour uploader ${label.toLowerCase()}`}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </label>
      )}
    </div>
  );
}
