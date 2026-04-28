import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import OfferCard from '@/components/ui/OfferCard';
import { connectDB } from '@/lib/db';
import Offer from '@/models/Offer';
import MerchantProfile from '@/models/MerchantProfile';
import { ArrowRight, Leaf, Search, ShoppingBag, Star, CheckCircle2, Zap } from 'lucide-react';

async function getFeaturedOffers() {
  try {
    await connectDB();
    return await Offer.find({ status: 'active', isActive: true, expiresAt: { $gt: new Date() } })
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
  { icon: '🥖', name: 'Alimentation', slug: 'alimentation', bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-100 dark:border-amber-800/30',  text: 'text-amber-700 dark:text-amber-400' },
  { icon: '💊', name: 'Pharmacie',    slug: 'pharmacie',    bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-100 dark:border-emerald-800/30', text: 'text-emerald-700 dark:text-emerald-400' },
  { icon: '👗', name: 'Mode',         slug: 'mode',         bg: 'bg-pink-50 dark:bg-pink-900/20',    border: 'border-pink-100 dark:border-pink-800/30',    text: 'text-pink-700 dark:text-pink-400' },
  { icon: '🏠', name: 'Maison',       slug: 'maison',       bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-100 dark:border-blue-800/30',    text: 'text-blue-700 dark:text-blue-400' },
  { icon: '📱', name: 'Tech',         slug: 'tech',         bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800/30', text: 'text-violet-700 dark:text-violet-400' },
  { icon: '🚗', name: 'Auto',         slug: 'auto',         bg: 'bg-gray-50 dark:bg-gray-800/40',    border: 'border-gray-100 dark:border-gray-700/50',    text: 'text-gray-600 dark:text-gray-400' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    emoji: '🔍',
    title: 'Découvrez les offres',
    desc: 'Parcourez des centaines de bons plans près de chez vous. Filtrez par catégorie, localisation ou type d\'offre.',
    color: 'bg-primary-50 dark:bg-primary-900/20',
    iconColor: 'text-primary-600',
  },
  {
    step: '02',
    icon: ShoppingBag,
    emoji: '🛍️',
    title: 'Réservez en 1 clic',
    desc: 'Sélectionnez l\'offre qui vous plaît et réservez instantanément depuis votre téléphone, sans frais cachés.',
    color: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600',
  },
  {
    step: '03',
    icon: Star,
    emoji: '✨',
    title: 'Récupérez & savourez',
    desc: 'Rendez-vous chez le commerçant, récupérez votre commande et profitez de bons produits à prix mini.',
    color: 'bg-rose-50 dark:bg-rose-900/20',
    iconColor: 'text-rose-600',
  },
];

const TRUST_ITEMS = [
  { icon: '🌱', title: 'Contre le gaspillage', desc: 'Chaque achat sauve un produit de la poubelle' },
  { icon: '💰', title: 'Jusqu\'à -70%', desc: 'Des réductions réelles sur les prix boutique' },
  { icon: '📍', title: '48 wilayas', desc: 'Des commerçants partout en Algérie' },
  { icon: '🔒', title: '100% sécurisé', desc: 'Paiements et données protégés' },
];

export default async function HomePage({ params: { locale } }) {
  const t = await getTranslations('home');
  const [offers, stats] = await Promise.all([getFeaturedOffers(), getStats()]);

  return (
    <PublicLayout>

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-cream dark:bg-gray-950 min-h-[88vh] flex items-center">

        {/* Animated blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/50 dark:bg-primary-900/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/10 rounded-full blur-[100px] animate-blob-delay pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-[80px] animate-blob-delay2 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Text content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-semibold mb-8 animate-fade-in-up">
                <Leaf className="w-4 h-4" />
                Plateforme anti-gaspillage n°1 en Algérie
              </div>

              {/* H1 */}
              <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-black text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-6 animate-fade-in-up delay-100">
                Sauvez de la<br />
                <span className="text-primary-500">nourriture.</span><br />
                Économisez.
              </h1>

              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-lg animate-fade-in-up delay-200">
                Des centaines d'offres anti-gaspillage de commerçants algériens — alimentation, mode, pharmacie et plus encore.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
                <Link href={`/${locale}/discover`} className="btn-primary text-base py-4 px-8 shadow-green-lg">
                  Découvrir les offres
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href={`/${locale}/auth/register`} className="btn-secondary text-base py-4 px-8">
                  Je suis commerçant
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 mt-10 pt-10 border-t border-gray-200 dark:border-gray-800 animate-fade-in-up delay-400">
                {[
                  { value: `${stats.offers}+`, label: 'offres actives' },
                  { value: `${stats.merchants}+`, label: 'commerçants' },
                  { value: '48', label: 'wilayas' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero image with floating cards */}
            <div className="relative hidden lg:block animate-scale-in delay-300">
              {/* Main image */}
              <div className="relative rounded-4xl overflow-hidden shadow-2xl aspect-[4/5] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20">
                <Image
                  src="/images/hero-food.jpg"
                  alt="Offres anti-gaspillage"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Fallback gradient overlay when no image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl opacity-20">🥗</span>
                </div>
              </div>

              {/* Floating card: discount */}
              <div className="absolute -left-10 top-1/4 bg-white dark:bg-gray-900 rounded-2xl shadow-card-hover p-4 flex items-center gap-3 animate-float border border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl">🏷️</div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Économie</div>
                  <div className="text-lg font-black text-red-500">-60%</div>
                </div>
              </div>

              {/* Floating card: new offer */}
              <div className="absolute -right-8 bottom-1/3 bg-white dark:bg-gray-900 rounded-2xl shadow-card-hover p-4 flex items-center gap-3 animate-float-delay border border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Nouvelle offre</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Boulangerie Ben Ali</div>
                </div>
              </div>

              {/* Floating card: saved */}
              <div className="absolute left-1/4 -bottom-6 bg-primary-500 rounded-2xl shadow-green-lg p-4 flex items-center gap-3 animate-float border border-primary-400">
                <CheckCircle2 className="w-6 h-6 text-white" />
                <div>
                  <div className="text-xs text-primary-100 font-medium">Réservation confirmée</div>
                  <div className="text-sm font-bold text-white">Panier sauvé ! 🎉</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════════ */}
      <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-cream dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Simple & rapide
            </span>
            <h2 className="section-title">Comment ça marche ?</h2>
            <p className="section-subtitle">En 3 étapes, sauvez de bons produits et faites des économies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 dark:from-primary-800 dark:via-primary-700 dark:to-primary-800" />

            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step}
                  className={`text-center animate-fade-in-up delay-${(i + 1) * 200}`}
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="relative inline-flex mb-6">
                    <div className={`w-24 h-24 rounded-3xl ${step.color} flex items-center justify-center text-4xl shadow-sm`}>
                      {step.emoji}
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-dark-green dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-black shadow-sm">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/discover`} className="btn-primary px-8 py-3.5">
              Voir les offres maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">{t('section_categories')}</h2>
              <p className="section-subtitle">Trouvez des offres dans votre domaine favori</p>
            </div>
            <Link href={`/${locale}/discover`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 hidden sm:flex">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map(({ icon, name, slug, bg, border, text }) => (
              <Link
                key={slug}
                href={`/${locale}/discover?category=${slug}`}
                className={`${bg} ${border} border rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center gap-2.5 hover:scale-105 hover:shadow-md transition-all duration-200 group`}
              >
                <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">{icon}</span>
                <span className={`text-xs font-semibold text-center leading-tight ${text}`}>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED OFFERS
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-cream dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">{t('section_featured')}</h2>
              <p className="section-subtitle">Les meilleures offres du moment</p>
            </div>
            <Link href={`/${locale}/discover`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 hidden sm:flex">
              {t('see_all')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {offers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {offers.map((offer) => (
                <OfferCard key={offer._id.toString()} offer={JSON.parse(JSON.stringify(offer))} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-4xl border border-gray-100 dark:border-gray-800">
              <span className="text-6xl block mb-4">🌱</span>
              <p className="text-gray-500 font-medium">Les premières offres arrivent bientôt !</p>
              <Link href={`/${locale}/auth/register`} className="btn-primary mt-6 inline-flex">
                Soyez le premier commerçant
              </Link>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href={`/${locale}/discover`} className="btn-secondary px-8 py-3.5">
              Voir toutes les offres
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          IMPACT NUMBERS
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-dark-green dark:bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-primary-500/20 text-primary-400 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-primary-500/30">
            🌍 Notre impact en Algérie
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">
            Ensemble, on change les choses
          </h2>
          <p className="text-white/60 text-lg mb-14 max-w-xl mx-auto">
            Chaque offre sauvée est un pas de plus vers un Algérie zéro-gaspillage
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: `${stats.offers}+`, label: 'Offres actives', emoji: '🏷️' },
              { value: `${stats.merchants}+`, label: 'Commerçants', emoji: '🏪' },
              { value: '18 000+', label: 'Repas sauvés', emoji: '🥗' },
              { value: '48', label: 'Wilayas couvertes', emoji: '📍' },
            ].map(({ value, label, emoji }) => (
              <div key={label} className="group">
                <div className="text-4xl mb-2">{emoji}</div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 group-hover:text-primary-400 transition-colors">{value}</div>
                <div className="text-white/50 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MERCHANT CTA
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 rounded-4xl p-10 sm:p-14 text-white relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  🏪 Espace commerçant
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                  Vous avez des produits à écouler ?
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Publiez vos offres en moins de 2 minutes, touchez des milliers de clients locaux et réduisez vos pertes.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  '✓ Inscription gratuite',
                  '✓ Tableau de bord complet',
                  '✓ QR Code & statistiques',
                  '✓ Notifications en temps réel',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 text-sm font-medium backdrop-blur-sm">
                    {item}
                  </div>
                ))}
                <Link href={`/${locale}/auth/register`}
                  className="mt-2 bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-4 rounded-2xl text-center transition-all duration-200 hover:shadow-lg active:scale-[0.97] flex items-center justify-center gap-2">
                  Créer mon espace gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
