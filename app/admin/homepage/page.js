'use client';
import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import { WHY_US_ICONS, getIcon } from '@/lib/whyUsIcons';

function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIcon(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-sm border w-full outline-none transition-colors hover:border-[var(--orange)]"
        style={{ borderColor: 'var(--border)', color: 'var(--foreground)', backgroundColor: 'var(--card)' }}
      >
        {SelectedIcon
          ? <SelectedIcon size={16} style={{ color: 'var(--orange)' }} />
          : <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: 'var(--muted)' }} />
        }
        <span className="flex-1 text-left text-xs" style={{ color: SelectedIcon ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
          {value ? (WHY_US_ICONS.find(i => i.key === value)?.label ?? value) : 'Choisir une icône'}
        </span>
        <ChevronDown size={13} style={{ color: 'var(--muted-foreground)' }} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 left-0 right-0 rounded-sm border shadow-lg overflow-y-auto"
          style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', maxHeight: 260 }}
        >
          <div className="grid grid-cols-6 gap-1 p-2">
            {WHY_US_ICONS.map(({ key, label, Icon }) => {
              const active = value === key;
              return (
                <button
                  key={key}
                  type="button"
                  title={label}
                  onClick={() => { onChange(key); setOpen(false); }}
                  className="flex flex-col items-center gap-1 p-2 rounded-sm transition-colors"
                  style={{
                    backgroundColor: active ? 'rgba(224,92,42,0.1)' : 'transparent',
                    border: active ? '1px solid var(--orange)' : '1px solid transparent',
                  }}
                >
                  <Icon size={17} style={{ color: active ? 'var(--orange)' : 'var(--muted-foreground)' }} />
                  <span className="text-[9px] truncate w-full text-center" style={{ color: 'var(--muted-foreground)' }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomepageAdminPage() {
  const [settings, setSettings] = useState({
    hero_title: '', hero_subtitle: '', hero_cta: '', hero_image: '',
    why_us: [{ icon: '', title: '', text: '' }],
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
    if (res?.success) toast.success('Page d\'accueil mise à jour');
    else toast.error('Erreur : ' + (res?.error || 'impossible de sauvegarder'));
  }

  function updateWhyUs(i, field, val) {
    setSettings(p => {
      const arr = [...p.why_us];
      arr[i] = { ...arr[i], [field]: val };
      return { ...p, why_us: arr };
    });
  }

  const inp = "w-full px-3 py-2.5 text-sm rounded-sm border outline-none focus:border-[var(--orange)] bg-[var(--card)]";
  const inpStyle = { borderColor: 'var(--border)', color: 'var(--foreground)' };
  const label = "block text-xs font-medium mb-1.5";
  const labelStyle = { color: 'var(--foreground)' };

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-10 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl" style={{ color: 'var(--foreground)' }}>Page d'accueil</h1>
        <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: 'var(--orange)' }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          Enregistrer
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Hero section */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-display font-bold text-base mb-5" style={{ color: 'var(--foreground)' }}>Section Hero</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={label} style={labelStyle}>Titre principal</label>
              <input value={settings.hero_title} onChange={e => setSettings(p => ({ ...p, hero_title: e.target.value }))} className={inp} style={inpStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Sous-titre</label>
              <textarea rows={2} value={settings.hero_subtitle} onChange={e => setSettings(p => ({ ...p, hero_subtitle: e.target.value }))} className={inp + ' resize-none'} style={inpStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Texte du bouton CTA</label>
              <input value={settings.hero_cta} onChange={e => setSettings(p => ({ ...p, hero_cta: e.target.value }))} className={inp} style={inpStyle} />
            </div>
            <div>
              <label className={label} style={labelStyle}>Image de fond</label>
              <CloudinaryUpload
                value={settings.hero_image}
                onChange={url => setSettings(p => ({ ...p, hero_image: url }))}
                folder="StockAlerte/homepage"
                label="Image de fond hero"
                aspectRatio="16/5"
              />
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="p-6 rounded-sm border border-[var(--border)] bg-[var(--card)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-base" style={{ color: 'var(--foreground)' }}>
                Pourquoi nous choisir
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Chaque bloc affiche une icône SVG, un titre et un texte descriptif.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings(p => ({ ...p, why_us: [...(p.why_us || []), { icon: '', title: '', text: '' }] }))}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: 'var(--orange)' }}
            >
              <Plus size={14} /> Ajouter
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {(settings.why_us || []).map((item, i) => {
              const PreviewIcon = getIcon(item.icon);
              return (
                <div key={i} className="p-4 rounded-sm border border-[var(--border)] relative">
                  <button
                    type="button"
                    onClick={() => setSettings(p => ({ ...p, why_us: p.why_us.filter((_, j) => j !== i) }))}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="grid sm:grid-cols-5 gap-3 mb-3">
                    <div>
                      <label className={label} style={labelStyle}>Icône</label>
                      <IconPicker value={item.icon} onChange={val => updateWhyUs(i, 'icon', val)} />
                    </div>
                    <div className="sm:col-span-4">
                      <label className={label} style={labelStyle}>Titre</label>
                      <input value={item.title} onChange={e => updateWhyUs(i, 'title', e.target.value)} className={inp} style={inpStyle} />
                    </div>
                    <div className="sm:col-span-5">
                      <label className={label} style={labelStyle}>Texte</label>
                      <textarea rows={2} value={item.text} onChange={e => updateWhyUs(i, 'text', e.target.value)} className={inp + ' resize-none'} style={inpStyle} />
                    </div>
                  </div>

                  {/* Aperçu */}
                  {(PreviewIcon || item.title) && (
                    <div className="flex items-start gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                      {PreviewIcon && (
                        <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(224,92,42,0.1)' }}>
                          <PreviewIcon size={20} style={{ color: 'var(--orange)' }} />
                        </div>
                      )}
                      <div>
                        {item.title && <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.title}</p>}
                        {item.text  && <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>{item.text}</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </form>
  );
}
