import './globals.css';
import { startKeepAlive } from '@/lib/keepAlive';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { buildAccentStyle } from '@/lib/accentColor';
import { unstable_cache } from 'next/cache';

startKeepAlive();

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

const getRootSettings = unstable_cache(
  async () => {
    try {
      await connectDB();
      const rows = await SiteSettings.find({
        key: { $in: ['company_name', 'color_orange', 'color_orange_light', 'color_orange_dark', 'hero_subtitle', 'logo_url'] }
      }).lean();
      const m = {};
      rows.forEach(r => { m[r.key] = r.value; });
      return m;
    } catch { return {}; }
  },
  ['root-settings'],
  { revalidate: 60, tags: ['site-settings'] }
);

export async function generateMetadata() {
  const s = await getRootSettings();
  const name = s.company_name || 'StockAlerte';
  const logoUrl = s.logo_url;

  const title = `${name} — Équipements de Cuisine Professionnels`;
  const description = s.hero_subtitle || `Spécialiste des équipements de cuisine professionnels pour restaurants, hôtels, traiteurs et collectivités. Cuisson, réfrigération, préparation et plus.`;

  return {
    metadataBase: new URL(BASE),
    title: {
      default: title,
      template: `%s | ${name}`,
    },
    description,
    keywords: [
      'équipement cuisine professionnelle',
      'matériel restaurant',
      'cuisine professionnelle',
      'matériel hôtel',
      'équipement collectivité',
      'réfrigération commerciale',
      'four professionnel',
      'chambre froide',
      name.toLowerCase(),
    ],
    authors: [{ name }],
    creator: name,
    publisher: name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: BASE,
      siteName: name,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: { canonical: BASE },
    ...(logoUrl && {
      icons: {
        icon: [
          { url: '/icon.png', sizes: '32x32', type: 'image/png' },
          { url: '/icon.png?size=16', sizes: '16x16', type: 'image/png' },
        ],
        apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
      },
    }),
  };
}

async function getAccentStyle() {
  try {
    await connectDB();
    const rows = await SiteSettings.find({
      key: { $in: ['color_orange', 'color_orange_light', 'color_orange_dark'] }
    }).lean();
    const m = {};
    rows.forEach(r => { m[r.key] = r.value; });
    if (!m.color_orange) return '';
    return buildAccentStyle(
      m.color_orange,
      m.color_orange_light || m.color_orange,
      m.color_orange_dark  || m.color_orange,
    );
  } catch {
    return '';
  }
}

export default async function RootLayout({ children }) {
  const accentStyle = await getAccentStyle();
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500,400&f[]=satoshi@700,500,400&display=swap"
          rel="stylesheet"
        />
        {accentStyle && <style dangerouslySetInnerHTML={{ __html: accentStyle }} />}
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
