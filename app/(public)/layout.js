import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import PublicProviders from '@/components/PublicProviders';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import { unstable_cache } from 'next/cache';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

const getSettings = unstable_cache(
  async () => {
    try {
      await connectDB();
      const docs = await SiteSettings.find().lean();
      const s = {};
      docs.forEach(d => { s[d.key] = d.value; });
      return s;
    } catch {
      return {};
    }
  },
  ['site-settings'],
  { revalidate: 60, tags: ['site-settings'] }
);

export default async function PublicLayout({ children }) {
  const settings = await getSettings();

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.company_name || 'StockAlerte',
    url: BASE,
    logo: `${BASE}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.company_phone || '',
      email: settings.company_email || '',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    address: settings.company_address
      ? { '@type': 'PostalAddress', streetAddress: settings.company_address }
      : undefined,
    sameAs: [
      settings.social_facebook,
      settings.social_instagram,
      settings.social_linkedin,
      settings.social_youtube,
    ].filter(Boolean),
  };

  return (
    <PublicProviders settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PublicProviders>
  );
}
