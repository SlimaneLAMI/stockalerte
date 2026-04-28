'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function AdminStatsPage() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistiques globales</h1>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de la plateforme</p>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="👥" label="Utilisateurs"      value={stats.users || 0}        color="blue" />
              <StatCard icon="🏪" label="Commerçants"       value={stats.merchants || 0}    color="green" />
              <StatCard icon="📦" label="Total offres"      value={stats.offers || 0}       color="primary" />
              <StatCard icon="🏷️" label="Offres actives"   value={stats.activeOffers || 0} color="purple" />
            </div>

            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Résumé</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Signalements en attente',  value: stats.reports || 0 },
                  { label: 'Taux offres actives',       value: stats.offers ? `${Math.round((stats.activeOffers / stats.offers) * 100)}%` : '0%' },
                  { label: 'Moy. offres/commerçant',    value: stats.merchants ? (stats.offers / stats.merchants).toFixed(1) : 0 },
                  { label: 'Commerçants actifs',        value: stats.merchants || 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-gray-500 text-xs mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
