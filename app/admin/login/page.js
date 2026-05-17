'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Identifiants incorrects.');
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div
            className="w-12 h-12 rounded-sm flex items-center justify-center font-display font-bold text-lg text-white mx-auto mb-4"
            style={{ backgroundColor: 'var(--orange)' }}
          >
            PC
          </div>
          <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--foreground)' }}>
            Administration
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Accès réservé
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Mot de passe</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full px-4 py-3 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-sm text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--orange)' }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
