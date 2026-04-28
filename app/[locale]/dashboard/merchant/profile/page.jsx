'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ImageUpload from '@/components/ui/ImageUpload';
import { Loader2, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const WILAYAS = [
  'Adrar','Chlef','Laghouat','Oum El Bouaghi','Batna','Béjaïa','Biskra','Béchar',
  'Blida','Bouira','Tamanrasset','Tébessa','Tlemcen','Tiaret','Tizi Ouzou','Alger',
  'Djelfa','Jijel','Sétif','Saïda','Skikda','Sidi Bel Abbès','Annaba','Guelma',
  'Constantine','Médéa','Mostaganem','M\'Sila','Mascara','Ouargla','Oran','El Bayadh',
  'Illizi','Bordj Bou Arréridj','Boumerdès','El Tarf','Tindouf','Tissemsilt','El Oued',
  'Khenchela','Souk Ahras','Tipaza','Mila','Aïn Defla','Naâma','Aïn Témouchent',
  'Ghardaïa','Relizane',
];

export default function MerchantProfilePage() {
  const { data: session } = useSession();
  const locale            = useLocale();
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [merchantId, setMerchantId] = useState(null);

  const [form, setForm] = useState({
    businessName: '', description: '', phone: '',
    logo: '', coverImage: '',
    address: { street: '', commune: '', wilaya: '' },
    website: '',
  });

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    try {
      const { data } = await axios.get('/api/merchants/me');
      const m = data.merchant;
      setMerchantId(m._id);
      setForm({
        businessName: m.businessName || '',
        description:  m.description  || '',
        phone:        m.phone        || '',
        logo:         m.logo         || '',
        coverImage:   m.coverImage   || '',
        address:      m.address      || { street: '', commune: '', wilaya: '' },
        website:      m.website      || '',
      });
    } catch {
      // no profile yet — will create on save
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (merchantId) {
        await axios.patch(`/api/merchants/${merchantId}`, form);
      } else {
        await axios.post('/api/merchants', form);
      }
      toast.success('Profil enregistré avec succès');
      await fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  function updateAddress(field, val) {
    setForm((f) => ({ ...f, address: { ...f.address, [field]: val } }));
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon profil commerce</h1>
          <p className="text-gray-500 text-sm mt-1">Informations visibles par vos clients</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover & logo */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Images</h2>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Logo</label>
              <ImageUpload value={form.logo} onChange={(url) => setForm((f) => ({ ...f, logo: url }))} folder="stockalerte/logos" className="max-w-xs" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Image de couverture</label>
              <ImageUpload value={form.coverImage} onChange={(url) => setForm((f) => ({ ...f, coverImage: url }))} folder="stockalerte/covers" />
            </div>
          </div>

          {/* Info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Informations</h2>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Nom du commerce *</label>
              <input type="text" required value={form.businessName} onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))} className="input" placeholder="Ex: Boulangerie El Baraka" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input resize-none" placeholder="Décrivez votre activité..." maxLength={1000} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Téléphone *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input" placeholder="0555 123 456" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Site web</label>
              <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} className="input" placeholder="https://..." />
            </div>
          </div>

          {/* Address */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Adresse</h2>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Wilaya *</label>
              <select value={form.address.wilaya} onChange={(e) => updateAddress('wilaya', e.target.value)} className="input">
                <option value="">Sélectionner une wilaya</option>
                {WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Commune</label>
              <input type="text" value={form.address.commune} onChange={(e) => updateAddress('commune', e.target.value)} className="input" placeholder="Ex: Bab El Oued" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">Rue / Adresse précise</label>
              <input type="text" value={form.address.street} onChange={(e) => updateAddress('street', e.target.value)} className="input" placeholder="Ex: 12 Rue Didouche Mourad" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
