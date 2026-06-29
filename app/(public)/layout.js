import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import PublicProviders from '@/components/PublicProviders';
import { getSettings } from '@/lib/getSettings';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

export default async function PublicLayout({ children }) {
  const settings = await getSettings();

  const name = settings.company_name || 'StockAlerte';
  const logoUrl = settings.logo_url;
  const color = settings.color_orange || '#e05c2a';

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name,
    url: BASE,
    logo: logoUrl
      ? { '@type': 'ImageObject', url: logoUrl, width: 512, height: 512 }
      : `${BASE}/icon.png`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: settings.company_phone || undefined,
        email: settings.company_email || undefined,
        contactType: 'customer service',
        availableLanguage: 'French',
        areaServed: 'FR',
      },
    ].filter(cp => cp.telephone || cp.email),
    address: settings.company_address
      ? { '@type': 'PostalAddress', streetAddress: settings.company_address }
      : undefined,
    sameAs: [
      settings.social_facebook,
      settings.social_instagram,
      settings.social_linkedin,
      settings.social_youtube,
      settings.social_twitter,
    ].filter(Boolean),
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/#local-business`,
    name,
    url: BASE,
    logo: logoUrl || `${BASE}/icon.png`,
    image: logoUrl || `${BASE}/icon.png`,
    description: settings.hero_subtitle || `${name} — Spécialiste des équipements de cuisine professionnelle`,
    ...(settings.company_phone && { telephone: settings.company_phone }),
    ...(settings.company_email && { email: settings.company_email }),
    ...(settings.company_address && {
      address: { '@type': 'PostalAddress', streetAddress: settings.company_address },
    }),
    ...(settings.company_hours && { openingHours: settings.company_hours }),
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Carte bancaire, Virement',
    ...(settings.maps_url && { hasMap: settings.maps_url }),
    parentOrganization: { '@id': `${BASE}/#organization` },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    name,
    url: BASE,
    description: settings.hero_subtitle || `${name} — Équipements de cuisine professionnelle`,
    inLanguage: 'fr-FR',
    publisher: { '@id': `${BASE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE}/catalogue?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <PublicProviders settings={settings}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PublicProviders>
  );
}
