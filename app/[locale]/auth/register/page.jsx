'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Store, User } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const t      = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'client' });
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Mot de passe trop court'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/register', form);
      const res = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      if (res?.ok) {
        toast.success('Compte créé avec succès !');
        router.push(form.role === 'merchant' ? `/${locale}/dashboard/merchant` : `/${locale}/dashboard/client`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-bold text-2xl">
            <span className="bg-primary-500 text-white px-2 py-1 rounded-lg font-extrabold">SA</span>
            <span>StockAlerte</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Rejoignez la plateforme anti-gaspillage</p>
        </div>

        <div className="card p-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('register')}</h1>

          {/* Google */}
          <button
            onClick={() => { setGoogleLoading(true); signIn('google', { callbackUrl: `/${locale}/dashboard` }); }}
            disabled={googleLoading}
            className="w-full btn-secondary flex items-center justify-center gap-3 mb-6"
          >
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continuer avec Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative text-center text-xs text-gray-400 bg-white dark:bg-gray-900 px-3 w-fit mx-auto">ou avec un email</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Je suis...</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'client',   icon: User,  label: t('role_client') },
                  { value: 'merchant', icon: Store, label: t('role_merchant') },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: value }))}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium',
                      form.role === value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-center text-xs leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">{t('name')}</label>
              <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" placeholder="Votre nom complet" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">{t('email')}</label>
              <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input" placeholder="nom@exemple.com" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input pe-10"
                  placeholder="Min. 6 caractères"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('register')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t('already_account')}{' '}
            <Link href={`/${locale}/auth/login`} className="text-primary-600 font-medium hover:text-primary-700">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
