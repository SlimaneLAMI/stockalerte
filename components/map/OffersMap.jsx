'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatPrice, daysUntilExpiry } from '@/lib/utils';
import L from 'leaflet';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center, map]);
  return null;
}

export default function OffersMap({ offers = [], center = [36.7538, 3.0588], height = '500px' }) {
  const locale = useLocale();

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} />
        {offers.map((offer) => {
          if (!offer.location?.coordinates?.length) return null;
          const [lng, lat] = offer.location.coordinates;
          const days = daysUntilExpiry(offer.expiresAt);
          return (
            <Marker key={offer._id} position={[lat, lng]}>
              <Popup>
                <div className="text-sm min-w-[180px]">
                  <p className="font-semibold mb-1">{offer.title}</p>
                  {offer.merchant?.businessName && (
                    <p className="text-gray-500 text-xs mb-1">🏪 {offer.merchant.businessName}</p>
                  )}
                  {offer.discountPrice !== undefined && (
                    <p className="text-primary-600 font-bold mb-1">{formatPrice(offer.discountPrice)}</p>
                  )}
                  <p className={days <= 1 ? 'text-red-500 text-xs' : 'text-gray-400 text-xs'}>
                    {days <= 0 ? 'Expiré' : `${days}j restants`}
                  </p>
                  <Link
                    href={`/${locale}/offers/${offer._id}`}
                    className="block mt-2 text-center text-xs bg-primary-500 text-white rounded py-1 px-2 hover:bg-primary-600"
                  >
                    Voir l'offre
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
