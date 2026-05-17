import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
      <div className="text-center max-w-md">
        <p className="font-display font-bold text-8xl mb-4" style={{ color: 'var(--orange)' }}>404</p>
        <h1 className="font-display font-bold text-2xl mb-3" style={{ color: 'var(--foreground)' }}>
          Page introuvable
        </h1>
        <p className="text-base mb-8" style={{ color: 'var(--muted-foreground)' }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-medium text-white" style={{ backgroundColor: 'var(--orange)' }}>
            <ArrowLeft size={15} /> Retour à l'accueil
          </Link>
          <Link href="/catalogue" className="px-6 py-3 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]" style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
            Voir le catalogue
          </Link>
        </div>
      </div>
    </div>
  );
}
