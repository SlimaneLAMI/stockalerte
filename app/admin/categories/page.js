'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

function CategoryModal({ category, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', slug: '', description: '', icon: '🍳', ...category,
  });
  const [saving, setSaving] = useState(false);

  function autoSlug(name) {
    return name.toLowerCase().replace(/['']/g, '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    if (category?._id) {
      const res = await fetch(`/api/categories/${category._id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      onSave(await res.json());
    } else {
      const res = await fetch('/api/categories', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      onSave(await res.json());
    }
    setSaving(false);
    toast.success(category?._id ? 'Catégorie mise à jour' : 'Catégorie créée');
  }

  const inp = "w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] bg-[var(--card)]";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--foreground)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[var(--background)] rounded-sm p-8 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--foreground)' }}>
            {category?._id ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <button onClick={onClose}><X size={18} style={{ color: 'var(--muted-foreground)' }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Icône</label>
              <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className={inp + ' text-center text-xl'} style={inpStyle} />
            </div>
            <div className="col-span-4">
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
              <input required value={form.name} onChange={e => { setForm(p => ({ ...p, name: e.target.value, slug: autoSlug(e.target.value) })); }} className={inp} style={inpStyle} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Slug</label>
            <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inp + ' resize-none'} style={inpStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Image bannière</label>
            <CloudinaryUpload
              value={form.bannerImage || ''}
              onChange={url => setForm(p => ({ ...p, bannerImage: url }))}
              folder="StockAlerte/categories"
              label="Image bannière"
              aspectRatio="16/7"
            />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: 'var(--orange)' }}>
              {saving && <Loader2 size={14} className="animate-spin" />}
              Enregistrer
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-sm text-sm border transition-colors hover:bg-[var(--muted)]" style={{ borderColor: 'var(--border)' }}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(Array.isArray(d) ? d : []));
  }, []);

  function handleSave(cat) {
    setCategories(prev => {
      const idx = prev.findIndex(c => c._id === cat._id);
      return idx >= 0 ? prev.map((c, i) => i === idx ? cat : c) : [...prev, cat];
    });
    setModal(null);
  }

  async function handleDelete(id) {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCategories(p => p.filter(c => c._id !== id));
    setDeleteId(null);
    toast.success('Catégorie supprimée');
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="font-display font-bold text-2xl lg:text-3xl" style={{ color: 'var(--foreground)' }}>Catégories</h1>
        <button
          onClick={() => setModal({})}
          className="flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium text-white"
          style={{ backgroundColor: 'var(--orange)' }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Nouvelle catégorie</span>
          <span className="sm:hidden">Nouvelle</span>
        </button>
      </div>

      <div className="rounded-sm border border-[var(--border)] overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: 'var(--muted-foreground)' }}>Aucune catégorie.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {categories.map(cat => (
              <div key={cat._id} className="flex items-center gap-3 px-4 py-4 hover:bg-[var(--muted)] transition-colors">
                <span className="text-2xl shrink-0">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: 'var(--foreground)' }}>{cat.name}</p>
                  {cat.description && <p className="text-xs line-clamp-1 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{cat.description}</p>}
                  <code className="sm:hidden text-xs px-1.5 py-0.5 rounded-sm mt-1 inline-block" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{cat.slug}</code>
                </div>
                <code className="hidden sm:inline text-xs px-2 py-1 rounded-sm shrink-0" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>{cat.slug}</code>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setModal(cat)} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[var(--border)]"><Edit size={14} style={{ color: 'var(--muted-foreground)' }} /></button>
                  <button onClick={() => setDeleteId(cat._id)} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal !== null && <CategoryModal category={modal._id ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--background)] rounded-sm p-8 max-w-sm w-full shadow-2xl">
            <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Supprimer cette catégorie ?</p>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Les produits associés ne seront pas supprimés.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600">Supprimer</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-sm text-sm font-medium border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
