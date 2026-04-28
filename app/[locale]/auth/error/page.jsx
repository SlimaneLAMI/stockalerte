import Link from 'next/link';

export default function AuthErrorPage({ searchParams, params: { locale } }) {
  const error = searchParams?.error;

  const messages = {
    Configuration:   'Erreur de configuration du serveur.',
    AccessDenied:    'Accès refusé. Votre compte est peut-être suspendu.',
    Verification:    'Le lien de vérification a expiré.',
    Default:         'Une erreur d\'authentification est survenue.',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Erreur de connexion</h1>
        <p className="text-gray-500 mb-8">{messages[error] || messages.Default}</p>
        <div className="flex gap-4 justify-center">
          <Link href={`/${locale}/auth/login`} className="btn-primary">Réessayer</Link>
          <Link href={`/${locale}`} className="btn-secondary">Accueil</Link>
        </div>
      </div>
    </div>
  );
}
