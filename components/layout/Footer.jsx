import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { Leaf, Heart, Instagram, Facebook, Twitter } from 'lucide-react';

export default async function Footer() {
  const locale = await getLocale();
  const t      = await getTranslations('footer');

  return (
    <footer className="bg-dark-green dark:bg-gray-950 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand column */}
          <div className="md:col-span-5">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-5">
              <div className="bg-primary-500 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-green">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">
                Stock<span className="text-primary-400">Alerte</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="text-xl">🇩🇿</span>
              <span className="text-sm text-white/50 font-medium">Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
              <span className="text-sm text-white/50 font-medium">in Algeria</span>
            </div>
            <div className="flex gap-3 mt-6">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook,  label: 'Facebook' },
                { icon: Twitter,   label: 'Twitter' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 text-white/40">Plateforme</h3>
            <ul className="space-y-3">
              {[
                { href: `/${locale}/discover`, label: 'Offres du moment' },
                { href: `/${locale}/map`,      label: 'Carte des commerces' },
                { href: `/${locale}/auth/register`, label: 'Créer un compte' },
                { href: `/${locale}/auth/login`,    label: 'Se connecter' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 text-white/40">À propos</h3>
            <ul className="space-y-3">
              {[
                { href: `/${locale}/about`,   label: t('about') },
                { href: `/${locale}/contact`, label: t('contact') },
                { href: `/${locale}/privacy`, label: t('privacy') },
                { href: `/${locale}/terms`,   label: t('terms') },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 text-white/40">Impact</h3>
            <div className="space-y-4">
              {[
                { emoji: '🌿', value: '2.4T', label: 'CO₂ économisé' },
                { emoji: '🥗', value: '18K',  label: 'repas sauvés' },
                { emoji: '💚', value: '58',   label: 'wilayas' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <span className="text-lg">{stat.emoji}</span>
                  <div>
                    <div className="text-white font-bold text-sm">{stat.value}</div>
                    <div className="text-white/40 text-xs">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} StockAlerte. {t('rights')}.
          </p>
          <div className="flex gap-1">
            <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full font-medium">🌱 Anti-gaspillage</span>
            <span className="text-xs bg-white/10 text-white/50 px-3 py-1 rounded-full font-medium">🔒 Sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
