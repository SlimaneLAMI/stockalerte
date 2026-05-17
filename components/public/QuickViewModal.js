'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ExternalLink } from 'lucide-react';

export default function QuickViewModal({ product, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const images = product?.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' }];

  const specEntries = product?.specs ? Object.entries(
    product.specs instanceof Map ? Object.fromEntries(product.specs) : product.specs
  ).slice(0, 4) : [];

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl"
            style={{ backgroundColor: 'var(--background)' }}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[var(--muted)] hover:bg-[var(--border)] transition-colors"
            >
              <X size={16} />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              {/* Images */}
              <div className="relative">
                <div className="aspect-square relative bg-[var(--muted)]">
                  <Image
                    src={images[activeImg]?.url}
                    alt={product.name}
                    fill
                    className="object-cover rounded-tl-sm rounded-bl-sm"
                  />
                </div>
                {images.length > 1 && (
                  <div className="flex gap-2 p-3">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        className={`w-12 h-12 rounded-sm overflow-hidden border-2 transition-all ${
                          i === activeImg ? 'border-[var(--orange)]' : 'border-[var(--border)]'
                        }`}
                      >
                        <Image src={img.url} alt="" width={48} height={48} className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col">
                {product.brand && (
                  <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--orange)' }}>
                    {product.brand}
                  </p>
                )}
                <h2 className="font-display font-bold text-xl leading-snug mb-3" style={{ color: 'var(--foreground)' }}>
                  {product.name}
                </h2>
                {product.priceVisible && product.price && (
                  <p className="font-display font-bold text-2xl mb-4" style={{ color: 'var(--foreground)' }}>
                    {product.price.toLocaleString('fr-FR')} €
                    <span className="text-sm font-normal ml-1.5" style={{ color: 'var(--muted-foreground)' }}>HT</span>
                  </p>
                )}
                {product.shortDesc && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                    {product.shortDesc}
                  </p>
                )}
                {specEntries.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--foreground)' }}>
                      Spécifications
                    </p>
                    <div className="space-y-2">
                      {specEntries.map(([key, val]) => (
                        <div key={key} className="flex justify-between text-sm gap-4">
                          <span style={{ color: 'var(--muted-foreground)' }}>{key}</span>
                          <span className="font-medium text-right" style={{ color: 'var(--foreground)' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-auto flex flex-col gap-2">
                  <Link
                    href={`/catalogue/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-sm text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--orange)' }}
                  >
                    Voir la fiche complète
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-sm text-sm font-medium border transition-colors hover:bg-[var(--muted)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Demander un devis
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
