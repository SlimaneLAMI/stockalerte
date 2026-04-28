import { notFound } from 'next/navigation';
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import MerchantProfile from '@/models/MerchantProfile';
import Offer from '@/models/Offer';
import PublicLayout from '@/components/layout/PublicLayout';
import OfferCard from '@/components/ui/OfferCard';
import { Star, MapPin, Phone, Clock, Users, Package } from 'lucide-react';

async function getMerchant(id) {
  try {
    await connectDB();
    const merchant = await MerchantProfile.findOne(
      { $or: [{ _id: id.length === 24 ? id : null }, { slug: id }] }
    ).lean();
    return merchant;
  } catch { return null; }
}

async function getMerchantOffers(merchantId) {
  try {
    return await Offer.find({
      merchant: merchantId, status: 'active', isActive: true, expiresAt: { $gt: new Date() },
    })
      .populate('merchant', 'businessName logo slug address')
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();
  } catch { return []; }
}

export default async function MerchantPage({ params: { locale, id } }) {
  const merchant = await getMerchant(id);
  if (!merchant) return notFound();

  const offers = await getMerchantOffers(merchant._id);

  const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/${locale}/discover`} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-block">
          ← Découvrir
        </Link>

        {/* Cover + Header */}
        <div className="card overflow-hidden mb-8">
          {merchant.coverImage ? (
            <div className="h-48 relative">
              <img src={merchant.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-primary-500 to-orange-500" />
          )}

          <div className="p-6">
            <div className="flex items-start gap-4 -mt-12 sm:-mt-8">
              <div className="shrink-0">
                {merchant.logo ? (
                  <img src={merchant.logo} alt={merchant.businessName} className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-900 shadow flex items-center justify-center text-3xl">🏪</div>
                )}
              </div>
              <div className="flex-1 min-w-0 mt-10 sm:mt-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{merchant.businessName}</h1>
                  {merchant.isVerified && <span className="text-blue-500 text-sm" title="Vérifié">✓ Vérifié</span>}
                </div>
                {merchant.description && <p className="text-gray-500 text-sm mt-1">{merchant.description}</p>}

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  {merchant.rating > 0 && (
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      {merchant.rating.toFixed(1)} ({merchant.reviewCount} avis)
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-gray-500">
                    <Users className="w-4 h-4" /> {merchant.followerCount} abonnés
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Package className="w-4 h-4" /> {offers.length} offres actives
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              {merchant.address?.wilaya && (
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-500" />
                  {[merchant.address.street, merchant.address.commune, merchant.address.wilaya].filter(Boolean).join(', ')}
                </div>
              )}
              {merchant.phone && (
                <a href={`tel:${merchant.phone}`} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <Phone className="w-4 h-4" /> {merchant.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Offers */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Offres actives</h2>
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer._id.toString()} offer={JSON.parse(JSON.stringify(offer))} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Aucune offre active pour le moment</div>
        )}
      </div>
    </PublicLayout>
  );
}
