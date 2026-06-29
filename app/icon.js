import { ImageResponse } from 'next/og';
import { getSettings } from '@/lib/getSettings';

// Satori ne supporte pas le WebP — force PNG via Cloudinary
function toPng(url, size) {
  if (!url?.includes('res.cloudinary.com')) return url;
  const idx = url.indexOf('/upload/');
  if (idx === -1) return url;
  return url.slice(0, idx + 8) + `f_png,q_auto,w_${size},h_${size},c_fill/` + url.slice(idx + 8);
}

export async function generateImageMetadata() {
  return [
    { id: '32', size: { width: 32, height: 32 }, contentType: 'image/png' },
    { id: '16', size: { width: 16, height: 16 }, contentType: 'image/png' },
  ];
}

export default async function Icon({ id }) {
  const s = await getSettings();
  const w = id === '16' ? 16 : 32;
  const color = s.color_orange || '#e05c2a';
  const initials = s.logo_initials || (s.company_name ? s.company_name.slice(0, 2).toUpperCase() : 'SA');
  const logoUrl = s.logo_url ? toPng(s.logo_url, w) : null;

  return new ImageResponse(
    logoUrl ? (
      <img src={logoUrl} width={w} height={w} style={{ width: w, height: w, objectFit: 'cover' }} />
    ) : (
      <div style={{
        width: w, height: w, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: color, borderRadius: Math.floor(w * 0.125),
      }}>
        <span style={{ color: 'white', fontSize: id === '16' ? 8 : 14, fontWeight: 700, fontFamily: 'sans-serif' }}>
          {initials}
        </span>
      </div>
    ),
    { width: w, height: w }
  );
}
