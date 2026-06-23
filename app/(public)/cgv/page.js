'use client';
import { useSettings } from '@/components/SettingsContext';
import Breadcrumbs from '@/components/public/Breadcrumbs';

export default function CGVPage() {
  const s = useSettings();
  const company = s.company_name || 'StockAlerte';
  const address = s.company_address || 'Adresse non renseignée';
  const email = s.company_email || 'contact@stockalerte.com';

  return (
    <div className="pt-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-16">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'CGV' }]} />

        <h1 className="font-display font-bold text-4xl md:text-5xl mb-12" style={{ color: 'var(--foreground)' }}>
          Conditions Générales de Vente
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              1. Objet et champ d'application
            </h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre la société{' '}
              <strong style={{ color: 'var(--foreground)' }}>{company}</strong>, ci-après dénommée « le Vendeur »,
              et tout professionnel ou particulier souhaitant procéder à l'achat d'équipements de cuisine professionnelle,
              ci-après dénommé « l'Acheteur ».
            </p>
            <p className="mt-2">
              Toute commande passée auprès de {company} implique l'acceptation sans réserve des présentes CGV.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              2. Produits
            </h2>
            <p>
              Les produits proposés à la vente sont des équipements de cuisine professionnelle (matériel de cuisson, réfrigération,
              préparation, laverie, etc.). Les caractéristiques essentielles de chaque produit sont présentées sur le site.
            </p>
            <p className="mt-2">
              {company} se réserve le droit de modifier à tout moment la gamme de produits disponibles,
              sans préavis et sans que cela ouvre droit à indemnité.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              3. Prix
            </h2>
            <p>
              Les prix indiqués sur le site sont exprimés en dinars algériens (DZD) hors taxes (HT), sauf mention contraire.
              Ils ne comprennent pas les frais de livraison et d'installation, qui sont précisés lors de l'établissement du devis.
            </p>
            <p className="mt-2">
              {company} se réserve le droit de modifier ses tarifs à tout moment. Les produits seront facturés
              sur la base des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              4. Commandes et devis
            </h2>
            <p>
              Toute commande fait l'objet d'un devis préalable établi par {company}. La commande est définitive
              après signature du devis par l'Acheteur et versement d'un acompte de <strong style={{ color: 'var(--foreground)' }}>30 %</strong> du montant total,
              sauf accord contraire écrit.
            </p>
            <p className="mt-2">
              {company} se réserve le droit de refuser toute commande pour des motifs légitimes.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              5. Paiement
            </h2>
            <p>
              Le règlement s'effectue selon les modalités définies dans le devis (virement bancaire, chèque, espèces selon la réglementation en vigueur).
              Le solde est dû à la livraison ou à la mise en service du matériel, sauf conditions particulières négociées.
            </p>
            <p className="mt-2">
              Tout retard de paiement entraîne l'application de pénalités de retard calculées au taux légal en vigueur,
              ainsi qu'une indemnité forfaitaire pour frais de recouvrement.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              6. Livraison et installation
            </h2>
            <p>
              Les délais de livraison sont donnés à titre indicatif. {company} s'engage à tout mettre en œuvre
              pour les respecter, sans que tout retard ne puisse ouvrir droit à annulation de commande ou indemnisation,
              sauf accord écrit préalable.
            </p>
            <p className="mt-2">
              La livraison s'effectue à l'adresse indiquée lors de la commande. Les frais de transport sont à la charge
              de l'Acheteur sauf mention contraire dans le devis. L'installation est proposée en option et fait l'objet
              d'une facturation séparée.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              7. Réception et vérification
            </h2>
            <p>
              À la réception du matériel, l'Acheteur est tenu de vérifier l'état et la conformité des produits livrés.
              Toute réserve relative à l'état du matériel doit être formulée par écrit sur le bon de livraison
              et confirmée par lettre recommandée dans les <strong style={{ color: 'var(--foreground)' }}>48 heures</strong> suivant la livraison.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              8. Garantie
            </h2>
            <p>
              Tous les équipements vendus bénéficient de la garantie constructeur, dont la durée varie selon les marques et les produits
              (généralement 12 à 24 mois pièces et main-d'œuvre). {company} assure le suivi SAV
              et peut proposer des contrats de maintenance.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              9. Responsabilité
            </h2>
            <p>
              {company} ne saurait être tenu responsable des dommages résultant d'une mauvaise utilisation des équipements,
              d'une installation non conforme aux préconisations du fabricant, ou de toute cause extérieure.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              10. Droit de rétractation
            </h2>
            <p>
              Conformément à la réglementation en vigueur, les ventes conclues entre professionnels ne sont pas soumises
              au droit de rétractation. Pour les particuliers, un délai de rétractation de 14 jours s'applique
              pour les commandes passées à distance, sauf pour les équipements personnalisés ou commandés sur mesure.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              11. Droit applicable et litiges
            </h2>
            <p>
              Les présentes CGV sont soumises au droit algérien. En cas de litige, les parties s'engagent à rechercher
              une solution amiable. À défaut, le tribunal compétent sera celui du siège social de {company}.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              12. Contact
            </h2>
            <p>
              Pour toute question relative à ces CGV, vous pouvez nous contacter à :{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>
            </p>
            <p className="mt-1">{address}</p>
          </section>

          <p className="text-xs pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            Dernière mise à jour : juin 2026
          </p>
        </div>
      </div>
    </div>
  );
}
