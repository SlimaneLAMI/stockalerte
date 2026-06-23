'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/components/SettingsContext';

export default function HomepageLoader({ visible, progress, apiDone }) {
  const s = useSettings();
  const name = s.company_name || 'StockAlerte';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
          style={{ backgroundColor: '#0f0f0f' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="flex flex-col items-center gap-4 mb-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center font-display font-bold text-xl text-white"
              style={{ backgroundColor: 'var(--orange)' }}
            >
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-white tracking-tight">{name}</p>
              <p className="text-xs mt-1.5 uppercase tracking-[0.25em]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Équipements professionnels
              </p>
            </div>
          </motion.div>

          {/* Barre de progression */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div
              className="relative w-56 overflow-hidden rounded-full"
              style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.07)' }}
            >
              {!apiDone ? (
                /* Indéterminé : balayage pendant l'attente API */
                <motion.div
                  className="absolute top-0 h-full rounded-full"
                  style={{ width: '45%', backgroundColor: 'var(--orange)' }}
                  animate={{ left: ['-45%', '145%'] }}
                  transition={{ repeat: Infinity, duration: 1.15, ease: 'easeInOut' }}
                />
              ) : (
                /* Déterminé : remplissage progressif lors du chargement des images */
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ backgroundColor: 'var(--orange)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              )}
            </div>

            <p
              className="text-xs font-mono tabular-nums"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              {!apiDone ? 'Chargement…' : `${Math.round(progress)} %`}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
