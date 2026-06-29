import { ImageResponse } from 'next/og';
import { getSettings } from '@/lib/getSettings';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Satori ne supporte pas le WebP — force PNG via Cloudinary
function toPng(url, s) {
  if (!url?.includes('res.cloudinary.com')) return url;
  const idx = url.indexOf('/upload/');
  if (idx === -1) return url;
  return url.slice(0, idx + 8) + `f_png,q_auto,w_${s},h_${s},c_fill/` + url.slice(idx + 8);
}

export default async function AppleIcon() {
  const s = await getSettings();
  const color = s.color_orange || '#e05c2a';
  const initials = s.logo_initials || (s.company_name ? s.company_name.slice(0, 2).toUpperCase() : 'SA');
  const logoUrl = s.logo_url ? toPng(s.logo_url, 180) : null;

  return new ImageResponse(
    logoUrl ? (
      <img src={logoUrl} width={180} height={180} style={{ width: 180, height: 180, objectFit: 'cover' }} />
    ) : (
      <div style={{
        width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: color, borderRadius: 22,
      }}>
        <span style={{ color: 'white', fontSize: 80, fontWeight: 700, fontFamily: 'sans-serif' }}>
          {initials}
        </span>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
