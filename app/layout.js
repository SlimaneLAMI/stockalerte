import './globals.css';
import { startKeepAlive } from '@/lib/keepAlive';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { buildAccentStyle } from '@/lib/accentColor';

startKeepAlive();

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

export const metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'StockAlerte — Équipements de Cuisine Professionnels',
    template: '%s | StockAlerte',
  },
  description: 'Spécialiste des équipements de cuisine professionnels pour restaurants, hôtels, traiteurs et collectivités. Cuisson, réfrigération, préparation et plus.',
  keywords: ['équipement cuisine professionnelle', 'matériel restaurant', 'cuisine pro', 'réfrigération commerciale', 'équipement hôtel'],
  authors: [{ name: 'StockAlerte' }],
  creator: 'StockAlerte',
  publisher: 'StockAlerte',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE,
    siteName: 'StockAlerte',
    title: 'StockAlerte — Équipements de Cuisine Professionnels',
    description: 'Spécialiste des équipements de cuisine professionnels pour restaurants, hôtels et collectivités.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'StockAlerte Équipements Professionnels' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StockAlerte — Équipements de Cuisine Professionnels',
    description: 'Spécialiste des équipements de cuisine professionnels pour restaurants, hôtels et collectivités.',
    images: ['/og-default.jpg'],
  },
  alternates: { canonical: BASE },
};

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
