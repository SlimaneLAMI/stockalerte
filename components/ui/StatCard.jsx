import { cn } from '@/lib/utils';

export default function StatCard({ icon, label, value, trend, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600',
    green:   'bg-green-50 dark:bg-green-900/20 text-green-600',
    blue:    'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
    purple:  'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
  };

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {trend !== undefined && (
            <p className={cn('text-xs mt-1', trend >= 0 ? 'text-green-600' : 'text-red-500')}>
              {trend >= 0 ? '+' : ''}{trend}% ce mois
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl text-2xl', colors[color])}>{icon}</div>
      </div>
    </div>
  );
}
