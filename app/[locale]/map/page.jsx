'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PublicLayout from '@/components/layout/PublicLayout';
import OfferCard from '@/components/ui/OfferCard';
import { MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';

const OffersMap = dynamic(() => import('@/components/map/OffersMap'), { ssr: false, loading: () => (
  <div className="h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
  </div>
) });

export default function MapPage() {
  const [offers, setOffers]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [userPos, setUserPos]   = useState(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  async function fetchOffers(lat, lng) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (lat !== undefined) { params.set('lat', lat); params.set('lng', lng); params.set('radius', 20); }
      const { data } = await axios.get(`/api/offers?${params}`);
      setOffers(data.offers);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function locateUser() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setUserPos([latitude, longitude]);
        fetchOffers(latitude, longitude);
        setLocating(false);
      },
      () => { setLocating(false); alert('Impossible de vous localiser'); }
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carte des offres</h1>
            <p className="text-gray-500 text-sm mt-1">{offers.length} offres sur la carte</p>
          </div>
          <button
            onClick={locateUser}
            disabled={locating}
            className="btn-primary flex items-center gap-2"
          >
            {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            {locating ? 'Localisation...' : 'Me localiser'}
          </button>
        </div>

        {/* Map */}
        <div className="mb-8">
          <OffersMap
            offers={offers}
            center={userPos || [36.7538, 3.0588]}
            height="60vh"
          />
        </div>

        {/* Nearby offers list */}
        {userPos && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Offres proches</h2>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {offers.slice(0, 8).map((offer) => (
                  <OfferCard key={offer._id} offer={offer} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
