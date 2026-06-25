'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown, MapPin, Phone, Mail, Clock } from 'lucide-react';

function parseValue(str) {
  const s = String(str || '');
  const match = s.match(/^(\d+(?:[.,]\d+)?)(.*)/);
  if (!match) return { num: null, suffix: s };
  return { num: parseFloat(match[1].replace(',', '.')), suffix: match[2] };
}

function CountUp({ target, duration = 1600 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState('0');
  const { num, suffix } = parseValue(target);

  useEffect(() => {
    if (!inView) return;
    if (num === null) { setDisplay(target); return; }
    let startTs = null;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * num) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, num, suffix, target, duration]);

  return <span ref={ref}>{display}</span>;
}
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import BackToTop from './BackToTop';
import { useSettings } from '@/components/SettingsContext';
import { getIcon } from '@/lib/whyUsIcons';
import { cloudinaryUrl } from '@/lib/cloudinaryUrl';

/* ── Shimmer skeleton ───────────────────────────────────────── */
function Shimmer() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
      }}
    />
  );
}

function CategorySkeleton() {
  return (
    <div className="rounded-sm overflow-hidden relative" style={{ aspectRatio: '4/3', backgroundColor: 'var(--muted)' }}>
      <Shimmer />
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--card)]">
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', backgroundColor: 'var(--muted)' }}>
        <Shimmer />
      </div>
      <div className="p-5 space-y-3">
        <div className="rounded-sm h-3 w-20 relative overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><Shimmer /></div>
        <div className="rounded-sm h-5 w-3/4 relative overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><Shimmer /></div>
        <div className="rounded-sm h-3 w-full relative overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><Shimmer /></div>
        <div className="flex justify-between items-center pt-2">
          <div className="rounded-full h-6 w-20 relative overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><Shimmer /></div>
          <div className="rounded-full h-9 w-9 relative overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}><Shimmer /></div>
        </div>
      </div>
    </div>
  );
}

/* ── CategoryImage avec shimmer ─────────────────────────────── */
function CategoryImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'var(--muted)' }}>
          <Shimmer />
        </div>
      )}
      <Image
        src={cloudinaryUrl(src, { width: 800, height: 600 })}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </>
  );
}

/* ── BrandItem cliquable ────────────────────────────────────── */
function BrandItem({ brand }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const hasLogo = !!brand.logo;
  const hasLink = !!brand.website;

  const inner = (
    <div className="flex items-center gap-3 transition-opacity cursor-pointer hover:opacity-75">
      {hasLogo && (
        <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
          {!logoLoaded && (
            <div className="absolute inset-0 rounded-sm overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
              <Shimmer />
            </div>
          )}
          <Image
            src={brand.logo}
            alt={brand.name}
            fill
            className="object-contain transition-opacity duration-300"
            style={{ opacity: logoLoaded ? 1 : 0 }}
            onLoad={() => setLogoLoaded(true)}
            sizes="40px"
          />
        </div>
      )}
      <span className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>
        {brand.name}
      </span>
    </div>
  );

  if (hasLink) {
    return (
      <a href={brand.website} target="_blank" rel="noopener noreferrer" title={brand.name}>
        {inner}
      </a>
    );
  }

  return <div title={brand.name}>{inner}</div>;
}

/* ── FadeIn ─────────────────────────────────────────────────── */
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

