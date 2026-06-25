'use client';
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';

function parseAspect(aspectRatio) {
  if (typeof aspectRatio === 'number') return aspectRatio;
  const [w, h] = String(aspectRatio).split('/').map(Number);
  return w / h;
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}

async function getCroppedBlob(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
}

export default function CropModal({ imageSrc, aspectRatio = '1/1', onComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
    onComplete(blob);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="rounded-sm w-full max-w-lg mx-4 overflow-hidden" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>Recadrer l'image</span>
          <button type="button" onClick={onCancel} className="p-1">
            <X size={16} style={{ color: 'var(--muted-foreground)' }} />
          </button>
        </div>
        <div className="relative" style={{ height: '320px', background: '#111' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={parseAspect(aspectRatio)}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="px-4 py-3 flex items-center gap-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-[var(--orange)]"
          />
          <button
            type="button"
            onClick={handleConfirm}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium text-white shrink-0"
            style={{ backgroundColor: 'var(--orange)' }}
          >
            <Check size={14} /> Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
