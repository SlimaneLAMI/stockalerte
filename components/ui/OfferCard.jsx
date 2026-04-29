'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Heart, Clock, MapPin } from 'lucide-react';
import { cn, formatPrice, daysUntilExpiry, getDiscountPercent } from '@/lib/utils';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const TYPE_COLORS = {
  sale:         'bg-red-100 text-red-700',
  promotion:    'bg-blue-100 text-blue-700',
  pack:         'bg-purple-100 text-purple-700',
  'anti-waste': 'bg-primary-100 text-primary-700',
  donation:     'bg-orange-100 text-orange-700',
};

export default function OfferCard({ offer, initialFavorited = false }) {
  const locale            = useLocale();
  const t                 = useTranslations('offers');
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading]     = useState(false);

  const days     = daysUntilExpiry(offer.expiresAt);
  const discount = getDiscountPercent(offer.originalPrice, offer.discountPrice);
  const isUrgent = days <= 1;
  const isSoon   = days <= 3 && days > 1;

  const TYPE_LABELS = {
    sale:         t('type_sale'),
    promotion:    t('type_promotion_short'),
    pack:         t('type_pack'),
    'anti-waste': t('type_anti_waste_short'),
    donation:     t('type_donation'),
  };

  const typeColor = TYPE_COLORS[offer.type] || TYPE_COLORS.promotion;
  const typeLabel = TYPE_LABELS[offer.type] || offer.type;

  async function toggleFavorite(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { toast.error(t('login_to_favorite')); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/favorites', { offerId: offer._id });
      setFavorited(data.favorited);
      toast.success(data.favorited ? t('added_to_favorites') : t('removed_from_favorites'));
    } catch {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/${locale}/offers/${offer._id}`} className="block group">
      <article className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {offer.images?.[0] ? (
            <Image
              src={offer.images[0]}
              alt={offer.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-30">🏷️</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 start-3 bg-red-500 text-white text-xs font-extrabold px-2.5 py-1.5 rounded-xl shadow-sm">
              -{discount}%
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className="absolute top-3 end-3 w-9 h-9 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 flex items-center justify-center transition-all duration-200 shadow-sm hover:scale-110 active:scale-95"
          >
            <Heart className={cn('w-4 h-4 transition-colors', favorited ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>

          {/* Urgency ribbon */}
          {isUrgent && (
            <div className="absolute bottom-3 start-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
              <Clock className="w-3 h-3" />
              {t('expires_today')}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">

          {/* Type + merchant row */}
          <div className="flex items-center justify-between gap-2">
            <span className={cn('badge text-xs', typeColor)}>
              {typeLabel}
            </span>
            {offer.merchant && (
              <span className="text-xs text-gray-400 truncate flex items-center gap-1.5">
                {offer.merchant.logo
                  ? <img src={offer.merchant.logo} alt="" className="w-4 h-4 rounded-full object-cover flex-shrink-0" />
                  : <span className="text-xs">🏪</span>}
                <span className="truncate">{offer.merchant.businessName}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-[15px] leading-snug group-hover:text-primary-600 transition-colors">
            {offer.title}
          </h3>

          {/* Price row */}
          <div className="flex items-center gap-2 mt-auto pt-1">
            {offer.type === 'donation' ? (
              <span className="text-lg font-extrabold text-primary-600">{t('free')} 🎁</span>
            ) : (
              <>
                {offer.discountPrice !== undefined && (
                  <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {formatPrice(offer.discountPrice)}
                  </span>
                )}
                {offer.originalPrice && offer.discountPrice && offer.originalPrice !== offer.discountPrice && (
                  <span className="text-sm text-gray-400 line-through">{formatPrice(offer.originalPrice)}</span>
                )}
              </>
            )}
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <span className={cn('flex items-center gap-1 text-xs font-medium',
              isUrgent ? 'text-red-500' : isSoon ? 'text-orange-500' : 'text-gray-400')}>
              <Clock className="w-3.5 h-3.5" />
              {days <= 0 ? t('expired') : days === 1 ? t('day_left') : t('days_left', { days })}
            </span>
            {offer.merchant?.address?.wilaya && (
              <span className="flex items-center gap-1 text-xs text-gray-400 truncate max-w-[120px]">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {offer.merchant.address.commune || offer.merchant.address.wilaya}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
