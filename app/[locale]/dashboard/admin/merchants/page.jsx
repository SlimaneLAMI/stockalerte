'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Badge from '@/components/ui/Badge';
import { Search, Loader2, CheckCircle, Ban, MapPin } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function AdminMerchantsPage() {
  const locale  = useLocale();
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [q, setQ]                 = useState('');

  useEffect(() => {
    const params = new URLSearchParams({ limit: 30 });
    if (q) params.set('q', q);
    axios.get(`/api/merchants?${params}`)
      .then(({ data }) => setMerchants(data.merchants))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q]);

  async function verify(id) {
    try {
      await axios.patch(`/api/merchants/${id}`, { isVerified: true });
      setMerchants((prev) => prev.map((m) => m._id === id ? { ...m, isVerified: true } : m));
      toast.success('Commerçant vérifié');
    } catch { toast.error('Erreur'); }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Commerçants</h1>
          <p className="text-gray-500 text-sm mt-1">{merchants.length} inscrits</p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher..." className="input ps-9" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {merchants.map((m) => (
              <div key={m._id} className="card p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-xl shrink-0">
                  {m.logo ? <img src={m.logo} alt="" className="w-12 h-12 rounded-xl object-cover" /> : '🏪'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link href={`/${locale}/merchants/${m.slug || m._id}`} className="font-semibold hover:text-primary-600 truncate">{m.businessName}</Link>
                    {m.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                  </div>
                  {m.address?.wilaya && <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {m.address.wilaya}</p>}
                  <div className="flex gap-2 mt-1 text-xs text-gray-500">
                    <span>{m.offerCount || 0} offres</span>
                    <span>{m.followerCount || 0} abonnés</span>
                  </div>
                </div>
                {!m.isVerified && (
                  <button onClick={() => verify(m._id)} className="p-1.5 rounded hover:bg-green-50 text-green-600 shrink-0" title="Vérifier">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
