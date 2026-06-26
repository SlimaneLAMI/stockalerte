'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, MessageSquare, X, ChevronRight, ZoomIn, ArrowLeft, Phone } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import ProductCard from './ProductCard';
import BackToTop from './BackToTop';
import { useSettings } from '@/components/SettingsContext';
import { cloudinaryUrl } from '@/lib/cloudinaryUrl';

function AvailabilityBadge({ status }) {
  const config = {
    'En stock': { bg: '#ecfdf5', text: '#065f46' },
    'Sur commande': { bg: '#fffbeb', text: '#92400e' },
  };
  const c = config[status] || config['En stock'];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.text }} />
      {status}
    </span>
  );
}

function ConditionBadge({ condition }) {
  const config = {
    'Neuf':           { bg: '#eff6ff', text: '#1d4ed8' },
    'Comme neuf':     { bg: '#f0f9ff', text: '#0369a1' },
    'Bonne occasion': { bg: '#f5f3ff', text: '#6d28d9' },
    'Occasion':       { bg: '#fff7ed', text: '#c2410c' },
  };
  const c = config[condition] || { bg: '#f8fafc', text: '#475569' };
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.text }} />
      {condition}
    </span>
  );
}

export default function ProductPageClient({ product, related }) {
  const s = useSettings();
  const priceLabel = s.price_mode === 'TTC' ? 'TTC' : 'HT';
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactStep, setContactStep] = useState('choice'); // 'choice' | 'form'
  const [contactForm, setContactForm] = useState({ name: '', company: '', email: '', phone: '', message: '', productInterest: product.name });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function openContact() {
    setContactStep(s.company_phone ? 'choice' : 'form');
    setSent(false);
    setContactOpen(true);
  }

  const images = product.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' }];

  const rawSpecs = product.specs;
  const specsEntries = rawSpecs
    ? rawSpecs instanceof Map
      ? [...rawSpecs.entries()]
      : Object.entries(rawSpecs)
    : [];

  async function handleContact(e) {
    e.preventDefault();
    setSending(true);
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    });
    setSending(false);
    setSent(true);
  }

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Catalogue', href: '/catalogue' },
    ...(product.categoryId?.name ? [{ label: product.categoryId.name, href: `/catalogue?category=${product.categoryId._id}` }] : []),
    { label: product.name },
  ];

  return (
    <>
      <div className="pt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12">
          <Breadcrumbs items={breadcrumbs} />

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Images */}
            <div>
              {/* Main image */}
              <div
                className="relative aspect-square rounded-sm overflow-hidden bg-[var(--muted)] mb-4 cursor-zoom-in group"
                onClick={() => setLightbox(true)}
              >
                <Image
                  src={cloudinaryUrl(images[activeImg]?.url, { width: 900 })}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <ZoomIn size={28} className="text-white drop-shadow" />
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-sm overflow-hidden border-2 transition-all ${
                        i === activeImg ? 'border-[var(--orange)]' : 'border-[var(--border)]'
                      }`}
                    >
                      <Image src={cloudinaryUrl(img.url, { width: 128, height: 128 })} alt="" width={64} height={64} className="object-cover w-full h-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.brand && (
                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
                  {product.brand}
                </p>
              )}
              <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight mb-4" style={{ color: 'var(--foreground)' }}>
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <AvailabilityBadge status={product.availability} />
                {s.show_condition !== false && product.condition && (
                  <ConditionBadge condition={product.condition} />
                )}
                {product.categoryId?.name && (
                  <Link
                    href={`/catalogue?category=${product.categoryId._id}`}
                    className="text-xs font-medium transition-colors hover:text-[var(--orange)]"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {product.categoryId.name}
                  </Link>
                )}
              </div>

              {s.show_prices !== false && product.priceVisible && product.price && (() => {
                const hasPromo = product.salePrice && product.salePrice < product.price;
                const discount = hasPromo ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
                return hasPromo ? (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-display font-bold text-4xl" style={{ color: 'var(--foreground)' }}>
                        {product.salePrice.toLocaleString('fr-FR')} €
                        <span className="text-base font-normal ml-2" style={{ color: 'var(--muted-foreground)' }}>{priceLabel}</span>
                      </p>
                      <p className="text-xl line-through" style={{ color: 'var(--muted-foreground)' }}>
                        {product.price.toLocaleString('fr-FR')} €
                      </p>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-sm font-bold text-white bg-red-500">
                        -{discount}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="font-display font-bold text-4xl mb-6" style={{ color: 'var(--foreground)' }}>
                    {product.price.toLocaleString('fr-FR')} €
                    <span className="text-base font-normal ml-2" style={{ color: 'var(--muted-foreground)' }}>{priceLabel}</span>
                  </p>
                );
              })()}

              {product.shortDesc && (
                <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--muted-foreground)' }}>
                  {product.shortDesc}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={openContact}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-sm text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--orange)' }}
                >
                  <MessageSquare size={16} />
                  Nous contacter
                </button>
                {product.pdfUrl && (
                  <a
                    href={product.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    <Download size={16} />
                    Fiche technique
                  </a>
                )}
              </div>

              {/* Specs */}
              {specsEntries.length > 0 && (
                <div className="border border-[var(--border)] rounded-sm overflow-hidden">
                  <div className="px-5 py-3 border-b border-[var(--border)]" style={{ backgroundColor: 'var(--muted)' }}>
                    <p className="font-display font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
                      Spécifications techniques
                    </p>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {specsEntries.map(([key, val]) => (
                      <div key={key} className="grid grid-cols-2 px-5 py-3 gap-4">
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{key}</span>
                        <span className="text-sm font-medium text-right" style={{ color: 'var(--foreground)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Long description */}
          {product.longDesc && (
            <div className="mt-16 max-w-2xl">
              <h2 className="font-display font-bold text-2xl mb-6" style={{ color: 'var(--foreground)' }}>
                Description détaillée
              </h2>
              <div
                className="prose prose-sm max-w-none leading-relaxed"
                style={{ color: 'var(--muted-foreground)' }}
                dangerouslySetInnerHTML={{ __html: product.longDesc }}
              />
            </div>
          )}

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-20 mb-24">
              <h2 className="font-display font-bold text-2xl mb-8" style={{ color: 'var(--foreground)' }}>
                Produits similaires
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button className="absolute top-6 right-6 text-white/60 hover:text-white">
              <X size={24} />
            </button>
            <div className="relative w-full max-w-4xl aspect-square mx-6" onClick={e => e.stopPropagation()}>
              <Image src={images[activeImg]?.url} alt={product.name} fill className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact modal */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setContactOpen(false)} />
            <motion.div
              className="relative w-full max-w-lg rounded-sm shadow-2xl overflow-y-auto max-h-[90vh]"
              style={{ backgroundColor: 'var(--background)' }}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <button
                onClick={() => setContactOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--muted)]"
              >
                <X size={15} />
              </button>
              <div className="p-8">
                {sent ? (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-4">✅</p>
                    <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>
                      Demande envoyée !
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Nous vous recontactons sous 48h ouvrées.
                    </p>
                  </div>
                ) : contactStep === 'choice' ? (
                  <>
                    <h2 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--foreground)' }}>
                      Nous contacter
                    </h2>
                    <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
                      Pour : <strong style={{ color: 'var(--foreground)' }}>{product.name}</strong>
                    </p>
                    <div className="flex flex-col gap-3">
                      {s.company_phone && (
                        <a
                          href={`tel:${s.company_phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-4 px-6 py-5 rounded-sm border transition-colors hover:border-[var(--orange)] group"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors group-hover:bg-orange-50" style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}>
                            <Phone size={18} style={{ color: 'var(--orange)' }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Appeler directement</p>
                            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.company_phone}</p>
                          </div>
                        </a>
                      )}
                      <button
                        onClick={() => setContactStep('form')}
                        className="flex items-center gap-4 px-6 py-5 rounded-sm border transition-colors hover:border-[var(--orange)] group text-left"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors group-hover:bg-orange-50" style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}>
                          <MessageSquare size={18} style={{ color: 'var(--orange)' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Envoyer un message</p>
                          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Réponse sous 48h ouvrées</p>
                        </div>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      {s.company_phone && (
                        <button
                          onClick={() => setContactStep('choice')}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--muted)] transition-colors hover:bg-[var(--border)]"
                        >
                          <ArrowLeft size={14} />
                        </button>
                      )}
                      <div>
                        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--foreground)' }}>
                          Demande de devis
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Pour : <strong style={{ color: 'var(--foreground)' }}>{product.name}</strong>
                        </p>
                      </div>
                    </div>
                    <form onSubmit={handleContact} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
                          <input required value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Société</label>
                          <input value={contactForm.company} onChange={e => setContactForm(p => ({ ...p, company: e.target.value }))}
                            className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Email *</label>
                        <input required type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Message *</label>
                        <textarea required rows={4} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                          className="w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors resize-none bg-[var(--card)]"
                          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          placeholder="Précisez vos besoins, quantité, délais..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full py-3.5 rounded-sm text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                        style={{ backgroundColor: 'var(--orange)' }}
                      >
                        {sending ? 'Envoi en cours...' : 'Envoyer la demande'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BackToTop />
    </>
  );
}
