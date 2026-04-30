import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/layout/PublicLayout';
import OfferCard from '@/components/ui/OfferCard';
import { connectDB } from '@/lib/db';
import Offer from '@/models/Offer';
import MerchantProfile from '@/models/MerchantProfile';
import {
  ArrowRight, ArrowLeft, Leaf, Sprout, BadgePercent, MapPin, ShieldCheck,
  UtensilsCrossed, Sparkles, Shirt, Home, Smartphone, Car,
  Store, CalendarCheck, Truck, TrendingDown, Recycle, AlertTriangle,
  Zap, CheckCircle2,
} from 'lucide-react';

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

const CATEGORY_ICONS = [
  { icon: UtensilsCrossed, key: 'cat_food',    slug: 'alimentation',   bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-100 dark:border-amber-800/30',   text: 'text-amber-700 dark:text-amber-400',   iconBg: 'bg-amber-100 dark:bg-amber-900/40' },
  { icon: Sparkles,        key: 'cat_beauty',  slug: 'hygiene-beaute', bg: 'bg-cyan-50 dark:bg-cyan-900/20',     border: 'border-cyan-100 dark:border-cyan-800/30',     text: 'text-cyan-700 dark:text-cyan-400',     iconBg: 'bg-cyan-100 dark:bg-cyan-900/40' },
  { icon: Shirt,           key: 'cat_fashion', slug: 'mode',           bg: 'bg-pink-50 dark:bg-pink-900/20',     border: 'border-pink-100 dark:border-pink-800/30',     text: 'text-pink-700 dark:text-pink-400',     iconBg: 'bg-pink-100 dark:bg-pink-900/40' },
  { icon: Home,            key: 'cat_home_label', slug: 'maison',      bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-100 dark:border-blue-800/30',     text: 'text-blue-700 dark:text-blue-400',     iconBg: 'bg-blue-100 dark:bg-blue-900/40' },
  { icon: Smartphone,      key: 'cat_tech',    slug: 'tech',           bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-100 dark:border-violet-800/30', text: 'text-violet-700 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-900/40' },
  { icon: Car,             key: 'cat_auto',    slug: 'auto',           bg: 'bg-gray-50 dark:bg-gray-800/40',     border: 'border-gray-100 dark:border-gray-700/50',     text: 'text-gray-600 dark:text-gray-400',     iconBg: 'bg-gray-100 dark:bg-gray-700/60' },
];

const WASTE_VALUES = [
  { icon: AlertTriangle, value: '3,5M',  unitKey: 'waste_unit_tonnes',   statKey: 'waste_stat1', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { icon: TrendingDown,  value: '30%',   unitKey: null,                   statKey: 'waste_stat2', color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20' },
  { icon: Recycle,       value: '45 kg', unitKey: 'waste_unit_per_year', statKey: 'waste_stat3', color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  { icon: Zap,           value: '+40%',  unitKey: null,                   statKey: 'waste_stat4', color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
];

export default async function HomePage({ params }) {
  const locale = params?.locale || 'fr';
  const t = await getTranslations('home');
  const [offers, stats] = await Promise.all([getFeaturedOffers(), getStats()]);

  const HOW_IT_WORKS = [
    { step: '01', icon: Leaf,         image: '/images/step-browse.png',  title: t('how_step1_title'), desc: t('how_step1_desc'), bg: 'bg-primary-50 dark:bg-primary-900/20', iconColor: 'text-primary-600' },
    { step: '02', icon: CalendarCheck, image: '/images/step-reserve.png', title: t('how_step2_title'), desc: t('how_step2_desc'), bg: 'bg-amber-50 dark:bg-amber-900/20',   iconColor: 'text-amber-600' },
    { step: '03', icon: Truck,         image: '/images/step-pickup.png',  title: t('how_step3_title'), desc: t('how_step3_desc'), bg: 'bg-rose-50 dark:bg-rose-900/20',    iconColor: 'text-rose-600' },
  ];

  const TRUST_ITEMS = [
    { icon: Sprout,       title: t('trust_1_title'), desc: t('trust_1_desc'), color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30' },
    { icon: BadgePercent, title: t('trust_2_title'), desc: t('trust_2_desc'), color: 'text-red-600 bg-red-100 dark:bg-red-900/30' },
    { icon: MapPin,       title: t('trust_3_title'), desc: t('trust_3_desc'), color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { icon: ShieldCheck,  title: t('trust_4_title'), desc: t('trust_4_desc'), color: 'text-violet-600 bg-violet-100 dark:bg-violet-900/30' },
  ];

  const MERCHANT_FEATURES = [
    t('merchant_feat1'),
    t('merchant_feat2'),
    t('merchant_feat3'),
    t('merchant_feat4'),
  ];

  return (
    <PublicLayout>

      {/* ═══════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-cream dark:bg-gray-950 min-h-[88vh] flex items-center">

        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-200/50 dark:bg-primary-900/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-200/40 dark:bg-yellow-900/10 rounded-full blur-[100px] animate-blob-delay pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-100/30 dark:bg-primary-900/10 rounded-full blur-[80px] animate-blob-delay2 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Text content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full px-4 py-2 text-sm font-semibold mb-8 animate-fade-in-up">
                <Leaf className="w-4 h-4" />
                {t('hero_badge')}
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-black text-gray-900 dark:text-white leading-[1.08] tracking-tight mb-6 animate-fade-in-up delay-100">
                {t('hero_title_1')}<br />
                <span className="text-primary-500">{t('hero_title_2')}</span><br />
                {t('hero_title_3')}
              </h1>

              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-10 max-w-lg animate-fade-in-up delay-200">
                {t('hero_subtitle_full')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up delay-300">
                <Link href={`/${locale}/discover`} className="btn-primary text-base py-4 px-8 shadow-green-lg">
                  {t('hero_cta')}
                  {locale === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </Link>
                <Link href={`/${locale}/auth/register`} className="btn-secondary text-base py-4 px-8">
                  {t('hero_secondary')}
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10 pt-10 border-t border-gray-200 dark:border-gray-800 animate-fade-in-up delay-400">
                {[
                  { value: `${stats.offers}+`, label: t('stats_offers_label') },
                  { value: `${stats.merchants}+`, label: t('stats_merchants_label') },
                  { value: '58', label: t('stats_cities_label') },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-gray-900 dark:text-white" dir="ltr">{value}</div>
                    <div className="text-sm text-gray-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hero image with floating cards */}
            <div className="relative hidden lg:block animate-scale-in delay-300">
              <div className="relative rounded-4xl overflow-hidden shadow-2xl aspect-[4/5] bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20">
                <Image
                  src="/images/hero-food.jpg"
                  alt={t('hero_title_1')}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating card: discount */}
              <div className="absolute -left-10 top-1/4 bg-white dark:bg-gray-900 rounded-2xl shadow-card-hover p-4 flex items-center gap-3 animate-float border border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <BadgePercent className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">{t('float_saving')}</div>
                  <div className="text-lg font-black text-red-500">-60%</div>
                </div>
              </div>

              {/* Floating card: new offer */}
              <div className="absolute -right-8 bottom-1/3 bg-white dark:bg-gray-900 rounded-2xl shadow-card-hover p-4 flex items-center gap-3 animate-float-delay border border-gray-100 dark:border-gray-800">
                <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">{t('float_new_offer')}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">Boulangerie Bio</div>
                </div>
              </div>

              {/* Floating card: confirmed */}
              <div className="absolute left-1/4 -bottom-6 bg-primary-500 rounded-2xl shadow-green-lg p-4 flex items-center gap-3 animate-float border border-primary-400">
                <CheckCircle2 className="w-6 h-6 text-white" />
                <div>
                  <div className="text-xs text-primary-100 font-medium">{t('float_confirmed')}</div>
                  <div className="text-sm font-bold text-white">{t('float_basket')}</div>
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
            {TRUST_ITEMS.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
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
              {t('how_badge')}
            </span>
            <h2 className="section-title">{t('how_title')}</h2>
            <p className="section-subtitle">{t('how_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 dark:from-primary-800 dark:via-primary-700 dark:to-primary-800" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 200}ms` }}
              >
                <div className="relative inline-flex mb-6">
                  <div className={`w-36 h-36 rounded-3xl ${step.bg} overflow-hidden shadow-sm`}>
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-dark-green dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-black shadow-sm">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Delivery modes mini-bar */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            {[
              { icon: Store,         label: t('how_pickup_label'),      desc: t('how_pickup_desc') },
              { icon: CalendarCheck, label: t('how_reservation_label'), desc: t('how_reservation_desc') },
              { icon: Truck,         label: t('how_delivery_label'),    desc: t('how_delivery_desc') },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-3 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href={`/${locale}/discover`} className="btn-primary px-8 py-3.5">
              {t('how_cta')}
              {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
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
              <p className="section-subtitle">{t('cat_subtitle')}</p>
            </div>
            <Link href={`/${locale}/discover`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 hidden sm:flex">
              {t('cat_see_all')} {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORY_ICONS.map(({ icon: Icon, key, slug, bg, border, text, iconBg }) => (
              <Link
                key={slug}
                href={`/${locale}/discover?category=${slug}`}
                className={`${bg} ${border} border rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col items-center gap-2.5 hover:scale-105 hover:shadow-md transition-all duration-200 group`}
              >
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <span className={`text-xs font-semibold text-center leading-tight ${text}`}>{t(key)}</span>
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
              <p className="section-subtitle">{t('featured_subtitle')}</p>
            </div>
            <Link href={`/${locale}/discover`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 hidden sm:flex">
              {t('see_all')} {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
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
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-gray-500 font-medium">{t('featured_empty')}</p>
              <Link href={`/${locale}/auth/register`} className="btn-primary mt-6 inline-flex">
                {t('featured_empty_cta')}
              </Link>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href={`/${locale}/discover`} className="btn-secondary px-8 py-3.5">
              {t('featured_see_all')}
              {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ALGERIAN WASTE STATISTICS
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="w-4 h-4" />
              {t('waste_badge')}
            </span>
            <h2 className="section-title">{t('waste_title')}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">{t('waste_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {WASTE_VALUES.map(({ icon: Icon, value, unitKey, statKey, color, bg }) => (
              <div key={statKey} className={`${bg} rounded-3xl p-6 border border-transparent hover:shadow-md transition-shadow`}>
                <div className={`w-11 h-11 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`text-3xl font-black ${color} mb-0.5`} dir="ltr">
                  {value}{unitKey && <span className="text-lg font-bold ml-1">{t(unitKey)}</span>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{t(statKey)}</p>
              </div>
            ))}
          </div>

          {/* Call to action card */}
          <div className="bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/10 rounded-3xl p-8 sm:p-10 border border-primary-100 dark:border-primary-800/30 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shrink-0 shadow-green">
              <Recycle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('waste_cta_title')}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t('waste_cta_desc')}</p>
            </div>
            <Link href={`/${locale}/discover`} className="btn-primary shrink-0 px-6 py-3">
              {t('waste_cta_btn')}
              {locale === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
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
          <span className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-400 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-primary-500/30">
            <Sprout className="w-4 h-4" />
            {t('impact_badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight">{t('impact_title')}</h2>
          <p className="text-white/60 text-lg mb-14 max-w-xl mx-auto">{t('impact_subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BadgePercent, value: `${stats.offers}+`,    label: t('impact_offers') },
              { icon: Store,        value: `${stats.merchants}+`, label: t('impact_merchants_label') },
              { icon: Leaf,         value: '18 000+',             label: t('impact_saved') },
              { icon: MapPin,       value: '58',                  label: t('impact_cities') },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="group">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-500/30 transition-colors">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-1 group-hover:text-primary-400 transition-colors" dir="ltr">{value}</div>
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
                  <Store className="w-4 h-4" />
                  {t('merchant_badge')}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">{t('merchant_title')}</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-6">{t('merchant_subtitle')}</p>
                <div className="rounded-2xl overflow-hidden h-48 relative shadow-lg">
                  <Image
                    src="/images/merchant-cta.jpg"
                    alt={t('merchant_badge')}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {MERCHANT_FEATURES.map((feat) => (
                  <div key={feat} className="flex items-center gap-3 bg-white/10 rounded-2xl px-5 py-3 text-sm font-medium backdrop-blur-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary-300 shrink-0" />
                    {feat}
                  </div>
                ))}
                <Link
                  href={`/${locale}/auth/register`}
                  className="mt-2 bg-white text-primary-700 hover:bg-primary-50 font-bold px-8 py-4 rounded-2xl text-center transition-all duration-200 hover:shadow-lg active:scale-[0.97] flex items-center justify-center gap-2"
                >
                  {t('merchant_cta')}
                  {locale === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
