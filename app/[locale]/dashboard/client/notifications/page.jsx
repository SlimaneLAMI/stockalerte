'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TYPE_ICONS = {
  new_offer:        '🏷️',
  offer_expiring:   '⏰',
  offer_sold_out:   '📦',
  merchant_verified:'✅',
  system:           '📣',
  follow:           '👤',
};

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifs(); }, []);

  async function fetchNotifs() {
    const { data } = await axios.get('/api/notifications');
    setNotifs(data.notifications);
    setLoading(false);
  }

  async function markAllRead() {
    await axios.patch('/api/notifications');
    setNotifs((n) => n.map((item) => ({ ...item, isRead: true })));
  }

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
            {unreadCount > 0 && <p className="text-gray-500 text-sm mt-1">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-ghost flex items-center gap-2 text-sm">
              <CheckCheck className="w-4 h-4" /> Tout marquer comme lu
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : notifs.length === 0 ? (
          <EmptyState icon="🔔" title="Aucune notification" description="Vos notifications apparaîtront ici" />
        ) : (
          <div className="space-y-2">
            {notifs.map((notif) => (
              <div
                key={notif._id}
                className={cn(
                  'card p-4 flex items-start gap-4',
                  !notif.isRead && 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10'
                )}
              >
                <div className="text-2xl shrink-0">{TYPE_ICONS[notif.type] || '📬'}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{notif.title}</p>
                  {notif.message && <p className="text-gray-500 text-xs mt-0.5">{notif.message}</p>}
                  <p className="text-gray-400 text-xs mt-1">{formatDate(notif.createdAt)}</p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full shrink-0 mt-1.5" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
