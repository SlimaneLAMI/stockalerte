'use client';
import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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

const DEFAULT = {
  about_subtitle: 'Notre histoire',
  about_title: 'À propos',
  about_paragraphs: [
    { title: '', content: '' },
    { title: '', content: '' },
    { title: '', content: '' },
  ],
};

function normalizeParagraphs(raw) {
  if (!raw?.length) return DEFAULT.about_paragraphs;
  return raw.map(p => typeof p === 'string' ? { title: '', content: p } : p);
}

export default function AProposAdminPage() {
  const [data, setData] = useState(DEFAULT);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(s => {
      setData({
        about_subtitle: s.about_subtitle || DEFAULT.about_subtitle,
        about_title: s.about_title || DEFAULT.about_title,
        about_paragraphs: normalizeParagraphs(s.about_paragraphs),
      });
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
    setSaving(false);
    if (res?.success) toast.success('Page À propos enregistrée');
    else toast.error('Erreur : ' + (res?.error || 'impossible de sauvegarder'));
  }

  function setParagraph(i, field, val) {
    setData(p => {
      const paragraphs = [...p.about_paragraphs];
      paragraphs[i] = { ...paragraphs[i], [field]: val };
      return { ...p, about_paragraphs: paragraphs };
    });
  }

  function addParagraph() {
    setData(p => ({ ...p, about_paragraphs: [...p.about_paragraphs, { title: '', content: '' }] }));
  }

  function removeParagraph(i) {
    setData(p => ({ ...p, about_paragraphs: p.about_paragraphs.filter((_, j) => j !== i) }));
  }

  return (
    <form onSubmit={handleSave} className="p-6 lg:p-10 max-w-3xl">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-2xl lg:text-3xl" style={{ color: 'var(--foreground)' }}>Page À propos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Contenu affiché sur la page publique /a-propos</p>
        </div>
        <button type="submit" disabled={saving} className="flex shrink-0 items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium text-white disabled:opacity-60" style={{ backgroundColor: 'var(--orange)' }}>
          {saving && <Loader2 size={14} className="animate-spin" />}
          Enregistrer
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {/* En-tête */}
        <Section title="En-tête de la page">
          <div>
            <label className={label} style={labelStyle}>Sous-titre (ex : Notre histoire)</label>
            <input value={data.about_subtitle} onChange={e => setData(p => ({ ...p, about_subtitle: e.target.value }))} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className={label} style={labelStyle}>Titre principal</label>
            <input value={data.about_title} onChange={e => setData(p => ({ ...p, about_title: e.target.value }))} className={inp} style={inpStyle} />
          </div>
        </Section>

        {/* Paragraphes */}
        <Section title="Contenu">
          {data.about_paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <label className={label} style={labelStyle}>
                    Titre du paragraphe {i + 1} <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>(optionnel)</span>
                  </label>
                  <input
                    value={p.title || ''}
                    onChange={e => setParagraph(i, 'title', e.target.value)}
                    className={inp}
                    style={inpStyle}
                    placeholder="Ex : Notre mission"
                  />
                </div>
                <div>
                  <label className={label} style={labelStyle}>Contenu</label>
                  <textarea
                    rows={4}
                    value={p.content || ''}
                    onChange={e => setParagraph(i, 'content', e.target.value)}
                    className={inp + ' resize-y'}
                    style={inpStyle}
                    placeholder="Le texte du paragraphe… Entrée pour aller à la ligne."
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    Entourez un mot de <code className="px-1 rounded" style={{ backgroundColor: 'var(--muted)' }}>**</code> pour le mettre en gras — ex : <code className="px-1 rounded" style={{ backgroundColor: 'var(--muted)' }}>**mot important**</code>
                  </p>
                </div>
              </div>
              {data.about_paragraphs.length > 1 && (
                <button type="button" onClick={() => removeParagraph(i)} className="mt-6 p-2 rounded-sm transition-colors hover:bg-red-50" style={{ color: '#ef4444' }}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--orange)] self-start"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <Plus size={14} /> Ajouter un paragraphe
          </button>
        </Section>

      </div>
    </form>
  );
}
