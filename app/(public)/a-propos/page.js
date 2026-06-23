'use client';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { useSettings } from '@/components/SettingsContext';

export default function AProposPage() {
  const s = useSettings();

  const subtitle = s.about_subtitle || 'Notre histoire';
  const title = s.about_title || ('À propos de ' + (s.company_name || 'StockAlerte'));
  const paragraphs = s.about_paragraphs?.filter(Boolean).length
    ? s.about_paragraphs.filter(Boolean)
    : [
        'Spécialiste des équipements de cuisine professionnelle, nous accompagnons restaurants, hôtels, traiteurs et collectivités dans le choix et la mise en place de leur matériel.',
        'Notre équipe de techniciens certifiés vous guide à chaque étape : conseil, livraison, installation sur site et formation de vos équipes.',
        'Partenaires officiels des plus grandes marques, nous sélectionnons uniquement des équipements éprouvés en milieu professionnel, conformes aux normes en vigueur.',
      ];

  const stats = s.about_stats?.filter(st => st.value || st.label).length
    ? s.about_stats.filter(st => st.value || st.label)
    : [];

  return (
    <div className="pt-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 pb-24">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'À propos' }]} />

        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--orange)' }}>
            {subtitle}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-8" style={{ color: 'var(--foreground)' }}>
            {title}
          </h1>

          <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {stats.length > 0 && (
            <div className={`grid gap-8 mt-14`} style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}>
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-display font-bold text-4xl" style={{ color: 'var(--orange)' }}>{stat.value}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
