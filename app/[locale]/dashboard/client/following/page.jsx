'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import { Star, MapPin, Package, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function FollowingPage() {
  const locale = useLocale();
  const [follows, setFollows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/follows')
      .then(({ data }) => setFollows(data.follows))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function unfollow(merchantId) {
    try {
      await axios.post('/api/follows', { merchantId });
      setFollows((prev) => prev.filter((f) => f.merchant._id !== merchantId));
      toast.success('Désabonné');
    } catch { toast.error('Erreur'); }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Commerçants suivis</h1>
          <p className="text-gray-500 text-sm mt-1">{follows.length} abonnement{follows.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : follows.length === 0 ? (
          <EmptyState icon="🏪" title="Aucun abonnement" description="Suivez des commerçants pour recevoir leurs offres"
            action={`/${locale}/discover`} actionLabel="Découvrir" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {follows.map((follow) => {
              const m = follow.merchant;
              if (!m) return null;
              return (
                <div key={follow._id} className="card p-4 flex items-start gap-4">
                  <Link href={`/${locale}/merchants/${m.slug || m._id}`} className="shrink-0">
                    {m.logo ? (
                      <img src={m.logo} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl">🏪</div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/${locale}/merchants/${m.slug || m._id}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 truncate">{m.businessName}</h3>
                    </Link>
                    {m.address?.wilaya && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {m.address.wilaya}
                      </p>
                    )}
                    <div className="flex gap-3 text-xs text-gray-500 mt-1">
                      {m.rating > 0 && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {m.rating.toFixed(1)}</span>}
                      <span className="flex items-center gap-0.5"><Package className="w-3 h-3" /> {m.offerCount || 0} offres</span>
                    </div>
                  </div>
                  <button
                    onClick={() => unfollow(m._id)}
                    className="shrink-0 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded border border-gray-200 dark:border-gray-700"
                  >
                    Se désabonner
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
