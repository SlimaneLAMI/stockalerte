import Link from 'next/link';

export default function NotFound({ params }) {
  const locale = params?.locale || 'fr';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">404</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page introuvable</h1>
        <p className="text-gray-500 mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link href={`/${locale}`} className="btn-primary">Retour à l'accueil</Link>
      </div>
    </div>
  );
}
