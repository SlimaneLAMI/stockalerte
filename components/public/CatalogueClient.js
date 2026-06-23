'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import BackToTop from './BackToTop';
import Breadcrumbs from './Breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';

function FiltersPanel({ categories, brands, filters, onChange, onReset, hasActive }) {
  const availabilityOptions = ['En stock', 'Sur commande', 'Discontinué'];

  return (
    <aside className="flex flex-col gap-6">
      {hasActive && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-xs font-medium transition-colors hover:text-[var(--orange)]"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <X size={12} /> Réinitialiser les filtres
        </button>
      )}

      {/* Categories */}
      <div>
        <p className="font-display font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
          Catégorie
        </p>
        <div className="flex flex-col gap-2.5">
          {categories.map(cat => (
            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat._id)}
                onChange={e => {
                  const next = e.target.checked
                    ? [...filters.categories, cat._id]
                    : filters.categories.filter(id => id !== cat._id);
                  onChange({ ...filters, categories: next });
                }}
                className="w-4 h-4 rounded-sm accent-[var(--orange)]"
              />
              <span className="text-sm group-hover:text-[var(--foreground)] transition-colors" style={{ color: 'var(--muted-foreground)' }}>
                {cat.icon} {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <p className="font-display font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
          Marque
        </p>
        <div className="flex flex-col gap-2.5">
          {brands.map(brand => (
            <label key={brand._id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.name)}
                onChange={e => {
                  const next = e.target.checked
                    ? [...filters.brands, brand.name]
                    : filters.brands.filter(b => b !== brand.name);
                  onChange({ ...filters, brands: next });
                }}
                className="w-4 h-4 rounded-sm accent-[var(--orange)]"
              />
              <span className="text-sm group-hover:text-[var(--foreground)] transition-colors" style={{ color: 'var(--muted-foreground)' }}>
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="font-display font-bold text-sm mb-3 uppercase tracking-wide" style={{ color: 'var(--foreground)' }}>
          Disponibilité
        </p>
        <div className="flex flex-col gap-2.5">
          {availabilityOptions.map(opt => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.availability.includes(opt)}
                onChange={e => {
                  const next = e.target.checked
                    ? [...filters.availability, opt]
                    : filters.availability.filter(a => a !== opt);
                  onChange({ ...filters, availability: next });
                }}
                className="w-4 h-4 rounded-sm accent-[var(--orange)]"
              />
              <span className="text-sm group-hover:text-[var(--foreground)] transition-colors" style={{ color: 'var(--muted-foreground)' }}>
                {opt}
              </span>
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
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function CatalogueClient({ initialCategory } = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [quickView, setQuickView] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    brands: [],
    availability: [],
  });

  const hasActiveFilters = filters.categories.length > 0 || filters.brands.length > 0 || filters.availability.length > 0;

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/brands').then(r => r.json()),
    ]).then(([c, b]) => {
      setCategories(Array.isArray(c) ? c : []);
      setBrands(Array.isArray(b) ? b : []);
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ sort, limit: '24' });
    if (search) params.set('search', search);
    filters.categories.forEach(c => params.append('category', c));
    filters.brands.forEach(b => params.append('brand', b));
    filters.availability.forEach(a => params.append('availability', a));

    const data = await fetch(`/api/products?${params}`).then(r => r.json());
    setProducts(data.products || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, sort, filters]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 250);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  return (
    <>
      <div className="pt-20">
        {/* Page header */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 pb-8">
          <Breadcrumbs items={[{ label: 'Accueil', href: '/' }, { label: 'Catalogue' }]} />
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-3" style={{ color: 'var(--foreground)' }}>
            Catalogue
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            {loading ? '...' : `${total} produit${total > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="border-b border-[var(--border)] sticky top-16 lg:top-20 z-20 bg-[var(--background)] backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-sm border bg-[var(--card)] outline-none focus:border-[var(--orange)] transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="hidden sm:block text-sm rounded-sm border px-3 py-2.5 bg-[var(--card)] outline-none cursor-pointer"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <option value="createdAt">Nouveautés</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="name_asc">Nom A–Z</option>
            </select>

            {/* Mobile filters btn */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex lg:hidden items-center gap-2 px-4 py-2.5 rounded-sm text-sm border transition-colors hover:bg-[var(--muted)]"
              style={{ borderColor: 'var(--border)' }}
            >
              <SlidersHorizontal size={14} />
              Filtres
              {hasActiveFilters && (
                <span
                  className="w-5 h-5 rounded-full text-xs text-white flex items-center justify-center"
                  style={{ backgroundColor: 'var(--orange)' }}
                >
                  {filters.categories.length + filters.brands.length + filters.availability.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
          <div className="flex gap-12">
            {/* Desktop filters sidebar */}
            <div className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-36">
                <FiltersPanel
                  categories={categories}
                  brands={brands}
                  filters={filters}
                  onChange={setFilters}
                  onReset={() => setFilters({ categories: [], brands: [], availability: [] })}
                  hasActive={hasActiveFilters}
                />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              ) : products.length === 0 ? (
                <motion.div
                  className="text-center py-24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-5xl mb-4">🔍</p>
                  <p className="font-display font-bold text-xl mb-2" style={{ color: 'var(--foreground)' }}>
                    Aucun produit trouvé
                  </p>
                  <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
                    Essayez d'ajuster vos filtres ou votre recherche.
                  </p>
                  <button
                    onClick={() => { setFilters({ categories: [], brands: [], availability: [] }); setSearch(''); }}
                    className="text-sm font-medium underline underline-offset-4"
                    style={{ color: 'var(--orange)' }}
                  >
                    Réinitialiser
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.06 } },
                  }}
                >
                  {products.map(product => (
                    <motion.div
                      key={product._id}
                      className="h-full"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                      }}
                    >
                      <ProductCard product={product} onQuickView={setQuickView} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div
              className="absolute inset-y-0 left-0 w-72 flex flex-col bg-[var(--background)] p-6 overflow-y-auto"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-8">
                <p className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>Filtres</p>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X size={18} style={{ color: 'var(--muted-foreground)' }} />
                </button>
              </div>
              <FiltersPanel
                categories={categories}
                brands={brands}
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters({ categories: [], brands: [], availability: [] })}
                hasActive={hasActiveFilters}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
      <BackToTop />
    </>
  );
}
