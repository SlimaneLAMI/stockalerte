import { ImageResponse } from 'next/og';
import { getSettings } from '@/lib/getSettings';

export async function generateImageMetadata() {
  return [
    { id: '32', size: { width: 32, height: 32 }, contentType: 'image/png' },
    { id: '16', size: { width: 16, height: 16 }, contentType: 'image/png' },
  ];
}

export default async function Icon({ id }) {
  const s = await getSettings();
  const logoUrl = s.logo_url || null;
  const color = s.color_orange || '#e05c2a';
  const initials = s.logo_initials || (s.company_name ? s.company_name.slice(0, 2).toUpperCase() : 'SA');
  const w = id === '16' ? 16 : 32;
  const fontSize = id === '16' ? 8 : 14;

  return new ImageResponse(
    logoUrl ? (
      <img src={logoUrl} width={w} height={w} style={{ width: w, height: w, objectFit: 'cover' }} />
    ) : (
      <div style={{
        width: w, height: w,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: color,
        borderRadius: Math.floor(w * 0.125),
      }}>
        <span style={{ color: 'white', fontSize, fontWeight: 700, fontFamily: 'sans-serif' }}>
          {initials}
        </span>
      </div>
    ),
    { width: w, height: w }
  );
}