/* ── Page principale ────────────────────────────────────────── */
export default function HomepageClient() {
  const settings = useSettings();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    const ac = new AbortController();
    Promise.all([
      fetch('/api/products?featured=true&limit=6', { signal: ac.signal }).then(r => r.json()),
      fetch('/api/categories', { signal: ac.signal }).then(r => r.json()),
      fetch('/api/brands', { signal: ac.signal }).then(r => r.json()),
    ]).then(([p, c, b]) => {
      setFeaturedProducts(Array.isArray(p?.products) ? p.products : []);
      setCategories(Array.isArray(c) ? c : []);
      setBrands(Array.isArray(b) ? b : []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => ac.abort();
  }, []);

  const heroImg = settings.hero_image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80';
  const whyUs = settings.why_us || [];

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[92vh] min-h-[600px] flex items-end overflow-hidden">
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
                className="inline-flex items-center justify-center gap-3 w-52 py-4 rounded-sm text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: 'var(--orange)' }}
              >
                {settings.hero_cta || 'Voir le catalogue'}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 w-52 py-4 rounded-sm text-sm font-medium text-white/90 border border-white/30 hover:bg-white/10 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} className="text-white/60" />
        </motion.div>
      </section>

      {/* ── CATEGORIES GRID ───────────────────────────────── */}
      {(loading || categories.length > 0) && (
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
              {!loading && (
                <Link
                  href="/catalogue"
                  className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--orange)]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Tout voir <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading
              ? [0, 1, 2].map(i => <CategorySkeleton key={i} />)
              : categories.map((cat, i) => (
                  <FadeIn key={cat._id} delay={i * 0.1}>
                    <Link href={`/catalogue?category=${cat._id}`} className="group block">
                      <motion.div
                        className="relative overflow-hidden rounded-sm"
                        style={{ aspectRatio: '4/3' }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                      >
                        {cat.bannerImage ? (
                          <CategoryImage src={cat.bannerImage} alt={cat.name} />
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
                ))
            }
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      {(loading || featuredProducts.length > 0) && (
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
                {!loading && (
                  <Link
                    href="/catalogue"
                    className="hidden sm:flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--orange)]"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Tout le catalogue <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? [0, 1, 2, 3, 4, 5].map(i => <ProductSkeleton key={i} />)
                : featuredProducts.map((product, i) => (
                    <FadeIn key={product._id} delay={i * 0.08}>
                      <ProductCard product={product} onQuickView={setQuickView} />
                    </FadeIn>
                  ))
              }
            </div>
          </div>
        </section>
      )}

      {/* ── WHY US ────────────────────────────────────────── */}
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
            {whyUs.map((item, i) => {
              const SvgIcon = getIcon(item.icon);
              return (
                <FadeIn key={i} delay={i * 0.12}>
                  <div className="p-8 rounded-sm border border-[var(--border)] bg-[var(--card)]">
                    {SvgIcon ? (
                      <div
                        className="w-14 h-14 rounded-sm flex items-center justify-center mb-6"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}
                      >
                        <SvgIcon size={28} style={{ color: 'var(--orange)' }} />
                      </div>
                    ) : (
                      <span className="text-4xl block mb-6">{item.icon}</span>
                    )}
                    <h3 className="font-display font-bold text-xl mb-3" style={{ color: 'var(--foreground)' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {item.text}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CHIFFRES CLÉS ─────────────────────────────────── */}
      {(settings.about_stats || []).filter(s => s.value || s.label).length > 0 && (
        <section className="border-y border-[var(--border)] py-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x divide-[var(--border)]">
              {(settings.about_stats).filter(s => s.value || s.label).map((stat, i) => (
                <motion.div
                  key={i}
                  className="flex flex-col items-center text-center px-6"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="font-display font-bold text-4xl md:text-5xl tabular-nums" style={{ color: 'var(--orange)' }}>
                    <CountUp target={stat.value} />
                  </p>
                  <p className="text-sm mt-2 font-medium" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRANDS STRIP ──────────────────────────────────── */}
      <section className="border-y border-[var(--border)] py-12">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-xs font-medium uppercase tracking-widest text-center mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Marques distribuées
          </p>

          {loading && (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-sm overflow-hidden relative" style={{ width: 100, height: 40, backgroundColor: 'var(--muted)' }}>
                  <Shimmer />
                </div>
              ))}
            </div>
          )}

          {!loading && brands.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {brands.map(brand => (
                <BrandItem key={brand._id} brand={brand} />
              ))}
            </div>
          )}

          {!loading && brands.length === 0 && (
            <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Aucune marque configurée pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* ── CONTACT CTA ───────────────────────────────────── */}
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
                {settings.cta_label || "Projet d'équipement"}
              </p>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-6 max-w-2xl mx-auto">
                {settings.cta_title || "Vous avez un projet d'équipement ?"}
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10">
                {settings.cta_subtitle || "Notre équipe vous accompagne dans le choix et la mise en place de votre cuisine professionnelle. Devis gratuit sous 48h."}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-sm text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--orange)' }}
              >
                {settings.cta_button || 'Nous contacter'}
                <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── CONTACT INFO ──────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <FadeIn className="h-full">
            <div className="h-full p-8 rounded-sm border border-[var(--border)] bg-[var(--card)]">
              <h3 className="font-display font-bold text-xl mb-6" style={{ color: 'var(--foreground)' }}>
                Nous contacter
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  settings.company_address && { Icon: MapPin, text: settings.company_address, href: null },
                  settings.company_phone  && { Icon: Phone,  text: settings.company_phone,   href: `tel:${settings.company_phone.replace(/\s/g, '')}` },
                  settings.company_email  && { Icon: Mail,   text: settings.company_email,    href: `mailto:${settings.company_email}` },
                  settings.company_hours  && { Icon: Clock,  text: settings.company_hours,    href: null },
                ].filter(Boolean).map(({ Icon, text, href }) => (
                  <div key={text} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}>
                      <Icon size={15} style={{ color: 'var(--orange)' }} />
                    </div>
                    {href ? (
                      <a href={href} className="text-sm whitespace-pre-line transition-colors hover:text-[var(--orange)]" style={{ color: 'var(--muted-foreground)' }}>{text}</a>
                    ) : (
                      <p className="text-sm whitespace-pre-line" style={{ color: 'var(--muted-foreground)' }}>{text}</p>
                    )}
                  </div>
                ))}
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
          <FadeIn delay={0.1} className="h-full">
            <div className="h-full min-h-[280px] rounded-sm overflow-hidden border border-[var(--border)]">
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
