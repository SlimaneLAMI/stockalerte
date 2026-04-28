import Link from 'next/link';

export default function EmptyState({ icon = '📭', title, description, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-xs mb-6">{description}</p>}
      {action && actionLabel && (
        <Link href={action} className="btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
