'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OfferCard from '@/components/ui/OfferCard';
import EmptyState from '@/components/ui/EmptyState';
import { Loader2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import axios from 'axios';

export default function FavoritesPage() {
  const locale = useLocale();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axios.get('/api/favorites')
      .then(({ data }) => setFavorites(data.favorites))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes favoris</h1>
          <p className="text-gray-500 text-sm mt-1">{favorites.length} offre{favorites.length !== 1 ? 's' : ''} enregistrée{favorites.length !== 1 ? 's' : ''}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : favorites.length === 0 ? (
          <EmptyState icon="❤️" title="Aucun favori" description="Ajoutez des offres à vos favoris pour les retrouver ici"
            action={`/${locale}/discover`} actionLabel="Découvrir les offres" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav) => fav.offer && (
              <OfferCard key={fav._id} offer={fav.offer} initialFavorited />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
