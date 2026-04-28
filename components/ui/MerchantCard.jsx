import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import { Star, MapPin, Package, Users, BadgeCheck } from 'lucide-react';

export default async function MerchantCard({ merchant }) {
  const locale = await getLocale();

  return (
    <Link href={`/${locale}/merchants/${merchant.slug || merchant._id}`} className="block group">
      <article className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 p-5 flex gap-4 items-center">

        {/* Logo */}
        <div className="shrink-0">
          {merchant.logo ? (
            <img src={merchant.logo} alt={merchant.businessName}
              className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center text-2xl shadow-sm">
              🏪
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors truncate text-[15px]">
              {merchant.businessName}
            </h3>
            {merchant.isVerified && (
              <BadgeCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />
            )}
          </div>

          {merchant.address?.wilaya && (
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
              <MapPin className="w-3 h-3" />
              {merchant.address.commune || merchant.address.wilaya}
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {merchant.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold text-gray-700 dark:text-gray-300">{merchant.rating.toFixed(1)}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3 text-primary-400" />
              {merchant.offerCount || 0} offres
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-gray-400" />
              {merchant.followerCount || 0}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="shrink-0 w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </Link>
  );
}
