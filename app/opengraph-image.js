import { ImageResponse } from 'next/og';
import { getSettings } from '@/lib/getSettings';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// ImageResponse/Satori ne supporte pas le WebP — force JPEG via Cloudinary
function toJpeg(url, { width, height } = {}) {
  if (!url?.includes('res.cloudinary.com')) return url;
  const idx = url.indexOf('/upload/');
  if (idx === -1) return url;
  const before = url.slice(0, idx + 8);
  const after = url.slice(idx + 8);
  const t = ['f_jpg', 'q_auto'];
  if (width)  t.push(`w_${width}`);
  if (height) t.push(`h_${height}`, 'c_fill');
  return `${before}${t.join(',')}/` + after;
}

export default async function OGImage() {
  const s = await getSettings();
  const name = s.company_name || 'StockAlerte';
  const color = s.color_orange || '#e05c2a';
  const logoUrl = s.logo_url ? toJpeg(s.logo_url, { width: 104, height: 104 }) : null;
  const bgUrl   = s.hero_image ? toJpeg(s.hero_image, { width: 1200, height: 630 }) : null;
  const title   = s.hero_title || 'Équipements de Cuisine Professionnelle';
  const sub     = s.hero_subtitle || 'Matériel professionnel pour restaurants, hôtels et collectivités';
  const badge   = s.hero_badge || 'Équipements professionnels';
  const initials = s.logo_initials || name.slice(0, 2).toUpperCase();

  return new ImageResponse(
    <div
      style={{
        width: 1200, height: 630,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end',
        padding: '60px 80px',
        background: '#1a1a1a',
        position: 'relative',
        fontFamily: 'sans-serif',
      }}
    >
      {bgUrl && (
        <img
          src={bgUrl}
          width={1200}
          height={630}
          style={{ position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover', opacity: 0.3 }}
        />
      )}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: 1200, height: 630,
        background: 'linear-gradient(to top, #1a1a1a 40%, rgba(26,26,26,0.5) 100%)',
        display: 'flex',
      }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          {logoUrl ? (
            <img src={logoUrl} width={52} height={52} style={{ borderRadius: 8, objectFit: 'cover', width: 52, height: 52 }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: 8, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: 22, fontWeight: 700 }}>{initials}</span>
            </div>
          )}
          <span style={{ color: 'white', fontSize: 30, fontWeight: 700 }}>{name}</span>
        </div>

        <div style={{ display: 'flex', marginBottom: 20 }}>
          <span style={{ backgroundColor: color, color: 'white', fontSize: 13, fontWeight: 600, letterSpacing: 3, padding: '6px 14px', borderRadius: 4, textTransform: 'uppercase' }}>
            {badge}
          </span>
        </div>

        <span style={{ color: 'white', fontSize: 58, fontWeight: 700, lineHeight: 1.1, maxWidth: 950, marginBottom: 20 }}>
          {title.length > 55 ? title.slice(0, 55) + '…' : title}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 22, maxWidth: 700, lineHeight: 1.45 }}>
          {sub.length > 100 ? sub.slice(0, 100) + '…' : sub}
        </span>
      </div>
    </div>,
    { ...size }
  );
}
