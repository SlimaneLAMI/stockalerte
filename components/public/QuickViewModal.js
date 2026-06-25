'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { useSettings } from '@/components/SettingsContext';

export default function QuickViewModal({ product, onClose }) {
  const s = useSettings();
  const [activeImg, setActiveImg] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactStep, setContactStep] = useState('choice');
  const [contactForm, setContactForm] = useState({ name: '', company: '', email: '', phone: '', message: '', productInterest: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const images = product?.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' }];

  const specEntries = product?.specs ? Object.entries(
    product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs
  ).slice(0, 4) : [];

  function openContact() {
    setContactForm(p => ({ ...p, productInterest: product?.name || '' }));
    setContactStep(s.company_phone ? 'choice' : 'form');
    setSent(false);
    setContactOpen(true);
  }

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

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
            style={{ backgroundColor: 'var(--background)' }}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
            >
              <X size={16} />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Images */}
              <div className="relative">
                <div className="aspect-square relative bg-[var(--muted)]">
                  <Image
                    src={images[activeImg]?.url}
                    alt={product.name}
                    fill
                    className="object-cover rounded-tl-sm rounded-bl-sm"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-12 h-12 rounded-sm overflow-hidden border-2 transition-all ${
                          i === activeImg ? 'border-[var(--orange)]' : 'border-[var(--border)]'
                        }`}
                      >
                        <Image src={img.url} alt="" width={48} height={48} className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col">
                {product.brand && (
                  <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--orange)' }}>
                    {product.brand}
                  </p>
                )}
                <h2 className="font-display font-bold text-xl leading-snug mb-3" style={{ color: 'var(--foreground)' }}>
                  {product.name}
                </h2>
                {product.priceVisible && product.price && (
                  <p className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--foreground)' }}>
                    {product.price.toLocaleString('fr-FR')} €
                    <span className="text-sm font-normal ml-1.5" style={{ color: 'var(--muted-foreground)' }}>HT</span>
                  </p>
                )}
                {product.shortDesc && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                    {product.shortDesc}
                  </p>
                )}
                {specEntries.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--foreground)' }}>
                      Spécifications
                    </p>
                    <div className="space-y-2">
                      {specEntries.map(([key, val]) => (
                        <div key={key} className="flex justify-between text-sm gap-4">
                          <span style={{ color: 'var(--muted-foreground)' }}>{key}</span>
                          <span className="font-medium text-right" style={{ color: 'var(--foreground)' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-auto flex flex-col gap-2">
                  <Link
                    href={`/catalogue/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-sm text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--orange)' }}
                  >
                    Voir la fiche complète
                    <ArrowRight size={15} />
                  </Link>
                  <button
                    onClick={openContact}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Nous contacter
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact modal */}
          <AnimatePresence>
            {contactOpen && (
              <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div className="absolute inset-0 bg-black/40" onClick={() => setContactOpen(false)} />
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
                              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}>
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
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
