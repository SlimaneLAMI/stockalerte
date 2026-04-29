'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Store, CalendarCheck, Truck, User, MapPin, Phone, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OfferActionPanel({ offerId, deliveryOptions = {} }) {
  const t = useTranslations('action');

  const MODES = [
    { key: 'pickup',      icon: Store,         label: t('mode_pickup_label'),      desc: t('mode_pickup_desc'),      optionKey: 'pickup' },
    { key: 'reservation', icon: CalendarCheck, label: t('mode_reservation_label'), desc: t('mode_reservation_desc'), optionKey: 'reservation' },
    { key: 'delivery',    icon: Truck,         label: t('mode_delivery_label'),     desc: t('mode_delivery_desc'),    optionKey: 'delivery' },
  ];

  const reallyAvailable = MODES.filter((m) => deliveryOptions[m.optionKey]);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', city: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (reallyAvailable.length === 0) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.city || !form.phone) {
      toast.error(t('required_fields_error'));
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/reservations', {
        offerId,
        type: selected,
        clientName: form.name,
        clientCity: form.city,
        clientPhone: form.phone,
        notes: form.notes,
      });
      setDone(true);
      toast.success(t('sent_toast'));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card p-6 text-center">
        <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-primary-600" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-1">{t('sent_title')}</h3>
        <p className="text-sm text-gray-500">{t('sent_desc')}</p>
      </div>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <h3 className="font-semibold text-gray-900 dark:text-white">{t('how_to_get')}</h3>

      {/* Mode selection */}
      <div className="space-y-2">
        {reallyAvailable.map(({ key, icon: Icon, label, desc }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${
              selected === key
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              selected === key ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${selected === key ? 'text-primary-700 dark:text-primary-400' : 'text-gray-800 dark:text-gray-200'}`}>
                {label}
              </p>
              <p className="text-xs text-gray-400 truncate">{desc}</p>
            </div>
            <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${selected === key ? 'text-primary-500 translate-x-0.5' : 'text-gray-300'}`} />
          </button>
        ))}
      </div>

      {/* Contact form */}
      {selected && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{t('your_info')}</p>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder={t('full_name')}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="input pl-9 text-sm"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              placeholder={t('city_label')}
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="input pl-9 text-sm"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              required
              placeholder={t('phone_label')}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="input pl-9 text-sm"
            />
          </div>
          <textarea
            rows={2}
            placeholder={t('message_label')}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="input resize-none text-sm"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {t('submit')}
          </button>
        </form>
      )}
    </div>
  );
}
