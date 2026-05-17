import Breadcrumbs from '@/components/public/Breadcrumbs';

export const metadata = {
  title: 'À propos',
  description: 'Découvrez StockAlerte, spécialiste des équipements de cuisine professionnelle depuis 2005.',
};

export default function AProposPage() {
  return (
    <div className="pt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 pb-24">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'À propos' }]} />

        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
            Notre histoire
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-8" style={{ color: 'var(--foreground)' }}>
            À propos de StockAlerte
          </h1>

          <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            <p>
              Fondé en 2005 à Lyon, StockAlerte est un distributeur spécialisé en équipements de cuisine professionnelle,
              au service des restaurants, hôtels, traiteurs et collectivités de toute la région Auvergne-Rhône-Alpes.
            </p>
            <p>
              Notre équipe de techniciens certifiés vous accompagne à chaque étape : du conseil au choix des équipements,
              jusqu'à la livraison sur palette, l'installation sur site et la formation de vos équipes.
            </p>
            <p>
              Partenaires officiels des plus grandes marques — Rational, Hobart, Electrolux Professional, Fagor —
              nous sélectionnons uniquement des équipements éprouvés en milieu professionnel, conformes aux normes CE et NF Hygiène.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-14">
            {[
              { value: '2005', label: 'Fondation' },
              { value: '1 200+', label: 'Clients équipés' },
              { value: '48h', label: 'Délai SAV garanti' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-4xl" style={{ color: 'var(--orange)' }}>{value}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
