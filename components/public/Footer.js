'use client';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '@/components/SettingsContext';

export default function Footer() {
  const s = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-24 border-t"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center font-display font-bold text-sm text-white"
                style={{ backgroundColor: 'var(--orange)' }}
              >
                {s.company_name ? s.company_name.slice(0, 2).toUpperCase() : 'PC'}
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--foreground)' }}>
                {s.company_name || 'StockAlerte'}
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--muted-foreground)' }}>
              {s.company_description || 'Spécialiste des équipements de cuisine professionnelle depuis 2005. Matériel de qualité, livraison et SAV inclus.'}
            </p>
            <div className="flex gap-3 mt-6">
              {s.social_linkedin && (
                <a
                  href={s.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:border-[var(--orange)]"
                  style={{ borderColor: 'var(--border)' }}
                  aria-label="LinkedIn"
                >
                  <span className="text-xs font-bold" style={{ color: 'var(--muted-foreground)' }}>in</span>
                </a>
              )}
              {s.social_instagram && (
                <a
                  href={s.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:border-[var(--orange)]"
                  style={{ borderColor: 'var(--border)' }}
                  aria-label="Instagram"
                >
                  <span className="text-xs font-bold" style={{ color: 'var(--muted-foreground)' }}>ig</span>
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-display font-bold text-sm mb-5 tracking-wide uppercase" style={{ color: 'var(--foreground)' }}>
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {[
                { label: 'Catalogue', href: '/catalogue' },
                { label: 'À propos', href: '/a-propos' },
                { label: 'Contact', href: '/contact' },
                { label: 'Nous contacter', href: '/contact' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm transition-colors hover:text-[var(--orange)]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display font-bold text-sm mb-5 tracking-wide uppercase" style={{ color: 'var(--foreground)' }}>
              Contact
            </p>
            <div className="flex flex-col gap-3">
              {s.company_address && (
                <div className="flex items-start gap-3">
                  <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--orange)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.company_address}</span>
                </div>
              )}
              {s.company_phone && (
                <div className="flex items-center gap-3">
                  <Phone size={14} className="shrink-0" style={{ color: 'var(--orange)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.company_phone}</span>
                </div>
              )}
              {s.company_email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="shrink-0" style={{ color: 'var(--orange)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.company_email}</span>
                </div>
              )}
              {s.company_hours && (
                <div className="flex items-center gap-3">
                  <Clock size={14} className="shrink-0" style={{ color: 'var(--orange)' }} />
                  <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{s.company_hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {s.footer_text || `© ${year} ${s.company_name || 'StockAlerte'}. Tous droits réservés.`}
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Mentions légales', href: '/mentions-legales' },
              { label: 'CGV', href: '/cgv' },
              { label: 'Politique de confidentialité', href: '/politique-de-confidentialite' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs transition-colors hover:text-[var(--orange)]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
