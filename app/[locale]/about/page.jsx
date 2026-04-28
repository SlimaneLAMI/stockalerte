import PublicLayout from '@/components/layout/PublicLayout';
import Link from 'next/link';

export default function AboutPage({ params: { locale } }) {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 rounded-full px-4 py-1.5 mb-4 text-sm text-primary-600">
            🌿 Notre mission
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">À propos de StockAlerte</h1>
          <p className="text-xl text-gray-500">La plateforme anti-gaspillage du marché algérien</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-4">Notre vision 🎯</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              StockAlerte est née d'une conviction simple : chaque produit non vendu est un gâchis — pour le commerçant, pour le consommateur, et pour la planète.
              Nous connectons les commerçants algériens avec leurs clients locaux pour que chaque offre, promotion ou produit à date courte trouve preneur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🏪', title: 'Pour les commerçants', desc: 'Publiez vos offres, liquidez vos stocks, fidélisez vos clients locaux.' },
              { icon: '🛍️', title: 'Pour les clients', desc: 'Trouvez les meilleures offres près de vous et économisez chaque jour.' },
              { icon: '🌱', title: 'Pour la planète', desc: 'Moins de gaspillage alimentaire, plus de consommation locale et responsable.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>

          <div className="card p-8 bg-gray-900 dark:bg-gray-950 text-white">
            <h2 className="text-2xl font-bold mb-4">🇩🇿 Fait en Algérie</h2>
            <p className="text-gray-400 leading-relaxed">
              StockAlerte est une initiative 100% algérienne, pensée pour les réalités du marché local.
              Nous comprenons les besoins des commerçants et des consommateurs algériens, et nous construisons
              une solution adaptée à notre contexte culturel et économique.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href={`/${locale}/auth/register`} className="btn-primary px-8 py-4 text-lg">
            Rejoindre StockAlerte →
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
