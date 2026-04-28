import PublicLayout from '@/components/layout/PublicLayout';

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Conditions générales d'utilisation</h1>
        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          {[
            { title: '1. Acceptation', body: 'En utilisant StockAlerte, vous acceptez les présentes CGU. Les utilisateurs doivent être âgés de 18 ans minimum.' },
            { title: '2. Comptes', body: 'Chaque utilisateur est responsable de la confidentialité de ses identifiants. Les comptes frauduleux seront supprimés.' },
            { title: '3. Offres commerçants', body: 'Les commerçants s\'engagent à publier des offres exactes et valides. Les informations trompeuses entraîneront la suspension.' },
            { title: '4. Responsabilité', body: 'StockAlerte est une plateforme de mise en relation. Nous ne sommes pas responsables des transactions entre commerçants et clients.' },
            { title: '5. Modifications', body: 'Ces CGU peuvent être modifiées à tout moment. Les utilisateurs seront notifiés par email.' },
          ].map(({ title, body }) => (
            <div key={title} className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
