import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Share2, ExternalLink } from 'lucide-react';


export default function Footer() {
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
                PC
              </div>
              <span className="font-display font-bold text-xl" style={{ color: 'var(--foreground)' }}>
                StockAlerte
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--muted-foreground)' }}>
              Spécialiste des équipements de cuisine professionnelle depuis 2005. Matériel de qualité, livraison et SAV inclus.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:border-[var(--orange)]"
                style={{ borderColor: 'var(--border)' }}
              >
                <span className="text-xs font-bold" style={{ color: 'var(--muted-foreground)' }}>in</span>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:border-[var(--orange)]"
                style={{ borderColor: 'var(--border)' }}
              >
                <Share2 size={15} style={{ color: 'var(--muted-foreground)' }} />
              </a>
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
                { label: 'Demander un devis', href: '/contact' },
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
              <div className="flex items-start gap-3">
                <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--orange)' }} />
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  15 rue des Cuisiniers<br />69002 Lyon
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="shrink-0" style={{ color: 'var(--orange)' }} />
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>04 72 00 00 00</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={14} className="shrink-0" style={{ color: 'var(--orange)' }} />
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>contact@StockAlerte.fr</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={14} className="shrink-0" style={{ color: 'var(--orange)' }} />
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Lun–Ven 8h30–18h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            © {year} StockAlerte. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {['Mentions légales', 'CGV', 'Politique de confidentialité'].map(label => (
              <a
                key={label}
                href="#"
                className="text-xs transition-colors hover:text-[var(--orange)]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
