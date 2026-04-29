'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { formatPrice, daysUntilExpiry, getDiscountPercent } from '@/lib/utils';
import L from 'leaflet';

/* ─── Fix Leaflet default icon paths ─── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* ─── Custom badge marker ─── */
function createOfferMarker(offer) {
  const discount = getDiscountPercent(offer.originalPrice, offer.discountPrice);
  const isExpiringSoon = daysUntilExpiry(offer.expiresAt) <= 2;
  const bg    = isExpiringSoon ? '#f97316' : '#22c55e';
  const shadow = isExpiringSoon
    ? 'rgba(249,115,22,0.45)'
    : 'rgba(34,197,94,0.40)';
  const label = discount > 0 ? `-${discount}%` : '🏷️';

  return L.divIcon({
    html: `
      <div style="
        background:${bg};
        color:#fff;
        padding:5px 10px;
        border-radius:20px;
        font-size:12px;
        font-weight:800;
        letter-spacing:-0.3px;
        box-shadow:0 3px 12px ${shadow};
        border:2.5px solid #fff;
        white-space:nowrap;
        cursor:pointer;
        user-select:none;
      ">${label}</div>
      <div style="
        width:0;height:0;
        border-left:6px solid transparent;
        border-right:6px solid transparent;
        border-top:8px solid ${bg};
        margin:0 auto;
        margin-top:-2px;
        filter:drop-shadow(0 2px 3px ${shadow});
      "></div>`,
    className: '',
    iconSize: [null, null],
    iconAnchor: [24, 34],
    popupAnchor: [0, -36],
  });
}

/* ─── User location marker ─── */
const USER_MARKER = L.divIcon({
  html: `
    <div style="
      width:18px;height:18px;
      background:#3b82f6;
      border:3px solid #fff;
      border-radius:50%;
      box-shadow:0 0 0 4px rgba(59,130,246,.25);
    "></div>`,
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/* ─── Recenter helper ─── */
function RecenterMap({ center, zoom = 13 }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (!center) return;
    const key = center.join(',');
    if (prev.current === key) return;
    prev.current = key;
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

/* ─── Main component ─── */
export default function OffersMap({
  offers   = [],
  center   = [36.7538, 3.0588],
  height   = '500px',
  userPos  = null,
  onSelect = null,
}) {
  const locale = useLocale();

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={center}
        zoom={12}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        {/* ── Esri World Street Map (données propriétaires Esri, gratuit, sans OSM) ── */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; <a href="https://www.esri.com/" target="_blank">Esri</a>'
          maxZoom={20}
        />
        <ZoomControl position="bottomright" />
        <RecenterMap center={center} />

        {/* ── User position ── */}
        {userPos && <Marker position={userPos} icon={USER_MARKER} />}

        {/* ── Offer markers ── */}
        {offers.map((offer) => {
          if (!offer.location?.coordinates?.length) return null;
          const [lng, lat] = offer.location.coordinates;
          const days     = daysUntilExpiry(offer.expiresAt);
          const discount = getDiscountPercent(offer.originalPrice, offer.discountPrice);

          return (
            <Marker
              key={offer._id}
              position={[lat, lng]}
              icon={createOfferMarker(offer)}
              eventHandlers={{ click: () => onSelect?.(offer) }}
            >
              <Popup
                minWidth={210}
                maxWidth={240}
                className="offer-popup"
              >
                {/* ── Popup card (inline styles — Tailwind not available in Leaflet DOM) ── */}
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '2px' }}>

                  {/* Image */}
                  {offer.images?.[0] && (
                    <div style={{ margin: '-10px -10px 10px', overflow: 'hidden', borderRadius: '10px 10px 0 0', height: '110px' }}>
                      <img
                        src={offer.images[0]}
                        alt={offer.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  {/* Discount badge */}
                  {discount > 0 && (
                    <span style={{
                      display: 'inline-block',
                      background: '#22c55e',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      marginBottom: '6px',
                    }}>
                      -{discount}%
                    </span>
                  )}

                  {/* Title */}
                  <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px', lineHeight: 1.3, color: '#111827' }}>
                    {offer.title}
                  </p>

                  {/* Merchant */}
                  {offer.merchant?.businessName && (
                    <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px' }}>
                      🏪 {offer.merchant.businessName}
                    </p>
                  )}

                  {/* Price + expiry */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    {offer.type === 'donation' ? (
                      <span style={{ fontWeight: 700, color: '#22c55e', fontSize: '14px' }}>Gratuit</span>
                    ) : offer.discountPrice !== undefined ? (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#22c55e', fontSize: '15px' }}>
                          {formatPrice(offer.discountPrice)}
                        </span>
                        {offer.originalPrice && offer.originalPrice !== offer.discountPrice && (
                          <span style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'line-through' }}>
                            {formatPrice(offer.originalPrice)}
                          </span>
                        )}
                      </div>
                    ) : <span />}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: days <= 0 ? '#ef4444' : days <= 2 ? '#f97316' : '#9ca3af',
                    }}>
                      {days <= 0 ? 'Expiré' : `${days}j restants`}
                    </span>
                  </div>

                  {/* CTA */}
                  <a
                    href={`/${locale}/offers/${offer._id}`}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      background: '#22c55e',
                      color: '#fff',
                      borderRadius: '10px',
                      padding: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      letterSpacing: '0.2px',
                    }}
                  >
                    Voir l'offre →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
