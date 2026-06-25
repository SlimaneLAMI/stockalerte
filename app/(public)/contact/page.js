'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import BackToTop from '@/components/public/BackToTop';
import { useSettings } from '@/components/SettingsContext';

export default function ContactPage() {
  const s = useSettings();
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '', productInterest: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSending(false);
    setSent(true);
  }

  const contactItems = [
    s.company_address && { Icon: MapPin, text: s.company_address, href: null },
    s.company_phone && { Icon: Phone, text: s.company_phone, href: `tel:${s.company_phone.replace(/\s/g, '')}` },
    s.company_email && { Icon: Mail, text: s.company_email, href: `mailto:${s.company_email}` },
    s.company_hours && { Icon: Clock, text: s.company_hours, href: null },
  ].filter(Boolean);

  return (
    <>
      <div className="pt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 pb-24">
          <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Contact' }]} />

          <div className="mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
              Nous contacter
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl" style={{ color: 'var(--foreground)' }}>
              Parlons de votre projet
            </h1>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <motion.div
                  className="flex flex-col items-center justify-center text-center py-20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={56} className="mb-6" style={{ color: 'var(--orange)' }} />
                  <h2 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--foreground)' }}>
                    Message envoyé !
                  </h2>
                  <p className="text-base max-w-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Merci pour votre message. Nous vous répondrons dans les 48h ouvrées.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
                      <input
                        required
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Société</label>
                      <input
                        value={form.company}
                        onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                        className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Téléphone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                        style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Produit concerné</label>
                    <input
                      value={form.productInterest}
                      onChange={e => setForm(p => ({ ...p, productInterest: e.target.value }))}
                      placeholder="Optionnel — précisez si vous avez un produit en tête"
                      className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Décrivez votre projet, vos besoins, les délais..."
                      className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors resize-none bg-[var(--card)]"
                      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="self-start px-10 py-4 rounded-sm text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: 'var(--orange)' }}
                  >
                    {sending ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {contactItems.length > 0 && (
                <div className="p-8 rounded-sm border border-[var(--border)] bg-[var(--card)]">
                  <h3 className="font-display font-bold text-lg mb-6" style={{ color: 'var(--foreground)' }}>
                    Informations
                  </h3>
                  <div className="flex flex-col gap-5">
                    {contactItems.map(({ Icon, text, href }) => (
                      <div key={text} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}>
                          <Icon size={15} style={{ color: 'var(--orange)' }} />
                        </div>
                        {href ? (
                          <a
                            href={href}
                            className="text-sm whitespace-pre-line transition-colors hover:text-[var(--orange)]"
                            style={{ color: 'var(--muted-foreground)' }}
                          >
                            {text}
                          </a>
                        ) : (
                          <p className="text-sm whitespace-pre-line" style={{ color: 'var(--muted-foreground)' }}>{text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  {s.company_phone && (
                    <a
                      href={`tel:${s.company_phone.replace(/\s/g, '')}`}
                      className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-sm text-sm font-medium text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--orange)' }}
                    >
                      <Phone size={15} />
                      Appeler maintenant
                    </a>
                  )}
                </div>
              )}

              {s.maps_url && (
                <div className="rounded-sm overflow-hidden border border-[var(--border)]" style={{ height: '240px' }}>
                  <iframe
                    src={s.maps_url}
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Localisation"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
    </>
  );
}
