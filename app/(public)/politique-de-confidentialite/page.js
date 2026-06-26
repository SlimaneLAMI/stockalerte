'use client';
import { useSettings } from '@/components/SettingsContext';
import Breadcrumbs from '@/components/public/Breadcrumbs';

export default function PolitiqueConfidentialitePage() {
  const s = useSettings();
  const company = s.company_name || 'StockAlerte';
  const email = s.company_email || 'contact@stockalerte.com';
  const address = s.company_address || 'Adresse non renseignée';

  const H2 = ({ children }) => (
    <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>{children}</h2>
  );
  const Strong = ({ children }) => (
    <strong style={{ color: 'var(--foreground)' }}>{children}</strong>
  );

  return (
    <div className="pt-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-16">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Politique de confidentialité' }]} />

        <h1 className="font-display font-bold text-4xl md:text-5xl mb-12" style={{ color: 'var(--foreground)' }}>
          Politique de confidentialité
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>

          <section>
            <H2>1. Introduction</H2>
            <p>
              La société <Strong>{company}</Strong> (ci-après « nous ») attache une grande importance à la protection
              de votre vie privée. La présente politique de confidentialité décrit comment nous collectons, utilisons,
              conservons et protégeons vos données personnelles, conformément au{' '}
              <Strong>Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679)</Strong> et à
              la <Strong>loi n° 78-17 du 6 janvier 1978 modifiée</Strong> relative à l'informatique, aux fichiers et
              aux libertés (loi Informatique et Libertés).
            </p>
          </section>

          <section>
            <H2>2. Responsable du traitement</H2>
            <ul className="space-y-1.5 list-none">
              <li><Strong>Société :</Strong> {company}</li>
              <li><Strong>Adresse :</Strong> {address}</li>
              <li><Strong>Email :</Strong>{' '}
                <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>
              </li>
            </ul>
            <p className="mt-3">
              Pour toute question relative à la protection de vos données, vous pouvez contacter notre correspondant
              à l'adresse ci-dessus.
            </p>
          </section>

          <section>
            <H2>3. Données collectées</H2>
            <p>Dans le cadre de l'utilisation de notre site et de nos services, nous collectons les données suivantes :</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><Strong>Données d'identification :</Strong> nom, prénom, raison sociale.</li>
              <li><Strong>Données de contact :</Strong> adresse email, numéro de téléphone, adresse postale.</li>
              <li><Strong>Données professionnelles :</Strong> fonction, secteur d'activité (dans le cadre de devis B2B).</li>
              <li><Strong>Données de navigation :</Strong> adresse IP, type et version du navigateur, pages consultées,
                date et heure de connexion (via cookies techniques — voir notre{' '}
                <a href="/cookies" style={{ color: 'var(--orange)' }}>Politique de cookies</a>).</li>
              <li><Strong>Données de communication :</Strong> contenu des messages envoyés via le formulaire de contact.</li>
            </ul>
            <p className="mt-3">
              Nous ne collectons aucune donnée sensible au sens de l'article 9 du RGPD
              (données de santé, origines raciales ou ethniques, convictions religieuses, etc.).
            </p>
          </section>

          <section>
            <H2>4. Finalités et bases légales du traitement</H2>
            <div className="mt-2 space-y-3">
              <div>
                <p><Strong>Répondre à vos demandes de contact et de devis</Strong></p>
                <p className="mt-1 ml-4">Base légale : exécution de mesures précontractuelles (art. 6.1.b RGPD).</p>
              </div>
              <div>
                <p><Strong>Gérer la relation commerciale et le suivi des commandes</Strong></p>
                <p className="mt-1 ml-4">Base légale : exécution du contrat (art. 6.1.b RGPD).</p>
              </div>
              <div>
                <p><Strong>Respecter nos obligations légales et réglementaires</Strong></p>
                <p className="mt-1 ml-4">Base légale : obligation légale (art. 6.1.c RGPD).</p>
              </div>
              <div>
                <p><Strong>Améliorer nos services et l'expérience utilisateur</Strong></p>
                <p className="mt-1 ml-4">Base légale : intérêt légitime (art. 6.1.f RGPD).</p>
              </div>
              <div>
                <p><Strong>Communications commerciales (si vous y avez consenti)</Strong></p>
                <p className="mt-1 ml-4">Base légale : consentement (art. 6.1.a RGPD) — vous pouvez retirer votre
                  consentement à tout moment.</p>
              </div>
            </div>
          </section>

          <section>
            <H2>5. Durée de conservation</H2>
            <ul className="space-y-2 list-disc list-inside">
              <li><Strong>Données clients actifs :</Strong> durée de la relation commerciale, puis 5 ans à compter de la fin de celle-ci (prescription légale).</li>
              <li><Strong>Données prospects (formulaire de contact) :</Strong> 3 ans à compter du dernier contact.</li>
              <li><Strong>Données de facturation :</Strong> 10 ans conformément aux obligations comptables (art. L.123-22 du Code de commerce).</li>
              <li><Strong>Données de navigation :</Strong> 13 mois maximum à compter du dépôt du cookie (recommandation CNIL).</li>
              <li><Strong>Données des formulaires de contact :</Strong> 3 ans à compter de la clôture du dossier.</li>
            </ul>
          </section>

          <section>
            <H2>6. Destinataires des données</H2>
            <p>
              Vos données personnelles sont destinées exclusivement aux personnes habilitées de{' '}
              <Strong>{company}</Strong>. Elles peuvent être transmises aux catégories de sous-traitants suivants,
              dans le strict cadre de leurs missions et sous contrat garantissant la confidentialité :
            </p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside">
              <li>Prestataire d'hébergement et d'infrastructure (Render Services, Inc.) ;</li>
              <li>Prestataire de service d'email transactionnel ;</li>
              <li>Prestataire de solution de gestion client (CRM), le cas échéant.</li>
            </ul>
            <p className="mt-2">
              <Strong>{company}</Strong> ne vend, ne loue et ne cède jamais vos données personnelles à des tiers
              à des fins commerciales.
            </p>
          </section>

          <section>
            <H2>7. Transferts hors Union européenne</H2>
            <p>
              Certaines données peuvent être traitées hors de l'Union européenne, notamment via notre hébergeur
              Render Services, Inc. (États-Unis). Ce transfert est encadré par les garanties appropriées prévues
              au Chapitre V du RGPD (notamment le cadre EU-US Data Privacy Framework ou des clauses contractuelles
              types approuvées par la Commission européenne).
            </p>
          </section>

          <section>
            <H2>8. Sécurité des données</H2>
            <p>
              <Strong>{company}</Strong> met en œuvre des mesures techniques et organisationnelles appropriées
              pour protéger vos données contre tout accès non autorisé, divulgation, altération ou destruction,
              conformément à l'article 32 du RGPD. Le site utilise le protocole <Strong>HTTPS</Strong> (chiffrement
              TLS) pour sécuriser l'ensemble des échanges de données.
            </p>
          </section>

          <section>
            <H2>9. Vos droits</H2>
            <p>
              Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants sur vos données personnelles :
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><Strong>Droit d'accès (art. 15) :</Strong> obtenir la confirmation que vos données sont traitées et en recevoir une copie.</li>
              <li><Strong>Droit de rectification (art. 16) :</Strong> faire corriger des données inexactes ou incomplètes.</li>
              <li><Strong>Droit à l'effacement (art. 17) :</Strong> demander la suppression de vos données (« droit à l'oubli »).</li>
              <li><Strong>Droit à la limitation (art. 18) :</Strong> demander la suspension temporaire du traitement.</li>
              <li><Strong>Droit à la portabilité (art. 20) :</Strong> recevoir vos données dans un format structuré et lisible par machine.</li>
              <li><Strong>Droit d'opposition (art. 21) :</Strong> vous opposer au traitement de vos données, notamment à des fins de prospection commerciale.</li>
              <li><Strong>Droit de retrait du consentement :</Strong> retirer à tout moment un consentement précédemment donné, sans que ce retrait affecte la licéité du traitement antérieur.</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits, adressez votre demande écrite à :{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>.
              Nous nous engageons à répondre dans un délai maximum d'<Strong>un mois</Strong> à compter de la réception
              de votre demande (délai pouvant être porté à 3 mois en cas de complexité ou de volume).
            </p>
            <p className="mt-2">
              Si vous estimez que le traitement de vos données porte atteinte à vos droits, vous pouvez introduire
              une réclamation auprès de la <Strong>CNIL</Strong> (Commission Nationale de l'Informatique et des Libertés) :{' '}
              <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>
                https://www.cnil.fr/fr/plaintes
              </a>.
            </p>
          </section>

          <section>
            <H2>10. Cookies</H2>
            <p>
              Notre site utilise des cookies. Pour en savoir plus sur les cookies que nous utilisons, leur finalité
              et la façon de les gérer, consultez notre{' '}
              <a href="/cookies" style={{ color: 'var(--orange)' }}>Politique de cookies</a>.
            </p>
          </section>

          <section>
            <H2>11. Modifications de la politique</H2>
            <p>
              <Strong>{company}</Strong> se réserve le droit de modifier la présente politique de confidentialité
              à tout moment, notamment pour se conformer à toute évolution légale, réglementaire, jurisprudentielle
              ou technologique. La date de dernière mise à jour figurant en bas de cette page sera actualisée.
              Nous vous encourageons à consulter régulièrement cette page.
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
