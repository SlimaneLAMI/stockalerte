'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import PublicLayout from '@/components/layout/PublicLayout';
import { MapPin, Loader2, Navigation, X, Clock, BadgePercent, Store } from 'lucide-react';
import { formatPrice, daysUntilExpiry, getDiscountPercent } from '@/lib/utils';
import axios from 'axios';

/* ─── Leaflet loaded client-side only ─── */
const OffersMap = dynamic(() => import('@/components/map/OffersMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
    </div>
  ),
});

/* ─── Tiny offer card shown in sidebar ─── */
function OfferRow({ offer, selected, onClick }) {
  const t        = useTranslations('map');
  const days     = daysUntilExpiry(offer.expiresAt);
  const discount = getDiscountPercent(offer.originalPrice, offer.discountPrice);
  const isUrgent = days <= 2 && days > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-150 ${
        selected
          ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-400'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
      }`}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
        {offer.images?.[0] ? (
          <img src={offer.images[0]} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🏷️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{offer.title}</p>
        {offer.merchant?.businessName && (
          <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
            <Store className="w-3 h-3 flex-shrink-0" />
            {offer.merchant.businessName}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {offer.type === 'donation' ? (
            <span className="text-xs font-bold text-primary-600">{t('free')}</span>
          ) : offer.discountPrice !== undefined && (
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatPrice(offer.discountPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-white bg-primary-500 px-1.5 py-0.5 rounded-full">
              <BadgePercent className="w-2.5 h-2.5" />-{discount}%
            </span>
          )}
        </div>
      </div>

      {/* Expiry */}
      <div className={`text-xs font-semibold flex-shrink-0 ${
        days <= 0 ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-gray-400'
      }`}>
        {days <= 0 ? t('expired') : t('days_left', { days })}
      </div>
    </button>
  );
}

/* ─── Page ─── */
export default function MapPage() {
  const locale = useLocale();
  const t      = useTranslations('map');

  const [offers, setOffers]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [locating, setLocating]   = useState(false);
  const [userPos, setUserPos]     = useState(null);
  const [selected, setSelected]   = useState(null);
  const [mapCenter, setMapCenter] = useState([36.7538, 3.0588]);

  const withCoords = offers.filter((o) => o.location?.coordinates?.length === 2);
  const noCoords   = offers.filter((o) => !o.location?.coordinates?.length);

  const fetchOffers = useCallback(async (lat, lng) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 100 });
      if (lat !== undefined) {
        params.set('lat', lat);
        params.set('lng', lng);
        params.set('radius', 30);
      }
      const { data } = await axios.get(`/api/offers?${params}`);
      setOffers(data.offers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  function locateUser() {
    if (!navigator.geolocation) return alert('Géolocalisation non supportée');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setUserPos([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        fetchOffers(latitude, longitude);
        setLocating(false);
      },
      () => { setLocating(false); alert('Impossible de vous localiser'); }
    );
  }

  function handleSelect(offer) {
    setSelected(offer);
    if (offer.location?.coordinates?.length) {
      const [lng, lat] = offer.location.coordinates;
      setMapCenter([lat, lng]);
    }
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading
                ? t('loading')
                : `${withCoords.length} ${t('no_geolocated').toLowerCase()}`}
            </p>
          </div>
          <button
            onClick={locateUser}
            disabled={locating}
            className="btn-primary flex items-center gap-2 py-2.5"
          >
            {locating
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Navigation className="w-4 h-4" />}
            {locating ? t('locating') : t('locate_me')}
          </button>
        </div>

        {/* ── Main layout: map + sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* Map */}
          <div className="flex-1 min-h-0" style={{ height: '65vh' }}>
            <OffersMap
              offers={withCoords}
              center={mapCenter}
              height="100%"
              userPos={userPos}
              onSelect={handleSelect}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex flex-col gap-3">

            {/* Selected offer detail card */}
            {selected && (
              <div className="card p-4 border-primary-200 dark:border-primary-800 relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
                {selected.images?.[0] && (
                  <div className="rounded-xl overflow-hidden h-36 mb-3 -mx-1">
                    <img src={selected.images[0]} alt={selected.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="font-bold text-gray-900 dark:text-white mb-1 pr-6">{selected.title}</p>
                {selected.merchant?.businessName && (
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    {selected.merchant.businessName}
                  </p>
                )}
                <div className="flex items-center justify-between mb-3">
                  {selected.discountPrice !== undefined && (
                    <span className="text-lg font-black text-primary-600">
                      {formatPrice(selected.discountPrice)}
                    </span>
                  )}
                  {(() => {
                    const d = daysUntilExpiry(selected.expiresAt);
                    return (
                      <span className={`text-xs font-semibold flex items-center gap-1 ${d <= 0 ? 'text-red-500' : d <= 2 ? 'text-orange-500' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" />
                        {d <= 0 ? t('expired') : t('days_left', { days: d })}
                      </span>
                    );
                  })()}
                </div>
                <Link
                  href={`/${locale}/offers/${selected._id}`}
                  className="btn-primary w-full text-center text-sm py-2.5"
                >
                  {t('view_full_offer')}
                </Link>
              </div>
            )}

            {/* Offers list */}
            <div className="card p-2 overflow-y-auto" style={{ maxHeight: selected ? 'calc(65vh - 280px)' : '65vh' }}>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
                </div>
              ) : withCoords.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-500">{t('no_geolocated')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('no_geolocated_desc')}</p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-3 pt-2 pb-1">
                    {withCoords.length} {t('no_geolocated').toLowerCase()}
                  </p>
                  {withCoords.map((offer) => (
                    <OfferRow
                      key={offer._id}
                      offer={offer}
                      selected={selected?._id === offer._id}
                      onClick={() => handleSelect(offer)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Offers without coordinates ── */}
        {!loading && noCoords.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('other_offers_title')}</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  {noCoords.length} {t('no_geolocated_desc').toLowerCase()}
                </p>
              </div>
              <Link href={`/${locale}/discover`} className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                {t('see_all')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {noCoords.slice(0, 8).map((offer) => {
                const days     = daysUntilExpiry(offer.expiresAt);
                const discount = getDiscountPercent(offer.originalPrice, offer.discountPrice);
                return (
                  <Link
                    key={offer._id}
                    href={`/${locale}/offers/${offer._id}`}
                    className="card p-3 flex gap-3 hover:shadow-card-hover transition-shadow group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      {offer.images?.[0]
                        ? <img src={offer.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        : <div className="w-full h-full flex items-center justify-center text-2xl">🏷️</div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 transition-colors">{offer.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        {offer.discountPrice !== undefined && (
                          <span className="text-sm font-bold text-primary-600">{formatPrice(offer.discountPrice)}</span>
                        )}
                        {discount > 0 && (
                          <span className="text-xs font-bold text-white bg-primary-500 px-1.5 py-0.5 rounded-full">-{discount}%</span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${days <= 0 ? 'text-red-400' : days <= 2 ? 'text-orange-400' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" />
                        {days <= 0 ? t('expired') : t('days_left', { days })}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
