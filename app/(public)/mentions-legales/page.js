'use client';
import { useSettings } from '@/components/SettingsContext';
import Breadcrumbs from '@/components/public/Breadcrumbs';

export default function MentionsLegalesPage() {
  const s = useSettings();
  const company = s.company_name || 'StockAlerte';
  const address = s.company_address || 'Adresse non renseignée';
  const email = s.company_email || 'contact@stockalerte.com';
  const phone = s.company_phone || '';

  return (
    <div className="pt-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-16">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Mentions légales' }]} />

        <h1 className="font-display font-bold text-4xl md:text-5xl mb-12" style={{ color: 'var(--foreground)' }}>
          Mentions légales
        </h1>

        <div className="prose-legal space-y-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              1. Éditeur du site
            </h2>
            <p>
              Le site <strong style={{ color: 'var(--foreground)' }}>stockalerte.onrender.com</strong> est édité par la société{' '}
              <strong style={{ color: 'var(--foreground)' }}>{company}</strong>, spécialiste en équipements de cuisine professionnelle.
            </p>
            <ul className="mt-3 space-y-1 list-none">
              <li><strong style={{ color: 'var(--foreground)' }}>Siège social :</strong> {address}</li>
              {phone && <li><strong style={{ color: 'var(--foreground)' }}>Téléphone :</strong> {phone}</li>}
              <li><strong style={{ color: 'var(--foreground)' }}>Email :</strong> {email}</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              2. Directeur de la publication
            </h2>
            <p>
              Le directeur de la publication est le représentant légal de la société {company}.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              3. Hébergement
            </h2>
            <p>
              Le site est hébergé par la société <strong style={{ color: 'var(--foreground)' }}>Render Services, Inc.</strong>,
              dont le siège social est situé à 525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis.
            </p>
            <p className="mt-2">
              Site : <a href="https://render.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>https://render.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              4. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des éléments constituant le site (textes, graphismes, logiciels, photographies, images, sons, plans, noms, logos, marques, etc.)
              sont la propriété exclusive de {company} ou de ses partenaires. Toute reproduction, représentation, diffusion ou redistribution,
              totale ou partielle, du contenu de ce site, par quelque procédé que ce soit, sans l'autorisation expresse et préalable de {company},
              est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              5. Données personnelles
            </h2>
            <p>
              Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, et au Règlement Général
              sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition
              concernant vos données personnelles.
            </p>
            <p className="mt-2">
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante :{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              6. Cookies
            </h2>
            <p>
              Le site peut utiliser des cookies techniques nécessaires à son bon fonctionnement. Ces cookies ne collectent aucune donnée
              personnelle à des fins commerciales. En naviguant sur ce site, vous acceptez l'utilisation de ces cookies.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              7. Liens hypertextes
            </h2>
            <p>
              Le site peut contenir des liens vers des sites tiers. {company} ne peut être tenu responsable du contenu
              de ces sites ni des éventuels préjudices résultant de leur utilisation.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              8. Droit applicable
            </h2>
            <p>
              Le présent site et ses mentions légales sont soumis au droit algérien. En cas de litige, les tribunaux compétents
              seront ceux du ressort du siège social de {company}.
            </p>
          </section>

          <p className="text-xs pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            Dernière mise à jour : juin 2026
          </p>
        </div>
      </div>
    </div>
  );
}
