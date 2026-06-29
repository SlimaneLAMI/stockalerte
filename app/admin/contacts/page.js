'use client';
import { useEffect, useState } from 'react';
import { Mail, MailOpen, Archive, ArchiveX, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('actifs');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  async function load(t = tab) {
    setLoading(true);
    const url = t === 'archives' ? '/api/contacts?archived=true' : '/api/contacts';
    const data = await fetch(url).then(r => r.json());
    setContacts(data.contacts || []);
    setSelected(null);
    setLoading(false);
  }

  useEffect(() => { load(tab); }, [tab]);

  async function markRead(id, read) {
    await fetch(`/api/contacts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ read }) });
    setContacts(p => p.map(c => c._id === id ? { ...c, read } : c));
  }

  async function archive(id) {
    await fetch(`/api/contacts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: true }) });
    setContacts(p => p.filter(c => c._id !== id));
    setSelected(null);
    toast.success('Archivé');
  }

  async function unarchive(id) {
    await fetch(`/api/contacts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archived: false }) });
    setContacts(p => p.filter(c => c._id !== id));
    setSelected(null);
    toast.success('Désarchivé');
  }

  async function handleDelete(id) {
    await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    setContacts(p => p.filter(c => c._id !== id));
    setSelected(null);
    toast.success('Supprimé');
  }

  function openContact(contact) {
    setSelected(contact);
    if (!contact.read && tab === 'actifs') markRead(contact._id, true);
  }

  const unreadCount = contacts.filter(c => !c.read).length;

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl lg:text-3xl" style={{ color: 'var(--foreground)' }}>Demandes de contact</h1>
        {tab === 'actifs' && (
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {unreadCount} non lue(s)
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
        {[{ key: 'actifs', label: 'Actifs' }, { key: 'archives', label: 'Archives' }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="px-4 py-2 text-sm font-medium transition-colors"
            style={{
              color: tab === key ? 'var(--orange)' : 'var(--muted-foreground)',
              borderBottom: tab === key ? '2px solid var(--orange)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 rounded-sm border border-[var(--border)] overflow-hidden">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 py-4 border-b border-[var(--border)] animate-pulse">
                <div className="h-3 rounded bg-[var(--muted)] w-3/4 mb-2" />
                <div className="h-3 rounded bg-[var(--muted)] w-1/2" />
              </div>
            ))
          ) : contacts.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: 'var(--muted-foreground)' }}>
              {tab === 'archives' ? 'Aucun message archivé.' : 'Aucune demande.'}
            </p>
          ) : (
            contacts.map(contact => (
              <button
                key={contact._id}
                onClick={() => openContact(contact)}
                className={`w-full text-left px-4 py-4 border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors ${
                  selected?._id === contact._id ? 'bg-[var(--muted)]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {contact.read
                      ? <MailOpen size={15} style={{ color: 'var(--muted-foreground)' }} />
                      : <Mail size={15} style={{ color: 'var(--orange)' }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${!contact.read ? 'font-semibold' : 'font-medium'}`} style={{ color: 'var(--foreground)' }}>
                        {contact.name}
                      </p>
                      <p className="text-xs shrink-0" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(contact.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{contact.message}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-sm border border-[var(--border)] p-6 bg-[var(--card)]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl" style={{ color: 'var(--foreground)' }}>{selected.name}</h2>
                  {selected.company && <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{selected.company}</p>}
                </div>
                <button onClick={() => setSelected(null)} className="p-1">
                  <X size={18} style={{ color: 'var(--muted-foreground)' }} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Email</p>
                  <a href={`mailto:${selected.email}`} className="font-medium transition-colors hover:text-[var(--orange)]" style={{ color: 'var(--foreground)' }}>{selected.email}</a>
                </div>
                {selected.phone && (
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Téléphone</p>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{selected.phone}</p>
                  </div>
                )}
                {selected.productInterest && (
                  <div className="col-span-2">
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Produit concerné</p>
                    <p className="font-medium" style={{ color: 'var(--foreground)' }}>{selected.productInterest}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Date</p>
                  <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                    {new Date(selected.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-sm mb-6" style={{ backgroundColor: 'var(--muted)' }}>
                <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)' }}>Message</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--foreground)' }}>{selected.message}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: Votre demande&body=Bonjour ${selected.name},%0A%0A`}
                  className="flex-1 min-w-0 flex items-center justify-center gap-2 py-2.5 px-3 rounded-sm text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--orange)' }}
                >
                  <Mail size={14} className="shrink-0" /> <span className="truncate">Répondre par email</span>
                </a>
                {tab === 'actifs' ? (
                  <button onClick={() => archive(selected._id)} className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm border transition-colors hover:bg-[var(--muted)]" style={{ borderColor: 'var(--border)' }}>
                    <Archive size={14} /> Archiver
                  </button>
                ) : (
                  <button onClick={() => unarchive(selected._id)} className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-sm border transition-colors hover:bg-[var(--muted)]" style={{ borderColor: 'var(--border)' }}>
                    <ArchiveX size={14} /> Désarchiver
                  </button>
                )}
                <button onClick={() => setDeleteConfirm(true)} className="flex items-center justify-center w-10 h-10 rounded-sm border border-red-200 text-red-400 hover:bg-red-50 transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 rounded-sm border border-dashed border-[var(--border)]">
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Sélectionnez une demande pour l'afficher</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-[var(--background)] rounded-sm p-8 max-w-sm w-full shadow-2xl">
            <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>Supprimer ce contact ?</p>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => { handleDelete(selected._id); setDeleteConfirm(false); }} className="flex-1 py-2.5 rounded-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">
                Supprimer
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2.5 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]" style={{ borderColor: 'var(--border)' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}