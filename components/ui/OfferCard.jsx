'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Heart, Clock, MapPin, Tag } from 'lucide-react';
import { cn, formatPrice, daysUntilExpiry, getDiscountPercent } from '@/lib/utils';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const TYPE_CONFIG = {
  sale:       { label: 'Solde',           color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  promotion:  { label: 'Promotion',       color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  pack:       { label: 'Pack',            color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  'anti-waste': { label: 'Anti-gaspi',    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  donation:   { label: 'Don',            color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
};

export default function OfferCard({ offer, initialFavorited = false }) {
  const locale       = useLocale();
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading]     = useState(false);

  const days       = daysUntilExpiry(offer.expiresAt);
  const discount   = getDiscountPercent(offer.originalPrice, offer.discountPrice);
  const typeConfig = TYPE_CONFIG[offer.type] || TYPE_CONFIG.promotion;

  async function toggleFavorite(e) {
    e.preventDefault();
    if (!session) { toast.error('Connectez-vous pour ajouter aux favoris'); return; }
    setLoading(true);
    try {
      const { data } = await axios.post('/api/favorites', { offerId: offer._id });
      setFavorited(data.favorited);
      toast.success(data.favorited ? 'Ajouté aux favoris' : 'Retiré des favoris');
    } catch {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link href={`/${locale}/offers/${offer._id}`} className="block group">
      <article className="card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {offer.images?.[0] ? (
            <Image
              src={offer.images[0]}
              alt={offer.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🏷️</div>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 start-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Type badge */}
          <div className={cn('absolute top-3 end-12 badge text-xs', typeConfig.color)}>
            {typeConfig.label}
          </div>

          {/* Favorite */}
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className="absolute top-3 end-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition-colors shadow"
          >
            <Heart className={cn('w-4 h-4', favorited ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Merchant */}
          {offer.merchant && (
            <div className="flex items-center gap-2 mb-2">
              {offer.merchant.logo ? (
                <img src={offer.merchant.logo} alt="" className="w-5 h-5 rounded-full object-cover" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs">🏪</div>
              )}
              <span className="text-xs text-gray-500 truncate">{offer.merchant.businessName}</span>
            </div>
          )}

          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {offer.title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            {offer.discountPrice !== undefined && (
              <span className="text-lg font-bold text-primary-600">{formatPrice(offer.discountPrice)}</span>
            )}
            {offer.originalPrice && offer.discountPrice && offer.originalPrice !== offer.discountPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPrice(offer.originalPrice)}</span>
            )}
            {offer.type === 'donation' && (
              <span className="text-sm font-medium text-green-600">Gratuit</span>
            )}
          </div>

          <div className="mt-auto space-y-1">
            {/* Expiry */}
            <div className={cn('flex items-center gap-1 text-xs', days <= 1 ? 'text-red-500' : days <= 3 ? 'text-orange-500' : 'text-gray-400')}>
              <Clock className="w-3.5 h-3.5" />
              {days <= 0 ? 'Expiré' : `${days}j restants`}
            </div>

            {/* Location */}
            {offer.merchant?.address?.wilaya && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                {offer.merchant.address.commune || offer.merchant.address.wilaya}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
