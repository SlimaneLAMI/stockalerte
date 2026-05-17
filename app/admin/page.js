'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Tag, Mail, Building2, Plus, ArrowRight, TrendingUp } from 'lucide-react';

function StatCard({ icon: Icon, label, value, href, accent }) {
  return (
    <Link href={href} className="group block p-6 rounded-sm border border-[var(--border)] bg-[var(--card)] hover:border-[var(--orange)] transition-colors">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ backgroundColor: accent + '15' }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--orange)' }} />
      </div>
      <p className="font-display font-bold text-3xl mt-4" style={{ color: 'var(--foreground)' }}>{value ?? '—'}</p>
      <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?published=all&limit=1').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/contacts').then(r => r.json()),
    ]).then(([p, c, ct]) => {
      setStats({
        products: p?.total || 0,
        categories: Array.isArray(c) ? c.length : 0,
        unread: ct?.unreadCount || 0,
      });
      setContacts(ct?.contacts?.slice(0, 5) || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--foreground)' }}>Tableau de bord</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Bienvenue dans l'espace d'administration StockAlerte.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Package} label="Produits" value={loading ? '...' : stats.products} href="/admin/produits" accent="var(--orange)" />
        <StatCard icon={Tag} label="Catégories" value={loading ? '...' : stats.categories} href="/admin/categories" accent="#3b82f6" />
        <StatCard icon={Mail} label="Contacts non lus" value={loading ? '...' : stats.unread} href="/admin/contacts" accent="#10b981" />
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--foreground)' }}>Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/produits/nouveau"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white"
            style={{ backgroundColor: 'var(--orange)' }}
          >
            <Plus size={15} />
            Ajouter un produit
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <Plus size={15} />
            Ajouter une catégorie
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Voir le site →
          </Link>
        </div>
      </div>

      {/* Recent contacts */}
      {contacts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--foreground)' }}>Derniers contacts</h2>
            <Link href="/admin/contacts" className="text-sm transition-colors hover:text-[var(--orange)]" style={{ color: 'var(--muted-foreground)' }}>
              Voir tout <ArrowRight size={12} className="inline" />
            </Link>
          </div>
          <div className="rounded-sm border border-[var(--border)] overflow-hidden">
            {contacts.map((c, i) => (
              <div
                key={c._id}
                className={`flex items-start gap-4 px-5 py-4 ${i < contacts.length - 1 ? 'border-b border-[var(--border)]' : ''} ${!c.read ? 'bg-[var(--card)]' : ''}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: 'var(--orange)' }}>
                  {c.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{c.name}</p>
                    {!c.read && <span className="w-2 h-2 rounded-full bg-[var(--orange)]" />}
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>{c.message}</p>
                </div>
                <p className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                  {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
