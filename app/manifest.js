import { getSettings } from '@/lib/getSettings';
import { cloudinaryUrl } from '@/lib/cloudinaryUrl';

export default async function manifest() {
  const s = await getSettings();
  const name = s.company_name || 'StockAlerte';
  const color = s.color_orange || '#e05c2a';
  const logoUrl = s.logo_url;

  const icons = logoUrl ? [
    {
      src: cloudinaryUrl(logoUrl, { width: 192, height: 192 }),
      sizes: '192x192',
      type: 'image/webp',
      purpose: 'any',
    },
    {
      src: cloudinaryUrl(logoUrl, { width: 512, height: 512 }),
      sizes: '512x512',
      type: 'image/webp',
      purpose: 'any maskable',
    },
  ] : [
    { src: '/icon.png', sizes: '32x32', type: 'image/png' },
  ];

  return {
    name,
    short_name: name,
    description: s.hero_subtitle || `${name} — Équipements professionnels`,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: color,
    lang: 'fr',
    icons,
  };
}
