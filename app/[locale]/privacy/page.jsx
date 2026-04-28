import PublicLayout from '@/components/layout/PublicLayout';

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Politique de confidentialité</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Données collectées</h2>
            <p>Nous collectons : nom, email, rôle, et données de localisation (si autorisé). Les mots de passe sont chiffrés avec bcrypt.</p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Utilisation des données</h2>
            <p>Vos données sont utilisées uniquement pour le fonctionnement de la plateforme : authentification, notifications, affichage des offres.</p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Vos droits</h2>
            <p>Vous pouvez demander la suppression de votre compte et de vos données à tout moment via contact@stockalerte.dz.</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
