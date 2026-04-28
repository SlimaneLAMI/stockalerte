'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import { Loader2, Users, Package, Store, Flag } from 'lucide-react';
import axios from 'axios';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router  = useRouter();
  const locale  = useLocale();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push(`/${locale}/auth/login`); return; }
    if (session.user.role !== 'admin') { router.push(`/${locale}/dashboard`); return; }
    axios.get('/api/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session, status]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la plateforme StockAlerte</p>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="👥" label="Utilisateurs"    value={stats.users?.toLocaleString() || 0}   color="blue" />
              <StatCard icon="🏪" label="Commerçants"    value={stats.merchants?.toLocaleString() || 0} color="green" />
              <StatCard icon="🏷️" label="Offres actives" value={stats.activeOffers?.toLocaleString() || 0} color="primary" />
              <StatCard icon="🚨" label="Signalements"   value={stats.reports || 0}                    color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent users */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Derniers utilisateurs</h2>
                  <Link href={`/${locale}/dashboard/admin/users`} className="text-sm text-primary-600">Voir tout →</Link>
                </div>
                <div className="space-y-3">
                  {(stats.recentUsers || []).map((user) => (
                    <div key={user._id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-semibold text-primary-600">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'merchant' ? 'info' : 'default'}>
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent offers */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white">Dernières offres</h2>
                  <Link href={`/${locale}/dashboard/admin/offers`} className="text-sm text-primary-600">Voir tout →</Link>
                </div>
                <div className="space-y-3">
                  {(stats.recentOffers || []).map((offer) => (
                    <div key={offer._id} className="flex items-center gap-3">
                      <div className="text-xl">🏷️</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{offer.title}</p>
                        <p className="text-xs text-gray-400">{offer.merchant?.businessName || '—'}</p>
                      </div>
                      <Badge variant={offer.status === 'active' ? 'success' : offer.status === 'expired' ? 'danger' : 'default'}>
                        {offer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { href: `/${locale}/dashboard/admin/users`,     icon: Users,   label: 'Gérer les users',  color: 'text-blue-500' },
                { href: `/${locale}/dashboard/admin/merchants`, icon: Store,   label: 'Commerçants',      color: 'text-green-500' },
                { href: `/${locale}/dashboard/admin/offers`,    icon: Package, label: 'Modération',       color: 'text-primary-500' },
                { href: `/${locale}/dashboard/admin/reports`,   icon: Flag,    label: 'Signalements',     color: 'text-red-500' },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href} className="card p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow text-center">
                  <Icon className={`w-8 h-8 ${color}`} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
