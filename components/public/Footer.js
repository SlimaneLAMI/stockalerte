'use client';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useSettings } from '@/components/SettingsContext';

const SOCIAL_ICONS = {
  social_facebook: {
    label: 'Facebook',
    svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  social_instagram: {
    label: 'Instagram',
    svg: <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>,
  },
  social_linkedin: {
    label: 'LinkedIn',
    svg: <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </>,
  },
  social_twitter: {
    label: 'X',
    svg: <path d="M4 4l16 16M20 4 4 20" strokeLinecap="round" />,
  },
  social_youtube: {
    label: 'YouTube',
    svg: <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </>,
  },
  social_tiktok: {
    label: 'TikTok',
    svg: <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />,
  },
  social_whatsapp: {
    label: 'WhatsApp',
    svg: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  },
  social_snapchat: {
    label: 'Snapchat',
    svg: <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.4 5.2L2 22l4.8-1.4A9.9 9.9 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z" />,
  },
  social_pinterest: {
    label: 'Pinterest',
    svg: <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.22 1.23-5.22s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.51-.25 1.05.52 1.9 1.54 1.9 1.85 0 3.09-2.37 3.09-5.17 0-2.13-1.43-3.62-3.48-3.62-2.37 0-3.76 1.78-3.76 3.61 0 .72.27 1.48.62 1.9.07.08.08.15.06.23-.06.26-.21.84-.24.96-.04.15-.13.19-.3.11-1.12-.52-1.82-2.17-1.82-3.49 0-2.84 2.06-5.45 5.94-5.45 3.12 0 5.55 2.22 5.55 5.19 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.77-.47-2.06-1.03l-.56 2.1c-.2.78-.75 1.76-1.12 2.36.85.26 1.74.4 2.67.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" />,
  },
};

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
            {Object.keys(SOCIAL_ICONS).some(k => s[k]) && (
              <div className="flex flex-wrap gap-2.5 mt-6">
                {Object.entries(SOCIAL_ICONS).map(([key, { label, svg }]) =>
                  s[key] ? (
                    <a
                      key={key}
                      href={s[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:border-[var(--orange)]"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {svg}
                      </svg>
                    </a>
                  ) : null
                )}
              </div>
            )}
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

        {/* Developer signature */}
        <div className="mt-5 flex justify-center">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
            developed by{' '}
            <a
              href="mailto:slimanelami@proton.me"
              className="font-bold hover:opacity-80 transition-opacity duration-200"
              style={{ color: 'var(--foreground)' }}
            >
              SL
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
