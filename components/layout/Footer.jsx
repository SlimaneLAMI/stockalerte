import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
  const t      = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-primary-500 text-white px-2 py-1 rounded-lg text-sm font-extrabold">SA</span>
              <span className="text-white font-bold text-lg">StockAlerte</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">{t('tagline')}</p>
            <div className="flex gap-3 mt-4">
              <span className="text-2xl">🇩🇿</span>
              <span className="text-sm text-gray-500 self-center">Made in Algeria</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Plateforme</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/discover`} className="hover:text-white transition-colors">Offres</Link></li>
              <li><Link href={`/${locale}/map`} className="hover:text-white transition-colors">Carte</Link></li>
              <li><Link href={`/${locale}/auth/register`} className="hover:text-white transition-colors">S'inscrire</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">Info</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-white transition-colors">{t('contact')}</Link></li>
              <li><Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href={`/${locale}/terms`} className="hover:text-white transition-colors">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} StockAlerte. {t('rights')}.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>🌿 Anti-gaspillage</span>
            <span>🛡️ Sécurisé</span>
            <span>📍 Algérie</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
