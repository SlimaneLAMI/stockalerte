'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Loader2, X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

function BrandModal({ brand, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', logo: '', website: '', ...brand });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    if (brand?._id) {
      const res = await fetch(`/api/brands/${brand._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      onSave(await res.json());
    } else {
      const res = await fetch('/api/brands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      onSave(await res.json());
    }
    setSaving(false);
    toast.success(brand?._id ? 'Marque mise à jour' : 'Marque créée');
  }

  const inp = "w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] bg-[var(--card)]";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--foreground)' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[var(--background)] rounded-sm p-8 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl" style={{ color: 'var(--foreground)' }}>{brand?._id ? 'Modifier la marque' : 'Nouvelle marque'}</h2>
          <button onClick={onClose}><X size={18} style={{ color: 'var(--muted-foreground)' }} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Nom *</label>
            <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--foreground)' }}>Site web</label>
            <input type="url" value={form.website || ''} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} className={inp} style={inpStyle} placeholder="https://..." />
          </div>
          <div className="flex gap-3 mt-2">
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: 'var(--orange)' }}>
              {saving && <Loader2 size={14} className="animate-spin" />}
              Enregistrer
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-sm text-sm border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MarquesPage() {
  const [brands, setBrands] = useState([]);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(Array.isArray(d) ? d : []));
  }, []);

  function handleSave(brand) {
    setBrands(prev => {
      const idx = prev.findIndex(b => b._id === brand._id);
      return idx >= 0 ? prev.map((b, i) => i === idx ? brand : b) : [...prev, brand];
    });
    setModal(null);
  }

  async function handleDelete(id) {
    await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    setBrands(p => p.filter(b => b._id !== id));
    setDeleteId(null);
    toast.success('Marque supprimée');
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--foreground)' }}>Marques</h1>
        <button onClick={() => setModal({})} className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white" style={{ backgroundColor: 'var(--orange)' }}>
          <Plus size={15} /> Nouvelle marque
        </button>
      </div>

      <div className="rounded-sm border border-[var(--border)] overflow-hidden">
        {brands.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: 'var(--muted-foreground)' }}>Aucune marque.</p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {brands.map(brand => (
              <div key={brand._id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--muted)] transition-colors">
                <div className="w-10 h-10 rounded-sm flex items-center justify-center font-display font-bold text-sm" style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}>
                  {brand.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>{brand.name}</p>
                  {brand.website && <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{brand.website}</p>}
                </div>
                {brand.website && (
                  <a href={brand.website} target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[var(--border)]">
                    <ExternalLink size={14} style={{ color: 'var(--muted-foreground)' }} />
                  </a>
                )}
                <button onClick={() => setModal(brand)} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-[var(--border)]"><Edit size={14} style={{ color: 'var(--muted-foreground)' }} /></button>
                <button onClick={() => setDeleteId(brand._id)} className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal !== null && <BrandModal brand={modal._id ? modal : null} onSave={handleSave} onClose={() => setModal(null)} />}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--background)] rounded-sm p-8 max-w-sm w-full shadow-2xl">
            <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Supprimer cette marque ?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-sm text-sm font-medium text-white bg-red-500">Supprimer</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-sm text-sm font-medium border" style={{ borderColor: 'var(--border)' }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
