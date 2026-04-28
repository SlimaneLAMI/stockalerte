import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import PublicLayout from '@/components/layout/PublicLayout';
import OfferCard from '@/components/ui/OfferCard';
import OfferCardSkeleton from '@/components/ui/OfferCardSkeleton';
import { connectDB } from '@/lib/db';
import Offer from '@/models/Offer';
import MerchantProfile from '@/models/MerchantProfile';

async function getFeaturedOffers() {
  try {
    await connectDB();
    return await Offer.find({
      status: 'active', isActive: true,
      expiresAt: { $gt: new Date() },
    })
      .populate('merchant', 'businessName logo slug address')
      .populate('category', 'name slug')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(8)
      .lean();
  } catch { return []; }
}

async function getStats() {
  try {
    await connectDB();
    const [offers, merchants] = await Promise.all([
      Offer.countDocuments({ status: 'active', isActive: true }),
      MerchantProfile.countDocuments({ isActive: true }),
    ]);
    return { offers, merchants };
  } catch { return { offers: 0, merchants: 0 }; }
}

const CATEGORIES = [
  { icon: '🥖', name: 'Alimentation', slug: 'alimentation', color: 'bg-amber-50 dark:bg-amber-900/20' },
  { icon: '💊', name: 'Pharmacie',    slug: 'pharmacie',    color: 'bg-green-50 dark:bg-green-900/20' },
  { icon: '👗', name: 'Mode',         slug: 'mode',         color: 'bg-pink-50 dark:bg-pink-900/20' },
  { icon: '🏠', name: 'Maison',       slug: 'maison',       color: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: '📱', name: 'Tech',         slug: 'tech',         color: 'bg-purple-50 dark:bg-purple-900/20' },
  { icon: '🚗', name: 'Auto',         slug: 'auto',         color: 'bg-gray-50 dark:bg-gray-900/20' },
];

export default async function HomePage({ params: { locale } }) {
  const t       = await getTranslations('home');
  const [offers, stats] = await Promise.all([getFeaturedOffers(), getStats()]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm">
              🌿 Plateforme anti-gaspillage n°1 en Algérie
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('hero_title')}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${locale}/discover`} className="bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-primary-50 transition-colors text-center shadow-lg">
                {t('hero_cta')} →
              </Link>
              <Link href={`/${locale}/auth/register`} className="bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-colors text-center">
                {t('hero_secondary')}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-3 gap-6 max-w-lg">
            {[
              { value: stats.offers.toLocaleString(), label: t('stats_offers') },
              { value: stats.merchants.toLocaleString(), label: t('stats_merchants') },
              { value: '48', label: t('stats_cities') },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{value}</div>
                <div className="text-xs sm:text-sm text-white/70 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{t('section_categories')}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map(({ icon, name, slug, color }) => (
            <Link
              key={slug}
              href={`/${locale}/discover?category=${slug}`}
              className={`${color} rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer`}
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Offers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('section_featured')}</h2>
          <Link href={`/${locale}/discover`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            {t('see_all')} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <OfferCard key={offer._id.toString()} offer={JSON.parse(JSON.stringify(offer))} />
          ))}
          {offers.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Aucune offre disponible pour le moment
            </div>
          )}
        </div>
      </section>

      {/* CTA Merchant */}
      <section className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-4">🏪</div>
          <h2 className="text-3xl font-bold mb-4">Vous êtes commerçant ?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Publiez vos offres, promotions et produits à date courte. Touchez des milliers de clients près de vous.
          </p>
          <Link
            href={`/${locale}/auth/register`}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors inline-block"
          >
            Créer mon espace commerçant →
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
