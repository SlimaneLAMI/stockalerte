'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OfferCard from '@/components/ui/OfferCard';
import StatCard from '@/components/ui/StatCard';
import { Loader2, MapPin } from 'lucide-react';
import axios from 'axios';

export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const router  = useRouter();
  const locale  = useLocale();
  const t       = useTranslations('dashboard');
  const [favorites, setFavorites] = useState([]);
  const [follows, setFollows]     = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) { router.push(`/${locale}/auth/login`); return; }
    if (session.user.role === 'merchant') { router.push(`/${locale}/dashboard/merchant`); return; }
    fetchData();
  }, [session, status]);

  async function fetchData() {
    try {
      const [fRes, flRes, nRes] = await Promise.all([
        axios.get('/api/favorites'),
        axios.get('/api/follows'),
        axios.get('/api/notifications'),
      ]);
      setFavorites(fRes.data.favorites.slice(0, 4));
      setFollows(flRes.data.follows.slice(0, 4));
      setNotifCount(nRes.data.unread);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('hello')}, {session?.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">{t('my_space')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="❤️"  label={t('stat_favorites')}     value={favorites.length}  color="primary" />
          <StatCard icon="🏪"  label={t('stat_following')}     value={follows.length}    color="green" />
          <StatCard icon="🔔"  label={t('stat_notifications')} value={notifCount}        color="blue" />
          <StatCard icon="📍"  label={t('stat_wilaya')}        value="—"                 color="purple" />
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('my_favorites')}</h2>
              <Link href={`/${locale}/dashboard/client/favorites`} className="text-sm text-primary-600 hover:text-primary-700">{t('see_all')}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {favorites.map((fav) => fav.offer && (
                <OfferCard key={fav._id} offer={fav.offer} initialFavorited />
              ))}
            </div>
          </div>
        )}

        {/* Follows */}
        {follows.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('followed_merchants')}</h2>
              <Link href={`/${locale}/dashboard/client/following`} className="text-sm text-primary-600 hover:text-primary-700">{t('see_all')}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {follows.map((follow) => follow.merchant && (
                <Link key={follow._id} href={`/${locale}/merchants/${follow.merchant.slug || follow.merchant._id}`}>
                  <div className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-xl shrink-0">
                      {follow.merchant.logo ? <img src={follow.merchant.logo} alt="" className="w-12 h-12 rounded-xl object-cover" /> : '🏪'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{follow.merchant.businessName}</p>
                      {follow.merchant.address?.wilaya && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {follow.merchant.address.wilaya}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {favorites.length === 0 && follows.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('explore_title')}</h3>
            <p className="text-gray-500 mb-6">{t('explore_desc')}</p>
            <Link href={`/${locale}/discover`} className="btn-primary">{t('explore_cta')}</Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
