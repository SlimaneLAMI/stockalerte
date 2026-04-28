'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

export default function MerchantStatsPage() {
  const [merchant, setMerchant] = useState(null);
  const [offers, setOffers]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/merchants/me'),
      axios.get('/api/offers?limit=100'),
    ]).then(([mRes, oRes]) => {
      setMerchant(mRes.data.merchant);
      setOffers(oRes.data.offers);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
    </DashboardLayout>
  );

  const totalViews     = offers.reduce((s, o) => s + (o.views || 0), 0);
  const totalFavorites = offers.reduce((s, o) => s + (o.favorites || 0), 0);
  const activeOffers   = offers.filter((o) => o.status === 'active' && o.isActive).length;
  const expiredOffers  = offers.filter((o) => o.status === 'expired').length;

  const topOffers = [...offers].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistiques</h1>
          <p className="text-gray-500 text-sm mt-1">Performances de votre espace commerçant</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="👁️"  label="Vues profil"      value={(merchant?.views || 0).toLocaleString()} color="blue" />
          <StatCard icon="🏷️"  label="Offres actives"   value={activeOffers}   color="primary" />
          <StatCard icon="🔥"  label="Vues offres"       value={totalViews.toLocaleString()} color="green" />
          <StatCard icon="❤️"  label="Favoris"           value={totalFavorites} color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Résumé</h2>
            <div className="space-y-3">
              {[
                { label: 'Abonnés',          value: merchant?.followerCount || 0 },
                { label: 'Note moyenne',      value: merchant?.rating ? merchant.rating.toFixed(1) + ' / 5' : '—' },
                { label: 'Offres expirées',   value: expiredOffers },
                { label: 'Total offres',       value: offers.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Top offres (vues)</h2>
            {topOffers.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune donnée</p>
            ) : (
              <div className="space-y-3">
                {topOffers.map((offer, i) => (
                  <div key={offer._id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{offer.title}</p>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-primary-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, ((offer.views || 0) / (topOffers[0]?.views || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 shrink-0">{offer.views || 0} vues</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
