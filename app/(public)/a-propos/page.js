'use client';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { useSettings } from '@/components/SettingsContext';

function renderBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--foreground)' }}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default function AProposPage() {
  const s = useSettings();

  const subtitle = s.about_subtitle || 'Notre histoire';
  const title = s.about_title || ('À propos de ' + (s.company_name || 'StockAlerte'));
  const rawParagraphs = s.about_paragraphs?.length ? s.about_paragraphs : [
    { title: '', content: 'Spécialiste des équipements de cuisine professionnelle, nous accompagnons restaurants, hôtels, traiteurs et collectivités dans le choix et la mise en place de leur matériel.' },
    { title: '', content: 'Notre équipe de techniciens certifiés vous guide à chaque étape : conseil, livraison, installation sur site et formation de vos équipes.' },
    { title: '', content: 'Partenaires officiels des plus grandes marques, nous sélectionnons uniquement des équipements éprouvés en milieu professionnel, conformes aux normes en vigueur.' },
  ];
  const paragraphs = rawParagraphs
    .map(p => typeof p === 'string' ? { title: '', content: p } : p)
    .filter(p => p.content);

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

          <div className="space-y-8 text-base leading-relaxed">
            {paragraphs.map((p, i) => (
              <div key={i}>
                {p.title && (
                  <h2 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>{p.title}</h2>
                )}
                <p style={{ color: 'var(--muted-foreground)' }}>
                  {p.content.split('\n').map((line, li, arr) => (
                    <span key={li}>{renderBold(line)}{li < arr.length - 1 && <br />}</span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          {stats.length > 0 && (
            <div className="flex flex-wrap gap-8 mt-14">
              {stats.map((stat, i) => (
                <div key={i} className="min-w-[80px]">
                  <p className="font-display font-bold text-4xl whitespace-nowrap" style={{ color: 'var(--orange)' }}>{stat.value}</p>
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
