'use client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    company_name: '', company_address: '', company_phone: '',
    company_email: '', company_hours: '', maps_url: '',
    footer_text: '', contact_notification_email: '',
    social_linkedin: '', social_instagram: '',
    show_prices: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(data => {
      setSettings(prev => ({ ...prev, ...data }));
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    toast.success('Paramètres enregistrés');
  }

  const inp = "w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] bg-[var(--card)]";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--foreground)' };
  const label = "block text-xs font-medium mb-1.5";
  const labelStyle = { color: 'var(--foreground)' };

  function Section({ title, children }) {
    return (
      <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
        <h2 className="font-display font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>{title}</h2>
        <div className="flex flex-col gap-4">{children}</div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--foreground)' }}>Paramètres du site</h1>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: 'var(--orange)' }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          Enregistrer
        </button>
      </div>

      <div className="flex flex-col gap-8">
        <Section title="Informations de l'entreprise">
          <div>
            <label className={label} style={labelStyle}>Nom de l'entreprise</label>
            <input value={settings.company_name} onChange={e => setSettings(p => ({ ...p, company_name: e.target.value }))} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className={label} style={labelStyle}>Adresse</label>
            <textarea rows={2} value={settings.company_address} onChange={e => setSettings(p => ({ ...p, company_address: e.target.value }))} className={inp + ' resize-none'} style={inpStyle} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Téléphone</label>
              <input value={settings.company_phone} onChange={e => setSettings(p => ({ ...p, company_phone: e.target.value }))} className={inp} style={inpStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Email</label>
              <input type="email" value={settings.company_email} onChange={e => setSettings(p => ({ ...p, company_email: e.target.value }))} className={inp} style={inpStyle} />
            </div>
          </div>
          <div>
            <label className={label} style={labelStyle}>Horaires</label>
            <input value={settings.company_hours} onChange={e => setSettings(p => ({ ...p, company_hours: e.target.value }))} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className={label} style={labelStyle}>URL Google Maps embed</label>
            <input value={settings.maps_url} onChange={e => setSettings(p => ({ ...p, maps_url: e.target.value }))} className={inp} style={inpStyle} />
          </div>
        </Section>

        <Section title="Réseaux sociaux">
          <div>
            <label className={label} style={labelStyle}>LinkedIn (URL)</label>
            <input value={settings.social_linkedin} onChange={e => setSettings(p => ({ ...p, social_linkedin: e.target.value }))} className={inp} style={inpStyle} placeholder="https://linkedin.com/company/..." />
          </div>
          <div>
            <label className={label} style={labelStyle}>Instagram (URL)</label>
            <input value={settings.social_instagram} onChange={e => setSettings(p => ({ ...p, social_instagram: e.target.value }))} className={inp} style={inpStyle} placeholder="https://instagram.com/..." />
          </div>
        </Section>

        <Section title="Configuration catalogue">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={!!settings.show_prices}
              onChange={e => setSettings(p => ({ ...p, show_prices: e.target.checked }))}
              className="accent-[var(--orange)]"
            />
            <span className="text-sm" style={{ color: 'var(--foreground)' }}>Afficher les prix sur le catalogue public</span>
          </label>
        </Section>

        <Section title="Pied de page">
          <div>
            <label className={label} style={labelStyle}>Texte copyright</label>
            <input value={settings.footer_text} onChange={e => setSettings(p => ({ ...p, footer_text: e.target.value }))} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className={label} style={labelStyle}>Email de notification pour les contacts</label>
            <input type="email" value={settings.contact_notification_email} onChange={e => setSettings(p => ({ ...p, contact_notification_email: e.target.value }))} className={inp} style={inpStyle} />
          </div>
        </Section>

        {/* Seed button */}
        <section className="p-6 rounded-sm border border-dashed border-[var(--border)]">
          <h2 className="font-display font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>Données de démonstration</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Peupler la base de données avec 3 catégories, 5 marques et 8 produits de démonstration. ⚠️ Efface les données existantes.
          </p>
          <button
            type="button"
            onClick={async () => {
              if (!confirm('Effacer toutes les données et réinitialiser la démo ?')) return;
              const res = await fetch('/api/seed', { method: 'POST' }).then(r => r.json());
              toast.success(res.message || 'Base de données initialisée');
            }}
            className="px-5 py-2.5 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Initialiser la démo
          </button>
        </section>
      </div>
    </form>
  );
}
