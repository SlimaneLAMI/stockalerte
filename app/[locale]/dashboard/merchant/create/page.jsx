'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ImageUpload from '@/components/ui/ImageUpload';
import { Loader2, Plus, X, Store, CalendarCheck, Truck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const TYPES = [
  { value: 'promotion',  label: 'Promotion' },
  { value: 'sale',       label: 'Solde' },
  { value: 'pack',       label: 'Pack' },
  { value: 'anti-waste', label: 'Anti-gaspillage' },
  { value: 'donation',   label: 'Don' },
];

export default function CreateOfferPage() {
  const { data: session } = useSession();
  const router  = useRouter();
  const locale  = useLocale();
  const [loading, setLoading] = useState(false);
  const [images, setImages]   = useState([]);

  const [form, setForm] = useState({
    title: '', description: '', type: 'promotion',
    originalPrice: '', discountPrice: '',
    quantity: '', unit: 'unité',
    expiresAt: '', startsAt: new Date().toISOString().split('T')[0],
    tags: '',
    deliveryOptions: { pickup: true, reservation: false, delivery: false },
  });

  function updateField(field, value) { setForm((f) => ({ ...f, [field]: value })); }
  function toggleDelivery(key) {
    setForm((f) => ({ ...f, deliveryOptions: { ...f.deliveryOptions, [key]: !f.deliveryOptions[key] } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.expiresAt) { toast.error('Titre et date d\'expiration obligatoires'); return; }

    setLoading(true);
    try {
      await axios.post('/api/offers', {
        ...form,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        discountPrice: form.discountPrice  ? parseFloat(form.discountPrice)  : undefined,
        quantity:      form.quantity        ? parseInt(form.quantity)         : undefined,
        images,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      });
      toast.success('Offre créée avec succès !');
      router.push(`/${locale}/dashboard/merchant/offers`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Créer une offre</h1>
          <p className="text-gray-500 text-sm mt-1">Publiez votre offre pour toucher plus de clients</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Informations générales</h2>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Titre de l'offre *</label>
              <input type="text" required value={form.title} onChange={(e) => updateField('title', e.target.value)} className="input" placeholder="Ex: Lot de yaourts à -40%" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Type d'offre</label>
              <div className="flex flex-wrap gap-2">
                {TYPES.map(({ value, label }) => (
                  <button key={value} type="button"
                    onClick={() => updateField('type', value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${form.type === value ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} className="input resize-none" placeholder="Décrivez votre offre..." />
            </div>
          </div>

          {/* Pricing */}
          {form.type !== 'donation' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">Prix</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Prix d'origine (DA)</label>
                  <input type="number" min="0" value={form.originalPrice} onChange={(e) => updateField('originalPrice', e.target.value)} className="input" placeholder="0" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Prix remisé (DA)</label>
                  <input type="number" min="0" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} className="input" placeholder="0" />
                </div>
              </div>
              {form.originalPrice && form.discountPrice && parseFloat(form.originalPrice) > 0 && (
                <p className="text-sm text-green-600 font-medium">
                  → Réduction : {Math.round(((parseFloat(form.originalPrice) - parseFloat(form.discountPrice)) / parseFloat(form.originalPrice)) * 100)}%
                </p>
              )}
            </div>
          )}

          {/* Stock & dates */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Stock & dates</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Quantité disponible</label>
                <input type="number" min="0" value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)} className="input" placeholder="Ex: 20" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Unité</label>
                <input type="text" value={form.unit} onChange={(e) => updateField('unit', e.target.value)} className="input" placeholder="unité, kg, litre..." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Date de début</label>
                <input type="date" value={form.startsAt} onChange={(e) => updateField('startsAt', e.target.value)} className="input" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Date d'expiration *</label>
                <input type="date" required value={form.expiresAt} onChange={(e) => updateField('expiresAt', e.target.value)} className="input" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-full h-32 object-cover rounded-xl" />
                  <button type="button" onClick={() => setImages((imgs) => imgs.filter((_, j) => j !== i))}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <ImageUpload
                  value=""
                  onChange={(url) => url && setImages((imgs) => [...imgs, url])}
                  folder="stockalerte/offers"
                />
              )}
            </div>
          </div>

          {/* Delivery options */}
          <div className="card p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Modes de retrait</h2>
              <p className="text-xs text-gray-400 mt-1">Choisissez comment les clients peuvent obtenir ce produit</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'pickup', icon: Store, label: 'Sur place', desc: 'Le client se déplace en boutique' },
                { key: 'reservation', icon: CalendarCheck, label: 'Réservation', desc: 'Le client réserve, retire plus tard' },
                { key: 'delivery', icon: Truck, label: 'Livraison', desc: 'Vous livrez chez le client' },
              ].map(({ key, icon: Icon, label, desc }) => {
                const active = form.deliveryOptions[key];
                return (
                  <button key={key} type="button" onClick={() => toggleDelivery(key)}
                    className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${active ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${active ? 'text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}`}>{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Tags (séparés par des virgules)</label>
            <input type="text" value={form.tags} onChange={(e) => updateField('tags', e.target.value)} className="input" placeholder="dattes, promotion, local..." />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Publier l'offre
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
