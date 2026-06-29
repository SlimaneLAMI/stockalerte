import { ImageResponse } from 'next/og';
import { getSettings } from '@/lib/getSettings';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function AppleIcon() {
  const s = await getSettings();
  const logoUrl = s.logo_url || null;
  const color = s.color_orange || '#e05c2a';
  const initials = s.logo_initials || (s.company_name ? s.company_name.slice(0, 2).toUpperCase() : 'SA');

  return new ImageResponse(
    logoUrl ? (
      <img src={logoUrl} width={180} height={180} style={{ width: 180, height: 180, objectFit: 'cover' }} />
    ) : (
      <div style={{
        width: 180, height: 180,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: color,
        borderRadius: 22,
      }}>
        <span style={{ color: 'white', fontSize: 80, fontWeight: 700, fontFamily: 'sans-serif' }}>
          {initials}
        </span>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
