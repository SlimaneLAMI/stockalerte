'use client';
import { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import { ACCENT_PRESETS, deriveShades } from '@/lib/accentColor';

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

export default function ParametresPage() {
  const [settings, setSettings] = useState({
    company_name: '', company_address: '', company_phone: '',
    company_email: '', company_hours: '', maps_url: '',
    logo_url: '', logo_initials: '', footer_text: '',
    social_facebook: '', social_instagram: '', social_linkedin: '',
    social_twitter: '', social_youtube: '', social_tiktok: '',
    social_whatsapp: '', social_snapchat: '', social_pinterest: '',
    show_prices: true,
    price_mode: 'HT',
    show_condition: true,
    color_orange: '#e05c2a',
    color_orange_light: '#f47c50',
    color_orange_dark: '#b84820',
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
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }).then(r => r.json());
    setSaving(false);
    if (res?.success) toast.success('Paramètres enregistrés');
    else toast.error('Erreur : ' + (res?.error || 'impossible de sauvegarder'));
  }

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-10 max-w-3xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="font-display font-bold text-2xl lg:text-3xl" style={{ color: 'var(--foreground)' }}>Paramètres du site</h1>
        <button type="submit" disabled={saving} className="flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: 'var(--orange)' }}>
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
            <label className={label} style={labelStyle}>Initiales du logo</label>
            <input
              value={settings.logo_initials}
              onChange={e => setSettings(p => ({ ...p, logo_initials: e.target.value.slice(0, 3).toUpperCase() }))}
              className={inp}
              style={inpStyle}
              placeholder="ST"
              maxLength={3}
            />
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
              1 à 3 caractères affichés dans le carré orange. Si vide, les 2 premières lettres du nom sont utilisées.
            </p>
          </div>
          <div>
            <label className={label} style={labelStyle}>Logo (remplace le carré coloré)</label>
            <div className="max-w-[160px]">
              <CloudinaryUpload
                value={settings.logo_url}
                onChange={v => setSettings(p => ({ ...p, logo_url: v }))}
                folder="StockAlerte/logo"
                label="Logo"
                aspectRatio="1/1"
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
              Idéalement carré (ex. 64×64 px). Si vide, le carré orange avec les initiales s'affiche.
            </p>
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
            <input value={settings.maps_url} onChange={e => setSettings(p => ({ ...p, maps_url: e.target.value }))} className={inp} style={inpStyle} placeholder="https://www.google.com/maps/embed?pb=..." />
            <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
              Sur Google Maps : <strong>Partager</strong> → <strong>Intégrer une carte</strong> → copier uniquement la valeur du <code>src</code> (commence par <code>https://www.google.com/maps/embed?pb=</code>)
            </p>
            {settings.maps_url && !settings.maps_url.includes('maps/embed') && (
              <p className="text-xs mt-1 font-medium" style={{ color: '#e05c2a' }}>
                ⚠️ Cette URL ne semble pas être une URL embed — elle ne s'affichera pas dans l'iframe.
              </p>
            )}
          </div>
        </Section>

        <Section title="Réseaux sociaux">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={label} style={labelStyle}>Facebook</label>
              <input value={settings.social_facebook} onChange={e => setSettings(p => ({ ...p, social_facebook: e.target.value }))} className={inp} style={inpStyle} placeholder="https://facebook.com/..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>Instagram</label>
              <input value={settings.social_instagram} onChange={e => setSettings(p => ({ ...p, social_instagram: e.target.value }))} className={inp} style={inpStyle} placeholder="https://instagram.com/..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>LinkedIn</label>
              <input value={settings.social_linkedin} onChange={e => setSettings(p => ({ ...p, social_linkedin: e.target.value }))} className={inp} style={inpStyle} placeholder="https://linkedin.com/company/..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>X (Twitter)</label>
              <input value={settings.social_twitter} onChange={e => setSettings(p => ({ ...p, social_twitter: e.target.value }))} className={inp} style={inpStyle} placeholder="https://x.com/..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>YouTube</label>
              <input value={settings.social_youtube} onChange={e => setSettings(p => ({ ...p, social_youtube: e.target.value }))} className={inp} style={inpStyle} placeholder="https://youtube.com/@..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>TikTok</label>
              <input value={settings.social_tiktok} onChange={e => setSettings(p => ({ ...p, social_tiktok: e.target.value }))} className={inp} style={inpStyle} placeholder="https://tiktok.com/@..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>WhatsApp</label>
              <input value={settings.social_whatsapp} onChange={e => setSettings(p => ({ ...p, social_whatsapp: e.target.value }))} className={inp} style={inpStyle} placeholder="https://wa.me/213..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>Snapchat</label>
              <input value={settings.social_snapchat} onChange={e => setSettings(p => ({ ...p, social_snapchat: e.target.value }))} className={inp} style={inpStyle} placeholder="https://snapchat.com/add/..." />
            </div>
            <div>
              <label className={label} style={labelStyle}>Pinterest</label>
              <input value={settings.social_pinterest} onChange={e => setSettings(p => ({ ...p, social_pinterest: e.target.value }))} className={inp} style={inpStyle} placeholder="https://pinterest.com/..." />
            </div>
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

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.show_condition !== false}
              onChange={e => setSettings(p => ({ ...p, show_condition: e.target.checked }))}
              className="accent-[var(--orange)]"
            />
            <span className="text-sm" style={{ color: 'var(--foreground)' }}>Afficher l'état des articles (Neuf, Comme neuf, Occasion…)</span>
          </label>

          <div>
            <p className={label} style={labelStyle}>Affichage des prix</p>
            <div className="flex gap-4 mt-1">
              {['HT', 'TTC'].map(mode => (
                <label key={mode} className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="price_mode"
                    value={mode}
                    checked={settings.price_mode === mode}
                    onChange={() => setSettings(p => ({ ...p, price_mode: mode }))}
                    className="accent-[var(--orange)]"
                  />
                  <span className="text-sm" style={{ color: 'var(--foreground)' }}>
                    Prix {mode} <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>({mode === 'HT' ? 'hors taxe' : 'toutes taxes comprises'})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Pied de page">
          <div>
            <label className={label} style={labelStyle}>Texte copyright</label>
            <input value={settings.footer_text} onChange={e => setSettings(p => ({ ...p, footer_text: e.target.value }))} className={inp} style={inpStyle} />
          </div>
        </Section>

        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-display font-bold text-base mb-1" style={{ color: 'var(--foreground)' }}>Couleur principale</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>
            Utilisée pour les boutons, liens, icônes et accents partout dans l'application.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-3">
              {ACCENT_PRESETS.map(preset => {
                const active = settings.color_orange === preset.main;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setSettings(p => ({ ...p, color_orange: preset.main, color_orange_light: preset.light, color_orange_dark: preset.dark }))}
                    className="flex flex-col items-center gap-2 p-3 rounded-sm border-2 transition-all"
                    style={{ borderColor: active ? preset.main : 'var(--border)', backgroundColor: active ? preset.main + '10' : 'transparent' }}
                  >
                    <span
                      className="w-10 h-10 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: preset.main }}
                    >
                      {active && <Check size={16} className="text-white" />}
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>{preset.name}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className={label} style={labelStyle}>Couleur personnalisée</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.color_orange}
                  onChange={e => {
                    const { main, light, dark } = deriveShades(e.target.value);
                    setSettings(p => ({ ...p, color_orange: main, color_orange_light: light, color_orange_dark: dark }));
                  }}
                  className="w-10 h-10 rounded-sm border cursor-pointer p-0.5 bg-transparent"
                  style={{ borderColor: 'var(--border)' }}
                />
                <span className="text-sm font-mono" style={{ color: 'var(--muted-foreground)' }}>{settings.color_orange}</span>
                <div className="flex gap-2 ml-2">
                  <span className="w-6 h-6 rounded-sm" style={{ backgroundColor: settings.color_orange }} title="Principal" />
                  <span className="w-6 h-6 rounded-sm" style={{ backgroundColor: settings.color_orange_light }} title="Clair" />
                  <span className="w-6 h-6 rounded-sm" style={{ backgroundColor: settings.color_orange_dark }} title="Foncé" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </form>
  );
}
