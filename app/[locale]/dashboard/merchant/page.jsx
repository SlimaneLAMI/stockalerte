'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { Plus, Eye, Package, Users, Star, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { formatDate, daysUntilExpiry } from '@/lib/utils';

export default function MerchantDashboardPage() {
  const { data: session, status } = useSession();
  const router  = useRouter();
  const locale  = useLocale();
  const t       = useTranslations('dashboard');
  const [merchant, setMerchant] = useState(null);
  const [offers, setOffers]     = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push(`/${locale}/auth/login`); return; }
    if (session.user.role !== 'merchant') { router.push(`/${locale}/dashboard/client`); return; }
    fetchData();
  }, [session, status]);

  async function fetchData() {
    try {
      const [mRes, oRes] = await Promise.all([
        axios.get('/api/merchants/me'),
        axios.get('/api/offers?limit=5'),
      ]);
      setMerchant(mRes.data.merchant);
      setOffers(oRes.data.offers);
    } catch (err) {
      if (err.response?.status === 404) setMerchant(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    </DashboardLayout>
  );

  if (!merchant) return (
    <DashboardLayout>
      <EmptyState
        icon="🏪"
        title={t('no_profile_title')}
        description={t('no_profile_desc')}
        action={`/${locale}/dashboard/merchant/profile`}
        actionLabel={t('no_profile_action')}
      />
    </DashboardLayout>
  );

  const expiringSoon = offers.filter((o) => {
    const d = daysUntilExpiry(o.expiresAt);
    return d > 0 && d <= 3;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('hello')}, {merchant.businessName} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {merchant.isComplete ? t('profile_complete') : t('profile_incomplete')}
            </p>
          </div>
          <Link href={`/${locale}/dashboard/merchant/create`} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('create_offer')}
          </Link>
        </div>

        {/* Profile incomplete warning */}
        {!merchant.isComplete && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-amber-800 dark:text-amber-400 text-sm">
              {t('profile_incomplete_warning')}{' '}
              <Link href={`/${locale}/dashboard/merchant/profile`} className="font-semibold underline">
                {t('profile_incomplete_link')}
              </Link>{' '}
              {t('profile_incomplete')}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="🏷️" label={t('stat_active_offers')} value={merchant.offerCount || 0}    color="primary" />
          <StatCard icon="👁️" label={t('stat_views')}          value={merchant.views || 0}          color="blue" />
          <StatCard icon="👥" label={t('stat_followers')}      value={merchant.followerCount || 0}  color="green" />
          <StatCard icon="⭐" label={t('stat_rating')}         value={merchant.rating ? merchant.rating.toFixed(1) : '—'} color="purple" />
        </div>

        {/* Expiring soon */}
        {expiringSoon.length > 0 && (
          <div className="card p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">⚡</span> {t('expiring_soon')}
            </h2>
            <div className="space-y-2">
              {expiringSoon.map((offer) => (
                <div key={offer._id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-sm font-medium">{offer.title}</span>
                  <span className="text-xs text-orange-500 font-medium">{t('days_left', { days: daysUntilExpiry(offer.expiresAt) })}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent offers */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">{t('recent_offers')}</h2>
            <Link href={`/${locale}/dashboard/merchant/offers`} className="text-sm text-primary-600 hover:text-primary-700">
              {t('see_all')}
            </Link>
          </div>
          {offers.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">{t('no_offers')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    <th className="text-start pb-3 font-medium">{t('table_offer')}</th>
                    <th className="text-start pb-3 font-medium hidden sm:table-cell">{t('table_type')}</th>
                    <th className="text-start pb-3 font-medium hidden sm:table-cell">{t('table_expires')}</th>
                    <th className="text-start pb-3 font-medium">{t('table_status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {offers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 font-medium max-w-[200px] truncate">{offer.title}</td>
                      <td className="py-3 hidden sm:table-cell">
                        <Badge variant={offer.type === 'sale' ? 'danger' : offer.type === 'promotion' ? 'info' : 'default'}>
                          {offer.type}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-500 hidden sm:table-cell">{formatDate(offer.expiresAt)}</td>
                      <td className="py-3">
                        <Badge variant={offer.status === 'active' ? 'success' : offer.status === 'expired' ? 'danger' : 'default'}>
                          {offer.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
