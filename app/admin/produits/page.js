'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { useSettings } from '@/components/SettingsContext';

export default function ProduitsPage() {
  const s = useSettings();
  const priceLabel = s.price_mode === 'TTC' ? 'TTC' : 'HT';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [selected, setSelected] = useState(new Set());
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ published: 'all', sort, limit: '100' });
    if (search) params.set('search', search);
    const data = await fetch(`/api/products?${params}`).then(r => r.json());
    setProducts(data.products || []);
    setLoading(false);
  }, [search, sort]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts(p => p.filter(x => x._id !== id));
    setDeleteId(null);
    toast.success('Produit supprimé');
  }

  async function handleBulkDelete() {
    await Promise.all([...selected].map(id => fetch(`/api/products/${id}`, { method: 'DELETE' })));
    setProducts(p => p.filter(x => !selected.has(x._id)));
    setSelected(new Set());
    toast.success(`${selected.size} produit(s) supprimé(s)`);
  }

  const availabilityColors = {
    'En stock': 'text-emerald-600',
    'Sur commande': 'text-amber-600',
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--foreground)' }}>Produits</h1>
        <Link
          href="/admin/produits/nouveau"
          className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--orange)' }}
        >
          <Plus size={15} />
          Nouveau produit
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-sm border bg-[var(--card)] outline-none focus:border-[var(--orange)]"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
        </div>
        {selected.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
            Supprimer ({selected.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-sm border border-[var(--border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]" style={{ backgroundColor: 'var(--muted)' }}>
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={selected.size === products.length && products.length > 0}
                  onChange={e => setSelected(e.target.checked ? new Set(products.map(p => p._id)) : new Set())}
                  className="accent-[var(--orange)]"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--foreground)' }}>Produit</th>
              <th className="px-4 py-3 text-left font-medium hidden md:table-cell" style={{ color: 'var(--foreground)' }}>Catégorie</th>
              <th className="px-4 py-3 text-left font-medium hidden lg:table-cell" style={{ color: 'var(--foreground)' }}>Prix {priceLabel}</th>
              <th className="px-4 py-3 text-left font-medium hidden sm:table-cell" style={{ color: 'var(--foreground)' }}>Disponibilité</th>
              <th className="px-4 py-3 text-right font-medium" style={{ color: 'var(--foreground)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--border)] animate-pulse">
                  <td className="px-4 py-3" colSpan={6}>
                    <div className="h-4 rounded bg-[var(--muted)] w-full" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Aucun produit trouvé.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr
                  key={product._id}
                  className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(product._id)}
                      onChange={e => {
                        const next = new Set(selected);
                        e.target.checked ? next.add(product._id) : next.delete(product._id);
                        setSelected(next);
                      }}
                      className="accent-[var(--orange)]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0]?.url && (
                        <div className="w-10 h-10 rounded-sm overflow-hidden bg-[var(--muted)] shrink-0">
                          <Image src={product.images[0].url} alt="" width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium line-clamp-1" style={{ color: 'var(--foreground)' }}>{product.name}</p>
                        {product.brand && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{product.brand}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: 'var(--muted-foreground)' }}>
                    {product.categoryId?.name || '—'}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell" style={{ color: 'var(--foreground)' }}>
                    {product.price ? `${product.price.toLocaleString('fr-FR')} €` : '—'}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-medium ${availabilityColors[product.availability] || ''}`}>
                      {product.availability}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/produits/${product._id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[var(--border)] transition-colors"
                      >
                        <Edit size={14} style={{ color: 'var(--muted-foreground)' }} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(product._id)}
                        className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--background)] rounded-sm p-8 max-w-sm w-full shadow-2xl">
            <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Supprimer ce produit ?</p>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
                Supprimer
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]" style={{ borderColor: 'var(--border)' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
