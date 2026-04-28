'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Badge from '@/components/ui/Badge';
import { Loader2, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDate, formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useLocale } from 'next-intl';

const STATUS_VARIANT = { active: 'success', expired: 'danger', paused: 'warning', pending_moderation: 'info', rejected: 'danger' };

export default function AdminOffersPage() {
  const locale = useLocale();
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/offers?limit=50')
      .then(({ data }) => setOffers(data.offers))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function deleteOffer(id) {
    if (!confirm('Supprimer cette offre ?')) return;
    try {
      await axios.delete(`/api/offers/${id}`);
      setOffers((prev) => prev.filter((o) => o._id !== id));
      toast.success('Offre supprimée');
    } catch { toast.error('Erreur'); }
  }

  async function updateStatus(id, status) {
    try {
      const { data } = await axios.patch(`/api/offers/${id}`, { status });
      setOffers((prev) => prev.map((o) => o._id === id ? { ...o, status: data.offer.status } : o));
      toast.success('Statut mis à jour');
    } catch { toast.error('Erreur'); }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modération des offres</h1>
          <p className="text-gray-500 text-sm mt-1">{offers.length} offres</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="text-xs text-gray-400">
                    <th className="text-start px-4 py-3 font-medium">Offre</th>
                    <th className="text-start px-4 py-3 font-medium hidden sm:table-cell">Commerce</th>
                    <th className="text-start px-4 py-3 font-medium hidden md:table-cell">Prix</th>
                    <th className="text-start px-4 py-3 font-medium hidden lg:table-cell">Expire</th>
                    <th className="text-start px-4 py-3 font-medium">Statut</th>
                    <th className="text-start px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {offers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3">
                        <p className="font-medium max-w-[160px] truncate">{offer.title}</p>
                        <Badge variant="default" className="mt-1 text-xs">{offer.type}</Badge>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                        {offer.merchant?.businessName || '—'}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {offer.discountPrice ? formatPrice(offer.discountPrice) : '—'}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                        {formatDate(offer.expiresAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANT[offer.status] || 'default'}>{offer.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link href={`/${locale}/offers/${offer._id}`} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                          {offer.status === 'pending_moderation' && (
                            <>
                              <button onClick={() => updateStatus(offer._id, 'active')} className="p-1.5 rounded hover:bg-green-50 text-green-600" title="Approuver">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => updateStatus(offer._id, 'rejected')} className="p-1.5 rounded hover:bg-red-50 text-red-500" title="Rejeter">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => deleteOffer(offer._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
