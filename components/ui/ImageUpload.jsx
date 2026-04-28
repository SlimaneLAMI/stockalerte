'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function ImageUpload({ value, onChange, folder = 'stockalerte', className }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const { data } = await axios.post('/api/upload', fd);
      onChange(data.url);
      toast.success('Image téléversée');
    } catch {
      toast.error('Erreur de téléversement');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('relative', className)}>
      {value ? (
        <div className="relative">
          <img src={value} alt="Upload" className="w-full h-40 object-cover rounded-xl" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-900 rounded-full shadow hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full h-40 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">Cliquer pour uploader</span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP · Max 5MB</span>
            </>
          )}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
    </div>
  );
}
