'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useLocale } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push('/fr/auth/login'); return; }
    if (session.user.role === 'admin')    router.push('/fr/dashboard/admin');
    else if (session.user.role === 'merchant') router.push('/fr/dashboard/merchant');
    else router.push('/fr/dashboard/client');
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
    </div>
  );
}
