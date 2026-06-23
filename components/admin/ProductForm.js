'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, GripVertical, Loader2, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

function SlugInput({ value, onChange }) {
  return (
    <div className="flex rounded-sm border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <span className="flex items-center px-3 text-sm border-r bg-[var(--muted)]" style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
        /catalogue/
      </span>
      <input
        value={value}
        onChange={e => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
        className="flex-1 px-3 py-2.5 text-sm outline-none bg-[var(--card)]"
        style={{ color: 'var(--foreground)' }}
      />
    </div>
  );
}

export default function ProductForm({ initialData, isEdit }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({
    name: '', slug: '', categoryId: '', brand: '',
    shortDesc: '', longDesc: '',
    images: [], pdfUrl: '',
    price: '', priceVisible: true,
    availability: 'En stock',
    condition: '',
    specs: [],
    featured: false, published: true,
    metaTitle: '', metaDesc: '',
    ...initialData,
    categoryId: initialData?.categoryId?._id ?? initialData?.categoryId ?? '',
    specs: initialData?.specs
      ? (initialData.specs instanceof Map
          ? [...initialData.specs.entries()].map(([k, v]) => ({ key: k, value: v }))
          : Object.entries(initialData.specs).map(([k, v]) => ({ key: k, value: v })))
      : [],
  });

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(Array.isArray(d) ? d : []));
  }, []);

  function autoSlug(name) {
    return name
      .toLowerCase()
      .replace(/['']/g, '')
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function set(key, val) {
    setForm(p => ({ ...p, [key]: val }));
  }

  function addSpec() {
    setForm(p => ({ ...p, specs: [...p.specs, { key: '', value: '' }] }));
  }

  function updateSpec(i, field, val) {
    setForm(p => {
      const specs = [...p.specs];
      specs[i] = { ...specs[i], [field]: val };
      return { ...p, specs };
    });
  }

  function removeSpec(i) {
    setForm(p => ({ ...p, specs: p.specs.filter((_, j) => j !== i) }));
  }

  async function uploadImage(file) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'StockAlerte/products');
    const res = await fetch('/api/upload', { method: 'POST', body: fd }).then(r => r.json());
    setUploading(false);
    return res;
  }

  async function handleImageUpload(e) {
    const files = [...e.target.files];
    for (const file of files) {
      const res = await uploadImage(file);
      if (res.url) {
        setForm(p => ({ ...p, images: [...p.images, { url: res.url, publicId: res.publicId }] }));
      }
    }
  }

  function removeImage(i) {
    setForm(p => ({ ...p, images: p.images.filter((_, j) => j !== i) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const specsObj = {};
    form.specs.forEach(({ key, value }) => { if (key) specsObj[key] = value; });

    const body = {
      ...form,
      price: form.price ? parseFloat(form.price) : undefined,
      specs: specsObj,
    };

    try {
      if (isEdit) {
        await fetch(`/api/products/${initialData._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        toast.success('Produit mis à jour');
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        toast.success('Produit créé');
      }
      router.push('/admin/produits');
    } catch (err) {
      toast.error('Une erreur est survenue');
    }
    setSaving(false);
  }

  const inputCls = "w-full px-4 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] transition-colors bg-[var(--card)]";
  const inputStyle = { borderColor: 'var(--border)', color: 'var(--foreground)' };
  const labelCls = "block text-xs font-medium mb-1.5";
  const labelStyle = { color: 'var(--foreground)' };

  return (
    <form onSubmit={handleSubmit} className="p-6 lg:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--foreground)' }}>
          {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
        </h1>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.back()} className="px-4 py-2.5 rounded-sm text-sm border transition-colors hover:bg-[var(--muted)]" style={{ borderColor: 'var(--border)' }}>
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white disabled:opacity-60"
            style={{ backgroundColor: 'var(--orange)' }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? 'Enregistrer' : 'Créer le produit'}
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Basic info */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-display font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>Informations générales</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>Nom *</label>
              <input required value={form.name} onChange={e => { set('name', e.target.value); set('slug', autoSlug(e.target.value)); }}
                className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Slug (URL)</label>
              <SlugInput value={form.slug} onChange={v => set('slug', v)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={labelStyle}>Catégorie</label>
                <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="">Sélectionner...</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Marque</label>
                <select value={form.brand} onChange={e => set('brand', e.target.value)} className={inputCls} style={inputStyle}>
                  <option value="">Sélectionner...</option>
                  {brands.map(b => <option key={b._id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Description courte (max 200 car.)</label>
              <textarea rows={3} maxLength={200} value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)}
                className={inputCls + ' resize-none'} style={inputStyle} />
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{form.shortDesc.length}/200</p>
            </div>
          </div>
        </section>

        {/* Long description */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-display font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>Description longue</h2>
          <RichTextEditor value={form.longDesc} onChange={v => set('longDesc', v)} />
        </section>

        {/* Images */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-display font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>Images</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {form.images.map((img, i) => (
              <div key={i} className="relative group w-24 h-24 rounded-sm overflow-hidden border border-[var(--border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} className="text-white" />
                </button>
                {i === 0 && <span className="absolute bottom-1 left-1 text-[10px] bg-[var(--orange)] text-white px-1.5 rounded-sm">Principal</span>}
              </div>
            ))}
            <label className="w-24 h-24 rounded-sm border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors hover:border-[var(--orange)]" style={{ borderColor: 'var(--border)' }}>
              {uploading ? <Loader2 size={20} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} /> : <ImagePlus size={20} style={{ color: 'var(--muted-foreground)' }} />}
              <span className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Ajouter</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </section>

        {/* Price & availability */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-display font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>Prix & disponibilité</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>Prix HT (€)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)}
                className={inputCls} style={inputStyle} placeholder="Laisser vide si NC" />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Disponibilité</label>
              <select value={form.availability} onChange={e => set('availability', e.target.value)} className={inputCls} style={inputStyle}>
                <option>En stock</option>
                <option>Sur commande</option>
              </select>
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>État</label>
              <select value={form.condition} onChange={e => set('condition', e.target.value)} className={inputCls} style={inputStyle}>
                <option value="">Non spécifié</option>
                <option>Neuf</option>
                <option>Comme neuf</option>
                <option>Bonne occasion</option>
                <option>Occasion</option>
              </select>
            </div>
            <div className="flex flex-col justify-end pb-1 gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.priceVisible} onChange={e => set('priceVisible', e.target.checked)} className="accent-[var(--orange)]" />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>Prix visible sur le site</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-[var(--orange)]" />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>Produit phare (accueil)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="accent-[var(--orange)]" />
                <span className="text-sm" style={{ color: 'var(--foreground)' }}>Publié</span>
              </label>
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-base" style={{ color: 'var(--foreground)' }}>Spécifications techniques</h2>
            <button type="button" onClick={addSpec} className="flex items-center gap-2 text-sm text-[var(--orange)] font-medium">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {form.specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  placeholder="Caractéristique (ex: Puissance)"
                  value={spec.key}
                  onChange={e => updateSpec(i, 'key', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-sm border outline-none focus:border-[var(--orange)] bg-[var(--card)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <input
                  placeholder="Valeur (ex: 11 kW)"
                  value={spec.value}
                  onChange={e => updateSpec(i, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-sm border outline-none focus:border-[var(--orange)] bg-[var(--card)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <button type="button" onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-500 p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* SEO */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-display font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>SEO</h2>
          <div className="grid gap-4">
            <div>
              <label className={labelCls} style={labelStyle}>Meta titre</label>
              <input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className={labelCls} style={labelStyle}>Meta description</label>
              <textarea rows={2} value={form.metaDesc} onChange={e => set('metaDesc', e.target.value)} className={inputCls + ' resize-none'} style={inputStyle} />
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
