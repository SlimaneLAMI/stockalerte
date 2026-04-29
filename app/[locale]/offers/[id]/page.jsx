import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Offer from '@/models/Offer';
import PublicLayout from '@/components/layout/PublicLayout';
import Badge from '@/components/ui/Badge';
import OfferActionPanel from '@/components/ui/OfferActionPanel';
import { formatPrice, formatDate, daysUntilExpiry, getDiscountPercent } from '@/lib/utils';
import { Clock, MapPin, Phone, Star, Store, CalendarCheck, Truck } from 'lucide-react';

async function getOffer(id) {
  try {
    await connectDB();
    return await Offer.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .populate('merchant', 'businessName logo slug address phone schedule rating reviewCount followerCount')
      .populate('category', 'name slug icon')
      .lean();
  } catch { return null; }
}

const TYPE_VARIANTS = {
  sale: 'danger', promotion: 'info', pack: 'primary', 'anti-waste': 'success', donation: 'warning',
};
const TYPE_LABELS = {
  sale: 'Solde', promotion: 'Promotion', pack: 'Pack', 'anti-waste': 'Anti-gaspillage', donation: 'Don',
};

const DELIVERY_MODES = [
  { key: 'pickup',      icon: Store,         label: 'Sur place',  color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { key: 'reservation', icon: CalendarCheck, label: 'Réservation', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { key: 'delivery',    icon: Truck,         label: 'Livraison',  color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
];

export default async function OfferDetailPage({ params }) {
  const locale = params?.locale || 'fr';
  const id     = params?.id;
  const offer = await getOffer(id);
  if (!offer) return notFound();

  const days     = daysUntilExpiry(offer.expiresAt);
  const discount = getDiscountPercent(offer.originalPrice, offer.discountPrice);
  const deliveryOptions = offer.deliveryOptions || { pickup: true };
  const activeDeliveryModes = DELIVERY_MODES.filter((m) => deliveryOptions[m.key]);

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/${locale}/discover`} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Retour aux offres
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="card overflow-hidden">
              {offer.images?.length > 0 ? (
                <div className="relative h-72 sm:h-96">
                  <Image
                    src={offer.images[0]}
                    alt={offer.title}
                    fill
                    className="object-cover"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 start-4 bg-red-500 text-white font-bold text-lg px-3 py-1 rounded-full">
                      -{discount}%
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-72 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-6xl">🏷️</div>
              )}
            </div>

            {/* Info */}
            <div className="card p-6 space-y-4">
              <div className="flex items-start gap-3 flex-wrap">
                <Badge variant={TYPE_VARIANTS[offer.type] || 'default'}>
                  {TYPE_LABELS[offer.type] || offer.type}
                </Badge>
                {offer.category && <Badge variant="default">{offer.category.name?.fr || offer.category.slug}</Badge>}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{offer.title}</h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {offer.type === 'donation' ? (
                  <span className="text-2xl font-bold text-green-600">Gratuit</span>
                ) : (
                  <>
                    {offer.discountPrice !== undefined && (
                      <span className="text-3xl font-bold text-primary-600">{formatPrice(offer.discountPrice)}</span>
                    )}
                    {offer.originalPrice && offer.discountPrice && offer.originalPrice !== offer.discountPrice && (
                      <span className="text-xl text-gray-400 line-through">{formatPrice(offer.originalPrice)}</span>
                    )}
                  </>
                )}
              </div>

              {/* Delivery modes badges */}
              {activeDeliveryModes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeDeliveryModes.map(({ key, icon: Icon, label, color }) => (
                    <span key={key} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </span>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Expire le</p>
                  <p className="text-sm font-medium">{formatDate(offer.expiresAt)}</p>
                </div>
                {offer.quantity !== undefined && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Quantité</p>
                    <p className="text-sm font-medium">{offer.quantity} {offer.unit || 'unités'}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 mb-1">Statut</p>
                  <div className={`inline-flex items-center gap-1 text-sm font-medium ${days <= 0 ? 'text-red-500' : days <= 3 ? 'text-orange-500' : 'text-green-600'}`}>
                    <Clock className="w-4 h-4" />
                    {days <= 0 ? 'Expiré' : `${days} jours restants`}
                  </div>
                </div>
              </div>

              {offer.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{offer.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Action panel */}
            {days > 0 && (
              <OfferActionPanel offerId={offer._id.toString()} deliveryOptions={deliveryOptions} />
            )}

            {/* Merchant */}
            {offer.merchant && (
              <div className="card p-5">
                <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">À propos du commerçant</h3>

                <Link href={`/${locale}/merchants/${offer.merchant.slug || offer.merchant._id}`} className="flex items-center gap-3 mb-4 group">
                  {offer.merchant.logo ? (
                    <img src={offer.merchant.logo} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-xl">🏪</div>
                  )}
                  <div>
                    <p className="font-semibold group-hover:text-primary-600 transition-colors">{offer.merchant.businessName}</p>
                    {offer.merchant.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {offer.merchant.rating.toFixed(1)} · {offer.merchant.reviewCount} avis
                      </div>
                    )}
                  </div>
                </Link>

                {offer.merchant.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      {[offer.merchant.address.street, offer.merchant.address.commune, offer.merchant.address.wilaya]
                        .filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {offer.merchant.phone && (
                  <a href={`tel:${offer.merchant.phone}`} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-4">
                    <Phone className="w-4 h-4" />
                    {offer.merchant.phone}
                  </a>
                )}

                <Link
                  href={`/${locale}/merchants/${offer.merchant.slug || offer.merchant._id}`}
                  className="btn-secondary w-full text-center text-sm"
                >
                  Voir toutes les offres
                </Link>
              </div>
            )}

            {/* Urgency */}
            {days > 0 && days <= 3 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <p className="text-orange-700 dark:text-orange-400 font-medium text-sm">
                  ⚡ Offre bientôt expirée ! Plus que {days} jour{days > 1 ? 's' : ''}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
