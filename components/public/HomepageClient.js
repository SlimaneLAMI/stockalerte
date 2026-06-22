'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import BackToTop from './BackToTop';
import { useSettings } from '@/components/SettingsContext';

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomepageClient() {
  const settings = useSettings();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true&limit=6').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([p, c]) => {
      setFeaturedProducts(Array.isArray(p?.products) ? p.products : []);
      setCategories(Array.isArray(c) ? c : []);
    });
  }, []);

  const heroImg = settings.hero_image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80';
  const whyUs = settings.why_us || [];

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] flex items-end overflow-hidden">
        {/* Parallax background */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <Image
            src={heroImg}
            alt="Cuisine professionnelle"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/60 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 pb-20"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="inline-block px-3 py-1.5 rounded-sm text-xs font-medium text-white mb-6 uppercase tracking-widest"
              style={{ backgroundColor: 'var(--orange)' }}
            >
              Équipements professionnels
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[1.05] max-w-3xl mb-6">
              {settings.hero_title || "L'équipement professionnel qui fait la différence"}
            </h1>
            <p className="text-lg text-white/75 max-w-xl mb-10 leading-relaxed">
              {settings.hero_subtitle || 'Matériel de cuisine professionnel sélectionné pour les chefs exigeants. Livraison, installation et SAV inclus.'}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-sm text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: 'var(--orange)' }}
              >
                {settings.hero_cta || 'Voir le catalogue'}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-sm text-sm font-medium text-white/90 border border-white/30 hover:bg-white/10 transition-colors"
              >
                Demander un devis
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-white/60" />
        </motion.div>
      </section>

      {/* ── CATEGORIES GRID ─────────────────────────────── */}
      {categories.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
          <FadeIn>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
                  Nos gammes
                </p>
                <h2 className="font-display font-bold text-3xl md:text-4xl" style={{ color: 'var(--foreground)' }}>
                  Équipez votre cuisine
                </h2>
              </div>
              <Link
                href="/catalogue"
                className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--orange)]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Tout voir <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <FadeIn key={cat._id} delay={i * 0.1}>
                <Link href={`/catalogue/categorie/${cat.slug}`} className="group block">
                  <motion.div
                    className="relative overflow-hidden rounded-sm"
                    style={{ aspectRatio: i === 0 ? '16/10' : '4/3' }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                  >
                    {cat.bannerImage ? (
                      <Image src={cat.bannerImage} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: 'var(--muted)' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <span className="text-3xl mb-3 block">{cat.icon}</span>
                      <h3 className="font-display font-bold text-2xl text-white mb-1">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-white/70 text-sm line-clamp-1">{cat.description}</p>
                      )}
                      <span
                        className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--orange)' }}
                      >
                        Explorer <ArrowRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ───────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-24" style={{ backgroundColor: 'var(--secondary)' }}>
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <FadeIn>
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
                    Sélection
                  </p>
                  <h2 className="font-display font-bold text-3xl md:text-4xl" style={{ color: 'var(--foreground)' }}>
                    Nos produits phares
                  </h2>
                </div>
                <Link
                  href="/catalogue"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--orange)]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Tout le catalogue <ArrowRight size={14} />
                </Link>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <FadeIn key={product._id} delay={i * 0.08}>
                  <ProductCard product={product} onQuickView={setQuickView} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ──────────────────────────────────────── */}
      {whyUs.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
              Notre engagement
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl" style={{ color: 'var(--foreground)' }}>
              Pourquoi nous choisir
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((item, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="p-8 rounded-sm border border-[var(--border)] bg-[var(--card)]">
                  <span className="text-4xl block mb-6">{item.icon}</span>
                  <h3 className="font-display font-bold text-xl mb-3" style={{ color: 'var(--foreground)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {item.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ── BRANDS STRIP ────────────────────────────────── */}
      <section className="border-y border-[var(--border)] py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-xs font-medium uppercase tracking-widest text-center mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Marques distribuées
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {['Rational', 'Hobart', 'Electrolux Professional', 'Fagor', 'Zanussi Professional'].map(brand => (
              <span
                key={brand}
                className="font-display font-bold text-lg opacity-30 hover:opacity-70 transition-opacity cursor-default"
                style={{ color: 'var(--foreground)' }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ─────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div
              className="relative overflow-hidden rounded-sm p-12 md:p-20 text-center"
              style={{ backgroundColor: '#1a1a1a' }}
            >
              <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
                style={{ backgroundColor: 'var(--orange)', transform: 'translate(30%, -30%)' }}
              />
              <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--orange)' }}>
                Projet d'équipement
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-6 max-w-2xl mx-auto">
                Vous avez un projet d'équipement ?
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10">
                Notre équipe vous accompagne dans le choix et la mise en place de votre cuisine professionnelle. Devis gratuit sous 48h.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-sm text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--orange)' }}
              >
                Demander un devis gratuit
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT INFO ────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FadeIn>
            <div className="p-8 rounded-sm border border-[var(--border)] bg-[var(--card)]">
              <h3 className="font-display font-bold text-xl mb-6" style={{ color: 'var(--foreground)' }}>
                Nous contacter
              </h3>
              <div className="space-y-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {settings.company_address && <p>📍 {settings.company_address}</p>}
                {settings.company_phone && <p>📞 {settings.company_phone}</p>}
                {settings.company_email && <p>✉️ {settings.company_email}</p>}
                {settings.company_hours && <p>🕐 {settings.company_hours}</p>}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: 'var(--orange)' }}
              >
                Envoyer un message <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-sm overflow-hidden border border-[var(--border)]" style={{ height: '280px' }}>
              {settings.maps_url && settings.maps_url.includes('maps/embed') ? (
                <iframe
                  src={settings.maps_url}
                  className="w-full h-full"
                  style={{ border: 0, filter: 'grayscale(20%)' }}
                  allowFullScreen
                  loading="lazy"
                  title="Localisation"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  Carte non configurée
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
      <BackToTop />
    </>
  );
}
