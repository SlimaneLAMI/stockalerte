'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDate, daysUntilExpiry, formatPrice } from '@/lib/utils';

const STATUS_VARIANT = {
  active: 'success', expired: 'danger', paused: 'warning', draft: 'default',
};

export default function MerchantOffersPage() {
  const { data: session } = useSession();
  const locale            = useLocale();
  const t                 = useTranslations('dashboard');
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOffers(); }, []);

  async function fetchOffers() {
    try {
      const { data } = await axios.get('/api/offers?limit=50');
      setOffers(data.offers);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function toggleActive(offer) {
    try {
      const { data } = await axios.patch(`/api/offers/${offer._id}`, { isActive: !offer.isActive });
      setOffers((prev) => prev.map((o) => o._id === offer._id ? { ...o, isActive: data.offer.isActive } : o));
      toast.success(data.offer.isActive ? t('offer_activated') : t('offer_deactivated'));
    } catch { toast.error(t('error_generic')); }
  }

  async function deleteOffer(id) {
    if (!confirm(t('delete_confirm'))) return;
    try {
      await axios.delete(`/api/offers/${id}`);
      setOffers((prev) => prev.filter((o) => o._id !== id));
      toast.success(t('offer_deleted'));
    } catch { toast.error(t('error_generic')); }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('my_offers_title')}</h1>
            <p className="text-gray-500 text-sm mt-1">{offers.length} {offers.length !== 1 ? t('merchant_offers').toLowerCase() : t('merchant_offers').toLowerCase().replace(/s$/, '')}</p>
          </div>
          <Link href={`/${locale}/dashboard/merchant/create`} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('create')}
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : offers.length === 0 ? (
          <EmptyState icon="🏷️" title={t('no_offers_title')} description={t('no_offers_desc')}
            action={`/${locale}/dashboard/merchant/create`} actionLabel={t('create_offer')} />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="text-xs text-gray-400">
                    <th className="text-start px-4 py-3 font-medium">{t('table_offer')}</th>
                    <th className="text-start px-4 py-3 font-medium hidden sm:table-cell">{t('table_type')}</th>
                    <th className="text-start px-4 py-3 font-medium hidden md:table-cell">{t('table_price')}</th>
                    <th className="text-start px-4 py-3 font-medium hidden lg:table-cell">{t('table_expires')}</th>
                    <th className="text-start px-4 py-3 font-medium">{t('table_status')}</th>
                    <th className="text-start px-4 py-3 font-medium">{t('table_actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {offers.map((offer) => {
                    const days = daysUntilExpiry(offer.expiresAt);
                    return (
                      <tr key={offer._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {offer.images?.[0] && (
                              <img src={offer.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover hidden sm:block" />
                            )}
                            <div>
                              <p className="font-medium max-w-[150px] truncate">{offer.title}</p>
                              <p className={`text-xs mt-0.5 ${days <= 0 ? 'text-red-500' : days <= 3 ? 'text-orange-500' : 'text-gray-400'}`}>
                                {days <= 0 ? t('expired_label') : t('days_left', { days })}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <Badge variant="default">{offer.type}</Badge>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {offer.discountPrice ? formatPrice(offer.discountPrice) : '—'}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-gray-500">
                          {formatDate(offer.expiresAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={offer.isActive && offer.status === 'active' ? 'success' : STATUS_VARIANT[offer.status] || 'default'}>
                            {offer.isActive ? offer.status : t('paused')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleActive(offer)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" title={offer.isActive ? t('deactivate') : t('activate')}>
                              {offer.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <Link href={`/${locale}/dashboard/merchant/offers/${offer._id}/edit`} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button onClick={() => deleteOffer(offer._id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
