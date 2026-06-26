'use client';
import { useSettings } from '@/components/SettingsContext';
import Breadcrumbs from '@/components/public/Breadcrumbs';

export default function CGVPage() {
  const s = useSettings();
  const company = s.company_name || 'StockAlerte';
  const address = s.company_address || 'Adresse non renseignée';
  const email = s.company_email || 'contact@stockalerte.com';
  const phone = s.company_phone || '';
  const priceMode = s.price_mode === 'TTC' ? 'toutes taxes comprises (TTC)' : 'hors taxes (HT)';

  const H2 = ({ children }) => (
    <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>{children}</h2>
  );
  const Strong = ({ children }) => (
    <strong style={{ color: 'var(--foreground)' }}>{children}</strong>
  );

  return (
    <div className="pt-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-16">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'CGV' }]} />

        <h1 className="font-display font-bold text-4xl md:text-5xl mb-12" style={{ color: 'var(--foreground)' }}>
          Conditions Générales de Vente
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>

          <section>
            <H2>1. Objet et champ d'application</H2>
            <p>
              Les présentes Conditions Générales de Vente (ci-après « CGV ») régissent l'ensemble des relations
              contractuelles entre la société <Strong>{company}</Strong> (ci-après « le Vendeur ») et toute personne
              physique ou morale souhaitant acquérir des équipements de cuisine professionnelle (ci-après « l'Acheteur »).
            </p>
            <p className="mt-2">
              Toute commande passée auprès de <Strong>{company}</Strong> implique l'acceptation pleine et entière
              des présentes CGV, lesquelles prévalent sur tout autre document de l'Acheteur, sauf accord dérogatoire
              écrit et préalable du Vendeur. Ces CGV sont soumises au droit français et au droit de l'Union européenne.
            </p>
          </section>

          <section>
            <H2>2. Identification du vendeur</H2>
            <ul className="space-y-1.5 list-none">
              <li><Strong>Raison sociale :</Strong> {company}</li>
              <li><Strong>Siège social :</Strong> {address}</li>
              {phone && <li><Strong>Téléphone :</Strong> {phone}</li>}
              <li><Strong>Email :</Strong> <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a></li>
              <li><Strong>SIRET :</Strong> [À compléter]</li>
              <li><Strong>N° TVA intracommunautaire :</Strong> [À compléter]</li>
            </ul>
          </section>

          <section>
            <H2>3. Produits et services</H2>
            <p>
              Les produits proposés sont des équipements de cuisine professionnelle : matériel de cuisson, réfrigération,
              préparation alimentaire, laverie, mobilier inox, ventilation et accessoires. Les caractéristiques essentielles
              de chaque produit (dimensions, puissance, matériaux, normes) sont présentées sur les fiches produits du site.
            </p>
            <p className="mt-2">
              Les photographies et visuels sont fournis à titre indicatif. <Strong>{company}</Strong> se réserve le droit
              de modifier à tout moment sa gamme de produits sans préavis et sans que cela ouvre droit à indemnité.
            </p>
          </section>

          <section>
            <H2>4. Prix</H2>
            <p>
              Les prix indiqués sur le site sont exprimés en euros (€), {priceMode}, sauf mention contraire.
              Ils ne comprennent pas les frais de transport, de livraison et d'installation, qui sont précisés
              lors de l'établissement du devis.
            </p>
            <p className="mt-2">
              <Strong>{company}</Strong> se réserve le droit de modifier ses prix à tout moment. Les produits
              seront facturés sur la base des tarifs en vigueur au moment de la validation du devis par l'Acheteur.
              En cas d'erreur manifeste de prix sur le site (prix anormalement bas résultant d'une erreur technique),
              <Strong>{company}</Strong> se réserve le droit d'annuler la commande concernée.
            </p>
          </section>

          <section>
            <H2>5. Devis et commandes</H2>
            <p>
              Toute commande fait l'objet d'un devis préalable établi par <Strong>{company}</Strong>, valable
              <Strong> 30 jours</Strong> à compter de sa date d'émission sauf mention contraire. La commande est
              définitive après :
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside">
              <li>La signature (ou validation écrite) du devis par l'Acheteur ;</li>
              <li>Le versement d'un acompte de <Strong>30 %</Strong> du montant total TTC, sauf accord écrit contraire.</li>
            </ul>
            <p className="mt-2">
              <Strong>{company}</Strong> se réserve le droit de refuser toute commande pour des motifs légitimes
              (rupture de stock, non-conformité aux critères d'éligibilité, litige antérieur, etc.).
            </p>
          </section>

          <section>
            <H2>6. Paiement</H2>
            <p>
              Le règlement s'effectue selon les modalités définies dans le devis. Les modes de paiement acceptés sont :
              virement bancaire, chèque (à l'ordre de <Strong>{company}</Strong>), et tout autre moyen expressément
              mentionné sur le devis.
            </p>
            <p className="mt-2">
              Le solde est exigible à la livraison ou à la mise en service du matériel, sauf conditions particulières
              négociées et formalisées par écrit. En cas de retard de paiement, des pénalités de retard seront appliquées
              au taux légal en vigueur (art. L.441-10 du Code de commerce), ainsi qu'une indemnité forfaitaire pour frais
              de recouvrement de <Strong>40 €</Strong> conformément à l'article D.441-5 du Code de commerce.
            </p>
          </section>

          <section>
            <H2>7. Livraison et délais</H2>
            <p>
              Les délais de livraison sont indiqués à titre indicatif sur le devis. <Strong>{company}</Strong> s'engage
              à mettre tout en œuvre pour les respecter. Tout retard raisonnable ne saurait entraîner l'annulation de
              la commande ni ouvrir droit à indemnisation, sauf engagement écrit du Vendeur à respecter une date impérative.
            </p>
            <p className="mt-2">
              La livraison s'effectue à l'adresse indiquée lors de la commande, dans les zones géographiques desservies
              par <Strong>{company}</Strong>. Les frais de transport sont à la charge de l'Acheteur sauf mention
              contraire dans le devis.
            </p>
          </section>

          <section>
            <H2>8. Réception et vérification</H2>
            <p>
              À la réception du matériel, l'Acheteur est tenu de vérifier l'état, la quantité et la conformité des
              produits livrés. Toute anomalie (produit manquant, endommagé, non conforme) doit être :
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside">
              <li>Mentionnée sur le bon de livraison en présence du livreur ;</li>
              <li>Confirmée par écrit (lettre recommandée ou email avec accusé de réception) dans les <Strong>72 heures</Strong> suivant la réception.</li>
            </ul>
            <p className="mt-2">
              Passé ce délai, les produits sont considérés comme acceptés sans réserve.
            </p>
          </section>

          <section>
            <H2>9. Garanties</H2>
            <p>
              Tous les équipements bénéficient de la <Strong>garantie légale de conformité</Strong> (articles L.217-4 à
              L.217-14 du Code de la consommation) et de la <Strong>garantie contre les vices cachés</Strong> (articles
              1641 à 1649 du Code civil), en sus de la garantie commerciale constructeur dont la durée varie selon les
              marques et produits (généralement 12 à 24 mois pièces et main-d'œuvre).
            </p>
            <p className="mt-2">
              <Strong>{company}</Strong> assure le suivi SAV et peut proposer des contrats de maintenance. La garantie
              ne couvre pas les dommages résultant d'une utilisation anormale, d'un défaut d'entretien ou d'une
              installation non conforme aux préconisations du fabricant.
            </p>
          </section>

          <section>
            <H2>10. Droit de rétractation</H2>
            <p>
              Conformément à la directive européenne 2011/83/UE et aux articles L.221-18 et suivants du Code de la
              consommation, les <Strong>consommateurs</Strong> (personnes physiques agissant à titre non professionnel)
              disposent d'un délai de <Strong>14 jours calendaires</Strong> à compter de la réception du bien pour
              exercer leur droit de rétractation, sans avoir à justifier de motif ni à payer de pénalité.
            </p>
            <p className="mt-2">
              Ce droit ne s'applique pas pour les produits fabriqués sur mesure ou personnalisés selon les spécifications
              du client (art. L.221-28, 3° du Code de la consommation). Les ventes conclues de <Strong>professionnel
              à professionnel</Strong> (B2B) ne sont pas soumises au droit de rétractation.
            </p>
            <p className="mt-2">
              Pour exercer ce droit, l'Acheteur doit notifier sa décision par email à{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a> avant l'expiration du délai.
            </p>
          </section>

          <section>
            <H2>11. Responsabilité</H2>
            <p>
              La responsabilité de <Strong>{company}</Strong> ne saurait être engagée pour les dommages résultant
              d'une mauvaise utilisation des équipements, d'une installation non conforme aux normes ou aux préconisations
              du fabricant, d'une modification non autorisée du matériel, ou de tout événement de force majeure au sens
              de l'article 1218 du Code civil.
            </p>
          </section>

          <section>
            <H2>12. Protection des données personnelles</H2>
            <p>
              Les données personnelles collectées dans le cadre des commandes sont traitées conformément au Règlement
              Général sur la Protection des Données (RGPD — Règlement UE 2016/679). Pour en savoir plus, consultez
              notre <a href="/politique-de-confidentialite" style={{ color: 'var(--orange)' }}>Politique de confidentialité</a>.
            </p>
          </section>

          <section>
            <H2>13. Médiation des litiges</H2>
            <p>
              En cas de litige, l'Acheteur est invité à contacter en premier lieu le service client de{' '}
              <Strong>{company}</Strong> à l'adresse <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>.
            </p>
            <p className="mt-2">
              À défaut de résolution amiable, tout consommateur peut recourir gratuitement à un médiateur de la
              consommation conformément aux articles L.611-1 et suivants du Code de la consommation. La plateforme
              européenne de règlement en ligne des litiges est accessible à :{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>
                https://ec.europa.eu/consumers/odr
              </a>.
            </p>
            <p className="mt-2">
              Pour les litiges entre professionnels, les parties conviennent de rechercher une solution amiable avant
              tout recours judiciaire. À défaut, le tribunal compétent sera celui du siège social de{' '}
              <Strong>{company}</Strong>.
            </p>
          </section>

          <section>
            <H2>14. Droit applicable</H2>
            <p>
              Les présentes CGV sont soumises au droit français. Elles sont rédigées en langue française, qui
              fait foi en cas de litige.
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
