'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Leaf, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  const locale = useLocale();
  const t      = useTranslations('footer');

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
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 text-white/40">{t('col_platform')}</h3>
            <ul className="space-y-3">
              {[
                { href: `/${locale}/discover`,      label: t('link_discover') },
                { href: `/${locale}/map`,           label: t('link_map') },
                { href: `/${locale}/auth/register`, label: t('link_register') },
                { href: `/${locale}/auth/login`,    label: t('link_login') },
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
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 text-white/40">{t('col_about')}</h3>
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
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-5 text-white/40">{t('col_impact')}</h3>
            <div className="space-y-4">
              {[
                { emoji: '🌿', value: '2.4T', labelKey: 'impact_co2' },
                { emoji: '🥗', value: '18K',  labelKey: 'impact_meals' },
                { emoji: '💚', value: '58',   labelKey: 'impact_wilayas' },
              ].map((stat) => (
                <div key={stat.labelKey} className="flex items-center gap-2.5">
                  <span className="text-lg">{stat.emoji}</span>
                  <div>
                    <div className="text-white font-bold text-sm" dir="ltr">{stat.value}</div>
                    <div className="text-white/40 text-xs">{t(stat.labelKey)}</div>
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
            <span className="text-xs bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full font-medium">🌱 {t('badge_anti_waste')}</span>
            <span className="text-xs bg-white/10 text-white/50 px-3 py-1 rounded-full font-medium">🔒 {t('badge_secure')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
