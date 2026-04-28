import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Star, MapPin, Package, Users } from 'lucide-react';

export default function MerchantCard({ merchant }) {
  const locale = useLocale();

  return (
    <Link href={`/${locale}/merchants/${merchant.slug || merchant._id}`} className="block group">
      <article className="card p-4 flex gap-4 items-start">
        {/* Logo */}
        <div className="shrink-0">
          {merchant.logo ? (
            <img
              src={merchant.logo}
              alt={merchant.businessName}
              className="w-14 h-14 rounded-xl object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-2xl">
              🏪
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate">
            {merchant.businessName}
          </h3>

          {merchant.address?.wilaya && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <MapPin className="w-3 h-3" />
              {merchant.address.commune || merchant.address.wilaya}
            </div>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {merchant.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {merchant.rating.toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {merchant.offerCount || 0} offres
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {merchant.followerCount || 0}
            </span>
          </div>
        </div>

        {merchant.isVerified && (
          <div className="shrink-0 text-blue-500" title="Vérifié">✓</div>
        )}
      </article>
    </Link>
  );
}
