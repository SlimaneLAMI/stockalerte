'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import BackToTop from './BackToTop';
import Breadcrumbs from './Breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 6;

/* ─── Filtres ─────────────────────────────────────────────────── */
function FiltersPanel({ categories, brands, filters, onChange, onReset, hasActive }) {
  const availabilityOptions = ['En stock', 'Sur commande'];
  return (
    <aside className="flex flex-col gap-6">
      {hasActive && (
        <button onClick={onReset} className="flex items-center gap-2 text-xs font-medium transition-colors hover:text-[var(--orange)]" style={{ color: 'var(--muted-foreground)' }}>
          <X size={12} /> Réinitialiser les filtres
        </button>
      )}
      <div>
        <p className="font-display font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>Catégorie</p>
        <div className="flex flex-col gap-2.5">
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={filters.categories.includes(cat._id)}
                onChange={e => onChange({ ...filters, categories: e.target.checked ? [...filters.categories, cat._id] : filters.categories.filter(id => id !== cat._id) })}
                className="w-4 h-4 rounded-sm accent-[var(--orange)]" />
              <span className="text-sm group-hover:text-[var(--foreground)] transition-colors" style={{ color: 'var(--muted-foreground)' }}>{cat.icon} {cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="font-display font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>Marque</p>
        <div className="flex flex-col gap-2.5">
          {brands.map(brand => (
            <label key={brand._id} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={filters.brands.includes(brand.name)}
                onChange={e => onChange({ ...filters, brands: e.target.checked ? [...filters.brands, brand.name] : filters.brands.filter(b => b !== brand.name) })}
                className="w-4 h-4 rounded-sm accent-[var(--orange)]" />
              <span className="text-sm group-hover:text-[var(--foreground)] transition-colors" style={{ color: 'var(--muted-foreground)' }}>{brand.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="font-display font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>Disponibilité</p>
        <div className="flex flex-col gap-2.5">
          {availabilityOptions.map(opt => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={filters.availability.includes(opt)}
                onChange={e => onChange({ ...filters, availability: e.target.checked ? [...filters.availability, opt] : filters.availability.filter(a => a !== opt) })}
                className="w-4 h-4 rounded-sm accent-[var(--orange)]" />
              <span className="text-sm group-hover:text-[var(--foreground)] transition-colors" style={{ color: 'var(--muted-foreground)' }}>{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

function ProductSkeleton() {
  return (
    <div className="rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--card)]">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-20" /><Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Catalogue principal ─────────────────────────────────────── */
export default function CatalogueClient({ initialCategory } = {}) {
  const [products, setProducts]       = useState([]);
  const [categories, setCategories]   = useState([]);
  const [brands, setBrands]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal]             = useState(0);
  const [hasMore, setHasMore]         = useState(false);
  const [quickView, setQuickView]     = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [search, setSearch]   = useState('');
  const [sort, setSort]       = useState('createdAt');
  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    availability: [],
  });

  /* Refs pour l'infinite scroll */
  const pageRef       = useRef(1);          // page actuelle chargée
  const loadingRef    = useRef(false);      // guard anti-doublon
  const hasMoreRef    = useRef(false);      // miroir de hasMore pour le callback
  const searchRef     = useRef(search);
  const sortRef       = useRef(sort);
  const filtersRef    = useRef(filters);

  /* Synchronise les refs avec l'état */
  useEffect(() => { searchRef.current  = search;  }, [search]);
  useEffect(() => { sortRef.current    = sort;    }, [sort]);
  useEffect(() => { filtersRef.current = filters; }, [filters]);

  const hasActiveFilters = filters.categories.length > 0 || filters.brands.length > 0 || filters.availability.length > 0;

  /* Chargement filtres */
  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/brands').then(r => r.json()),
    ]).then(([c, b]) => {
      setCategories(Array.isArray(c) ? c : []);
      setBrands(Array.isArray(b) ? b : []);
    });
  }, []);

  /* Construit les URLSearchParams depuis les refs (toujours à jour) */
  function buildParams(pageNum) {
    const s = searchRef.current;
    const so = sortRef.current;
    const f = filtersRef.current;
    const params = new URLSearchParams({ sort: so, limit: String(PAGE_SIZE), page: String(pageNum) });
    if (s) params.set('search', s);
    f.categories.forEach(c => params.append('category', c));
    f.brands.forEach(b => params.append('brand', b));
    f.availability.forEach(a => params.append('availability', a));
    return params;
  }

  /* Reset + chargement page 1 quand les critères changent */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setProducts([]);
    setHasMore(false);
    hasMoreRef.current = false;
    pageRef.current    = 1;
    loadingRef.current = false;

    const t = setTimeout(async () => {
      try {
        const data = await fetch(`/api/products?${buildParams(1)}`).then(r => r.json());
        if (cancelled) return;
        const prods = data.products || [];
        const more  = prods.length === PAGE_SIZE && prods.length < (data.total || 0);
        setProducts(prods);
        setTotal(data.total || 0);
        setHasMore(more);
        hasMoreRef.current = more;
        pageRef.current    = 1;
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => { cancelled = true; clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sort, filters]);

  /* Fonction de chargement de la page suivante — toujours fraîche via ref */
  async function doLoadMore() {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoadingMore(true);

    const nextPage = pageRef.current + 1;
    try {
      const data  = await fetch(`/api/products?${buildParams(nextPage)}`).then(r => r.json());
      const prods = data.products || [];
      const more  = prods.length === PAGE_SIZE && (pageRef.current * PAGE_SIZE + prods.length) < (data.total || 0);

      setProducts(prev => {
        const ids = new Set(prev.map(p => p._id));
        return [...prev, ...prods.filter(p => !ids.has(p._id))];
      });
      pageRef.current    = nextPage;
      hasMoreRef.current = more;
      setHasMore(more);
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }

  /* Ref vers la fonction — mise à jour à chaque render */
  const doLoadMoreRef = useRef(doLoadMore);
  useEffect(() => { doLoadMoreRef.current = doLoadMore; });

  /* Scroll listener — déclenche le chargement à 500px du bas */
  useEffect(() => {
    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop - clientHeight < 500) {
        doLoadMoreRef.current();
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []); // monté une seule fois

  return (
    <>
      <div className="pt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 pb-8">
          <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Catalogue' }]} />
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3" style={{ color: 'var(--foreground)' }}>Catalogue</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            {loading ? '...' : `${total} produit${total > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="border-b border-[var(--border)] sticky top-16 lg:top-20 z-20 bg-[var(--background)] backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-sm border bg-[var(--card)] outline-none focus:border-[var(--orange)] transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }} />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="hidden sm:block text-sm rounded-sm border px-3 py-2.5 bg-[var(--card)] outline-none cursor-pointer"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <option value="createdAt">Nouveautés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name_asc">Nom A–Z</option>
            </select>
            <button onClick={() => setMobileFiltersOpen(true)}
              className="flex lg:hidden items-center gap-2 px-4 py-2.5 rounded-sm text-sm border transition-colors hover:bg-[var(--muted)]"
              style={{ borderColor: 'var(--border)' }}>
              <SlidersHorizontal size={14} />
              Filtres
              {hasActiveFilters && (
                <span className="w-5 h-5 rounded-full text-xs text-white flex items-center justify-center" style={{ backgroundColor: 'var(--orange)' }}>
                  {filters.categories.length + filters.brands.length + filters.availability.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
          <div className="flex gap-12">
            <div className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-36">
                <FiltersPanel categories={categories} brands={brands} filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters({ categories: [], brands: [], availability: [] })}
                  hasActive={hasActiveFilters} />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <motion.div className="text-center py-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>Aucun produit trouvé</p>
                  <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Essayez d'ajuster vos filtres ou votre recherche.</p>
                  <button onClick={() => { setFilters({ categories: [], brands: [], availability: [] }); setSearch(''); }}
                    className="text-sm font-medium underline underline-offset-4" style={{ color: 'var(--orange)' }}>
                    Réinitialiser
                  </button>
                </motion.div>
              ) : (
                <>
                  <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
                    {products.map(product => (
                      <motion.div key={product._id} className="h-full"
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}>
                        <ProductCard product={product} onQuickView={setQuickView} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Feedback visuel */}
                  <div className="py-10 flex justify-center">
                    {loadingMore && <Loader2 size={24} className="animate-spin" style={{ color: 'var(--orange)' }} />}
                    {!hasMore && !loadingMore && products.length > 0 && (
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        {products.length === total
                          ? `Tous les ${total} produits sont affichés`
                          : `${products.length} produits affichés`}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div className="fixed inset-0 z-50 lg:hidden flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div className="absolute inset-y-0 left-0 w-72 flex flex-col bg-[var(--background)] p-6 overflow-y-auto"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className="flex items-center justify-between mb-8">
                <p className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>Filtres</p>
                <button onClick={() => setMobileFiltersOpen(false)}><X size={18} style={{ color: 'var(--muted-foreground)' }} /></button>
              </div>
              <FiltersPanel categories={categories} brands={brands} filters={filters}
                onChange={setFilters}
                onReset={() => setFilters({ categories: [], brands: [], availability: [] })}
                hasActive={hasActiveFilters} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
      <BackToTop />
    </>
  );
}
