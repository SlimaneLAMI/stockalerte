import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useOffers(initialFilters = {}) {
  const [offers, setOffers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  const fetchOffers = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 12, ...filters });
      if (filters.type === 'all') params.delete('type');
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

  function loadMore() { fetchOffers(page + 1); }
  function updateFilter(key, value) { setFilters((f) => ({ ...f, [key]: value })); }

  return { offers, loading, total, page, filters, updateFilter, loadMore, hasMore: offers.length < total };
}
