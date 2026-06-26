'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const STORAGE_KEY = 'cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function save(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, date: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {}}
          />

          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            <div
              className="max-w-4xl mx-auto rounded-sm shadow-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}
            >
              {/* Barre couleur principale */}
              <div className="h-1 w-full" style={{ backgroundColor: 'var(--orange)' }} />

              <div className="p-6 md:p-8">
                {/* En-tête */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--orange) 12%, transparent)' }}
                    >
                      <Cookie size={20} style={{ color: 'var(--orange)' }} />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base" style={{ color: 'var(--foreground)' }}>
                        Vos préférences en matière de cookies
                      </h2>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                        Conformément au RGPD et à la directive ePrivacy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                  Nous utilisons des cookies techniques <strong style={{ color: 'var(--foreground)' }}>strictement nécessaires</strong> au bon
                  fonctionnement du site (session, préférences d'affichage). Nous pouvons également afficher une carte
                  Google Maps qui peut déposer des cookies tiers soumis à votre consentement.{' '}
                  <Link href="/cookies" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: 'var(--orange)' }}>
                    En savoir plus
                  </Link>
                </p>

                {/* Détail dépliable */}
                <button
                  onClick={() => setExpanded(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium mb-4 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {expanded ? 'Masquer les détails' : 'Voir les cookies utilisés'}
                </button>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="rounded-sm p-4 mb-4 text-xs space-y-2"
                        style={{ backgroundColor: 'var(--secondary)', color: 'var(--muted-foreground)' }}
                      >
                        <div className="grid grid-cols-3 gap-2 font-medium pb-2 border-b" style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}>
                          <span>Cookie</span><span>Finalité</span><span>Durée</span>
                        </div>
                        {[
                          { name: 'session-token', purpose: 'Maintien de session', duration: 'Session' },
                          { name: 'csrf-token', purpose: 'Sécurité (anti-CSRF)', duration: 'Session' },
                          { name: 'theme', purpose: 'Préférence thème', duration: '1 an' },
                          { name: 'Google Maps*', purpose: 'Affichage de carte', duration: '13 mois' },
                        ].map(c => (
                          <div key={c.name} className="grid grid-cols-3 gap-2">
                            <span className="font-mono truncate">{c.name}</span>
                            <span>{c.purpose}</span>
                            <span>{c.duration}</span>
                          </div>
                        ))}
                        <p className="pt-1 text-xs italic">* Cookie tiers soumis à consentement.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => save('accepted')}
                    className="flex-1 sm:flex-none sm:min-w-[180px] py-3 px-6 rounded-sm text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: 'var(--orange)' }}
                  >
                    Tout accepter
                  </button>
                  <button
                    onClick={() => save('refused')}
                    className="flex-1 sm:flex-none sm:min-w-[180px] py-3 px-6 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)] active:scale-95"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Tout refuser
                  </button>
                  <button
                    onClick={() => save('essential')}
                    className="flex-1 sm:flex-none text-xs underline underline-offset-2 py-3 px-3 transition-opacity hover:opacity-60"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Cookies essentiels uniquement
                  </button>
                </div>

                {/* Note légale */}
                <div className="flex items-start gap-2 mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                  <Shield size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--orange)' }} />
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Votre choix est conservé pendant 13 mois. Vous pouvez le modifier à tout moment depuis notre{' '}
                    <Link href="/cookies" className="underline underline-offset-2 hover:opacity-80" style={{ color: 'var(--orange)' }}>
                      politique de cookies
                    </Link>.
                    Vos données ne sont jamais vendues à des tiers.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
