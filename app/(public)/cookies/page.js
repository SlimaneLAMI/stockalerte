'use client';
import { useState } from 'react';
import { useSettings } from '@/components/SettingsContext';
import Breadcrumbs from '@/components/public/Breadcrumbs';
import { RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'cookie-consent';

export default function CookiesPage() {
  const s = useSettings();
  const company = s.company_name || 'StockAlerte';
  const email = s.company_email || 'contact@stockalerte.com';
  const [reset, setReset] = useState(false);

  function handleReset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setReset(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.location.reload(), 300);
  }

  const H2 = ({ children }) => (
    <h2 className="font-display font-bold text-xl mb-4" style={{ color: 'var(--foreground)' }}>{children}</h2>
  );
  const Strong = ({ children }) => (
    <strong style={{ color: 'var(--foreground)' }}>{children}</strong>
  );

  return (
    <div className="pt-20">
      <div className="max-w-[860px] mx-auto px-6 lg:px-12 py-16">
        <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Politique de cookies' }]} />

        <h1 className="font-display font-bold text-4xl md:text-5xl mb-12" style={{ color: 'var(--foreground)' }}>
          Politique de cookies
        </h1>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>

          <section>
            <H2>1. Qu'est-ce qu'un cookie ?</H2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors
              de la visite d'un site internet. Il permet au site de mémoriser des informations sur votre visite,
              comme votre langue préférée et d'autres paramètres.
            </p>
            <p className="mt-2">
              Conformément à la directive européenne ePrivacy (2002/58/CE modifiée par la directive 2009/136/CE)
              et aux recommandations de la <Strong>CNIL</Strong>, certains cookies nécessitent votre consentement
              préalable, tandis que d'autres, strictement nécessaires au fonctionnement du site, en sont exemptés.
            </p>
          </section>

          <section>
            <H2>2. Cookies utilisés sur ce site</H2>

            <div className="mt-2 space-y-6">
              <div className="p-5 rounded-sm border border-[var(--border)] bg-[var(--card)]">
                <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Cookies strictement nécessaires — <span className="text-xs font-normal">Exemptés de consentement</span>
                </p>
                <p className="mb-3">
                  Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés
                  dans nos systèmes. Ils sont généralement déposés en réponse à des actions que vous effectuez
                  (connexion, remplissage de formulaires, paramètres de confidentialité).
                </p>
                <table className="w-full text-xs" style={{ color: 'var(--muted-foreground)' }}>
                  <thead>
                    <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--foreground)' }}>Nom</th>
                      <th className="text-left py-2 pr-4 font-medium" style={{ color: 'var(--foreground)' }}>Finalité</th>
                      <th className="text-left py-2 font-medium" style={{ color: 'var(--foreground)' }}>Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    <tr>
                      <td className="py-2 pr-4 font-mono">next-auth.session-token</td>
                      <td className="py-2 pr-4">Maintien de la session utilisateur</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono">__Host-next-auth.csrf-token</td>
                      <td className="py-2 pr-4">Protection contre les attaques CSRF</td>
                      <td className="py-2">Session</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-mono">theme</td>
                      <td className="py-2 pr-4">Mémorisation de la préférence de thème (clair/sombre)</td>
                      <td className="py-2">1 an</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-5 rounded-sm border border-[var(--border)] bg-[var(--card)]">
                <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Cookies de mesure d'audience — <span className="text-xs font-normal">Soumis à consentement</span>
                </p>
                <p className="mb-3">
                  Ces cookies permettent d'établir des statistiques de fréquentation du site (pages visitées,
                  durée des sessions, provenance des visiteurs) afin d'améliorer l'expérience utilisateur.
                  Actuellement, <Strong>{company}</Strong> n'utilise pas de solution d'analyse statistique
                  tierce sur ce site.
                </p>
                <p className="text-xs italic">Aucun cookie de cette catégorie n'est actuellement déposé.</p>
              </div>

              <div className="p-5 rounded-sm border border-[var(--border)] bg-[var(--card)]">
                <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Cookies publicitaires et de profilage — <span className="text-xs font-normal">Soumis à consentement</span>
                </p>
                <p className="mb-3">
                  Ces cookies sont utilisés pour afficher des publicités personnalisées et mesurer leur efficacité.
                </p>
                <p className="text-xs italic">
                  <Strong>{company}</Strong> n'utilise pas de cookies publicitaires ou de profilage sur ce site.
                </p>
              </div>

              <div className="p-5 rounded-sm border border-[var(--border)] bg-[var(--card)]">
                <p className="font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                  Cookies de cartographie — <span className="text-xs font-normal">Soumis à consentement</span>
                </p>
                <p className="mb-3">
                  La carte affichée sur la page d'accueil peut provenir de Google Maps. L'utilisation de ce service
                  peut entraîner le dépôt de cookies par Google. Pour en savoir plus :{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>
                    Politique de confidentialité de Google
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <H2>3. Durée de conservation des cookies</H2>
            <p>
              Conformément aux recommandations de la CNIL, la durée de conservation des cookies déposés sur votre
              terminal ne peut excéder <Strong>13 mois</Strong>. Passé ce délai, votre consentement est à nouveau
              requis. Les cookies de session sont supprimés automatiquement à la fermeture de votre navigateur.
            </p>
          </section>

          <section>
            <H2>4. Gérer vos préférences</H2>
            <p>
              Vous pouvez à tout moment modifier vos préférences en matière de cookies. Plusieurs options s'offrent à vous :
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>Via les paramètres de votre navigateur</p>
                <p>
                  La plupart des navigateurs vous permettent de refuser ou de supprimer les cookies via leurs paramètres.
                  Voici les liens vers les instructions des principaux navigateurs :
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-le-pistage-firefox" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>Apple Safari</a></li>
                  <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>Microsoft Edge</a></li>
                </ul>
                <p className="mt-2 text-xs italic">
                  Attention : la désactivation de certains cookies peut affecter le bon fonctionnement du site.
                </p>
              </div>

              <div>
                <p className="font-medium mb-1" style={{ color: 'var(--foreground)' }}>Via la plateforme de désinscription publicitaire</p>
                <p>
                  Vous pouvez vous opposer au dépôt de cookies publicitaires via la plateforme{' '}
                  <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>
                    Your Online Choices
                  </a>{' '}
                  gérée par l'EDAA (European Digital Advertising Alliance).
                </p>
              </div>
            </div>
          </section>

          <section>
            <H2>5. Mise à jour de cette politique</H2>
            <p>
              <Strong>{company}</Strong> se réserve le droit de modifier la présente politique de cookies à tout
              moment pour se conformer aux évolutions légales ou aux changements apportés au site. La date de mise
              à jour figurant ci-dessous sera actualisée en conséquence.
            </p>
          </section>

          <section>
            <H2>6. Contact</H2>
            <p>
              Pour toute question relative à notre utilisation des cookies ou pour exercer vos droits, contactez-nous à :{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--orange)' }}>{email}</a>.
            </p>
            <p className="mt-2">
              Vous pouvez également introduire une réclamation auprès de la CNIL :{' '}
              <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange)' }}>
                https://www.cnil.fr/fr/plaintes
              </a>.
            </p>
          </section>

          {/* Modifier les préférences */}
          <div
            className="p-6 rounded-sm border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderColor: 'var(--orange)', backgroundColor: 'color-mix(in srgb, var(--orange) 6%, transparent)' }}
          >
            <div>
              <p className="font-medium text-sm mb-1" style={{ color: 'var(--foreground)' }}>
                Modifier vos préférences
              </p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                Vous pouvez retirer ou modifier votre consentement à tout moment.
              </p>
            </div>
            <button
              onClick={handleReset}
              disabled={reset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 shrink-0"
              style={{ backgroundColor: 'var(--orange)' }}
            >
              <RotateCcw size={14} />
              {reset ? 'Rechargement…' : 'Modifier mes préférences'}
            </button>
          </div>

          <p className="text-xs pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
            Dernière mise à jour : juin 2026
          </p>
        </div>
      </div>
    </div>
  );
}
