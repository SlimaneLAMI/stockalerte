'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import PublicLayout from '@/components/layout/PublicLayout';
import OfferCard from '@/components/ui/OfferCard';
import OfferCardSkeleton from '@/components/ui/OfferCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Search, SlidersHorizontal, X, MapPin } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

const TYPES = [
  { value: 'all',       label: 'Tous' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'sale',      label: 'Solde' },
  { value: 'pack',      label: 'Pack' },
  { value: 'anti-waste', label: 'Anti-gaspi' },
  { value: 'donation',  label: 'Don' },
];

const SORTS = [
  { value: 'createdAt',    label: 'Plus récents' },
  { value: 'discountPercent', label: 'Meilleure remise' },
  { value: 'expiresAt',   label: 'Expire bientôt' },
];

export default function DiscoverPage() {
  const t      = useTranslations('offers');
  const locale = useLocale();
  const router = useRouter();
  const sp     = useSearchParams();

  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    type:  sp.get('type') || 'all',
    q:     sp.get('q') || '',
    sort:  'createdAt',
  });

  const fetchOffers = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 12 });
      if (filters.type !== 'all') params.set('type', filters.type);
      if (filters.q)              params.set('q', filters.q);
      params.set('sort', filters.sort);

      const { data } = await axios.get(`/api/offers?${params}`);
      if (p === 1) setOffers(data.offers);
      else setOffers((prev) => [...prev, ...data.offers]);
      setTotal(data.total);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchOffers(1); }, [fetchOffers]);

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('title')}</h1>
          <p className="text-gray-500">{total} offres disponibles</p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
                placeholder="Rechercher une offre..."
                className="input ps-10"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn('btn-secondary flex items-center gap-2', showFilters && 'ring-2 ring-primary-500')}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:block">Filtres</span>
            </button>
          </div>

          {/* Type tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters((f) => ({ ...f, type: value }))}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  filters.type === value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Extended filters */}
          {showFilters && (
            <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Trier par</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
                  className="input"
                >
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && page === 1
            ? Array.from({ length: 12 }).map((_, i) => <OfferCardSkeleton key={i} />)
            : offers.map((offer) => (
                <OfferCard key={offer._id} offer={offer} />
              ))}
        </div>

        {!loading && offers.length === 0 && (
          <EmptyState
            icon="🔍"
            title="Aucune offre trouvée"
            description="Essayez de modifier vos filtres ou votre recherche"
          />
        )}

        {/* Load more */}
        {offers.length < total && !loading && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => fetchOffers(page + 1)}
              className="btn-secondary px-8"
            >
              Charger plus
            </button>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
