'use client';
import { useSettings } from '@/components/SettingsContext';
import Breadcrumbs from '@/components/public/Breadcrumbs';

export default function MentionsLegalesPage() {
  const s = useSettings();
  const company = s.company_name || 'StockAlerte';
  const address = s.company_address || 'Adresse non renseignée';
  const email = s.company_email || 'contact@stockalerte.com';
  const phone = s.company_phone || '';

  const H2 = ({ children }) => (
    <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>{children}</h2>
  );
  const Strong = ({ children }) => (
    <strong style={{ color: 'var(--foreground)' }}>{children}</strong>
  );

  return (
    <div className="pt-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-16">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Mentions légales' }]} />

        <h1 className="font-display font-bold text-4xl md:text-5xl mb-12" style={{ color: 'var(--foreground)' }}>
          Mentions légales
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>

          <section>
            <H2>1. Éditeur du site</H2>
            <p>
              Le site internet est édité par la société <Strong>{company}</Strong>,
              spécialiste en équipements de cuisine professionnelle.
            </p>
            <ul className="mt-3 space-y-1.5 list-none">
              <li><Strong>Forme juridique :</Strong> [À compléter — ex : SAS, SARL, EURL…]</li>
              <li><Strong>Capital social :</Strong> [À compléter]</li>
              <li><Strong>Siège social :</Strong> {address}</li>
              <li><Strong>SIRET :</Strong> [À compléter]</li>
              <li><Strong>RCS :</Strong> [À compléter — ex : RCS Paris XXX XXX XXX]</li>
              <li><Strong>N° TVA intracommunautaire :</Strong> [À compléter]</li>
              {phone && <li><Strong>Téléphone :</Strong> {phone}</li>}
              <li><Strong>Email :</Strong> <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a></li>
            </ul>
          </section>

          <section>
            <H2>2. Directeur de la publication</H2>
            <p>
              Le directeur de la publication est le représentant légal de la société <Strong>{company}</Strong>.
              Pour le contacter : <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>.
            </p>
          </section>

          <section>
            <H2>3. Hébergement</H2>
            <p>
              Le site est hébergé par la société <Strong>Render Services, Inc.</Strong>,
              525 Brannan Street, Suite 300, San Francisco, CA 94107, États-Unis.
            </p>
            <p className="mt-2">
              Site web : <a href="https://render.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>https://render.com</a>
            </p>
            <p className="mt-2">
              Les données des utilisateurs résidant dans l'Union européenne sont traitées conformément au RGPD.
              Render Services, Inc. est certifiée sous le cadre EU-US Data Privacy Framework.
            </p>
          </section>

          <section>
            <H2>4. Propriété intellectuelle</H2>
            <p>
              L'ensemble des éléments constituant ce site (textes, graphismes, logiciels, photographies, images, sons, plans,
              noms, logos, marques, créations et œuvres protégeables diverses) sont la propriété exclusive de{' '}
              <Strong>{company}</Strong> ou de ses partenaires et sont protégés par les lois françaises et internationales
              relatives à la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, diffusion ou redistribution, totale ou partielle, du contenu de ce site
              par quelque procédé que ce soit, sans l'autorisation expresse et préalable de <Strong>{company}</Strong>,
              est interdite et constituerait une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code
              de la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Les marques et logos figurant sur ce site sont des marques déposées. Toute reproduction ou utilisation
              sans autorisation préalable est strictement interdite.
            </p>
          </section>

          <section>
            <H2>5. Limitation de responsabilité</H2>
            <p>
              <Strong>{company}</Strong> s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées
              sur ce site. Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations
              mises à disposition sur ce site et se réserve le droit de corriger, à tout moment et sans préavis,
              le contenu de celui-ci.
            </p>
            <p className="mt-2">
              <Strong>{company}</Strong> décline toute responsabilité pour tout dommage résultant d'une intrusion
              frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition sur le site.
            </p>
          </section>

          <section>
            <H2>6. Liens hypertextes</H2>
            <p>
              Ce site peut contenir des liens vers des sites tiers. <Strong>{company}</Strong> ne maîtrise pas ces sites
              et ne peut être tenu responsable de leur contenu, de leur politique de confidentialité ou de toute autre
              pratique de ces sites. La mise en place d'un lien vers ce site nécessite l'autorisation préalable et écrite
              de <Strong>{company}</Strong>.
            </p>
          </section>

          <section>
            <H2>7. Données personnelles et cookies</H2>
            <p>
              Le traitement des données personnelles des utilisateurs est régi par notre{' '}
              <a href="/politique-de-confidentialite" style={{ color: 'var(--orange)' }}>Politique de confidentialité</a>{' '}
              et notre <a href="/cookies" style={{ color: 'var(--orange)' }}>Politique de cookies</a>,
              conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679)
              et à la loi n° 78-17 du 6 janvier 1978 modifiée relative à l'informatique, aux fichiers et aux libertés.
            </p>
          </section>

          <section>
            <H2>8. Droit applicable et juridiction compétente</H2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige relatif à l'interprétation
              ou à l'exécution de celles-ci, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section>
            <H2>9. Médiation</H2>
            <p>
              Conformément aux articles L.611-1 et suivants du Code de la consommation, tout consommateur a le droit
              de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d'un litige
              l'opposant à un professionnel. Pour tout litige non résolu, vous pouvez saisir la plateforme de règlement
              en ligne des litiges mise en place par la Commission européenne :{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>
                https://ec.europa.eu/consumers/odr
              </a>.
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
