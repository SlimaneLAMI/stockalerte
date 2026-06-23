'use client';
import { useSettings } from '@/components/SettingsContext';
import Breadcrumbs from '@/components/public/Breadcrumbs';

export default function PolitiqueConfidentialitePage() {
  const s = useSettings();
  const company = s.company_name || 'StockAlerte';
  const email = s.company_email || 'contact@stockalerte.com';
  const address = s.company_address || 'Adresse non renseignée';

  return (
    <div className="pt-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-16">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Politique de confidentialité' }]} />

        <h1 className="font-display font-bold text-4xl md:text-5xl mb-12" style={{ color: 'var(--foreground)' }}>
          Politique de confidentialité
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              1. Introduction
            </h2>
            <p>
              La société <strong style={{ color: 'var(--foreground)' }}>{company}</strong> s'engage à protéger la vie privée
              des utilisateurs de son site. La présente politique de confidentialité décrit la nature des données personnelles
              collectées, leur utilisation, et les droits dont vous disposez à leur égard.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              2. Responsable du traitement
            </h2>
            <ul className="space-y-1">
              <li><strong style={{ color: 'var(--foreground)' }}>Société :</strong> {company}</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Adresse :</strong> {address}</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Email :</strong>{' '}
                <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              3. Données collectées
            </h2>
            <p>Dans le cadre de l'utilisation de notre site et de nos services, nous pouvons collecter les données suivantes :</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--foreground)' }}>Données d'identification :</strong> nom, prénom, raison sociale.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Données de contact :</strong> adresse email, numéro de téléphone, adresse postale.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Données de navigation :</strong> adresse IP, type de navigateur, pages consultées (via cookies techniques).</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Données de communication :</strong> contenu des messages envoyés via le formulaire de contact.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              4. Finalités du traitement
            </h2>
            <p>Les données collectées sont utilisées pour :</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Répondre à vos demandes de contact ou de devis.</li>
              <li>Gérer la relation commerciale et le suivi des commandes.</li>
              <li>Améliorer nos services et l'expérience utilisateur.</li>
              <li>Respecter nos obligations légales et réglementaires.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              5. Base légale du traitement
            </h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>L'exécution d'un contrat ou de mesures précontractuelles (devis, commandes).</li>
              <li>Notre intérêt légitime à améliorer nos services.</li>
              <li>Le respect de nos obligations légales.</li>
              <li>Votre consentement lorsque celui-ci est requis.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              6. Durée de conservation
            </h2>
            <p>
              Vos données sont conservées pendant la durée strictement nécessaire aux finalités pour lesquelles elles ont été collectées :
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--foreground)' }}>Données clients :</strong> 5 ans à compter de la fin de la relation commerciale.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Données de contact (prospects) :</strong> 3 ans à compter du dernier contact.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Données de navigation :</strong> 13 mois maximum.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              7. Partage des données
            </h2>
            <p>
              {company} ne vend ni ne loue vos données personnelles à des tiers. Vos données peuvent être partagées
              uniquement avec des prestataires techniques (hébergement, messagerie) dans le cadre strict de leurs missions
              et sous contrat garantissant la confidentialité.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              8. Sécurité
            </h2>
            <p>
              {company} met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
              contre tout accès non autorisé, divulgation, altération ou destruction. Le site utilise le protocole HTTPS
              pour sécuriser les échanges de données.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              9. Vos droits
            </h2>
            <p>Conformément à la réglementation applicable, vous disposez des droits suivants :</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong style={{ color: 'var(--foreground)' }}>Droit d'accès :</strong> obtenir une copie de vos données personnelles.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Droit de rectification :</strong> corriger des données inexactes ou incomplètes.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Droit à l'effacement :</strong> demander la suppression de vos données.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Droit d'opposition :</strong> vous opposer au traitement de vos données.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Droit à la portabilité :</strong> recevoir vos données dans un format structuré.</li>
              <li><strong style={{ color: 'var(--foreground)' }}>Droit à la limitation :</strong> demander la suspension temporaire du traitement.</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, contactez-nous à :{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>.
              Nous nous engageons à répondre dans un délai maximum d'un mois.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              10. Cookies
            </h2>
            <p>
              Notre site utilise uniquement des cookies techniques indispensables à son bon fonctionnement (session, préférences d'affichage).
              Aucun cookie publicitaire ou de profilage n'est déposé sans votre consentement préalable.
            </p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>
              11. Modifications
            </h2>
            <p>
              {company} se réserve le droit de modifier la présente politique de confidentialité à tout moment.
              Les utilisateurs seront informés de toute modification substantielle par une mention sur le site.
            </p>
          </section>

          <p className="text-xs pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            Dernière mise à jour : juin 2025
          </p>
        </div>
      </div>
    </div>
  );
}
