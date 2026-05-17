'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';

function AvailabilityBadge({ status }) {
  const config = {
    'En stock': { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
    'Sur commande': { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
    'Discontinué': { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-400' },
  };
  const c = config[status] || config['En stock'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}

export default function ProductCard({ product, onQuickView }) {
  const [hovered, setHovered] = useState(false);
  const mainImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80';

  return (
    <motion.article
      className="group relative rounded-sm overflow-hidden bg-[var(--card)] border border-[var(--border)] flex flex-col"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--muted)]">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-3"
          style={{ backgroundColor: 'rgba(26,26,26,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-colors"
            >
              <Eye size={14} />
              Aperçu rapide
            </button>
          )}
        </motion.div>

        {/* Category badge */}
        {product.categoryId && (
          <div className="absolute top-3 left-3">
            <span
              className="px-2.5 py-1 rounded-sm text-xs font-medium text-white"
              style={{ backgroundColor: 'var(--orange)' }}
            >
              {product.categoryId.name || product.categoryId}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            {product.brand && (
              <p className="text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--orange)' }}>
                {product.brand}
              </p>
            )}
            <h3
              className="font-display font-bold text-base leading-snug line-clamp-2"
              style={{ color: 'var(--foreground)' }}
            >
              {product.name}
            </h3>
          </div>
        </div>

        {product.shortDesc && (
          <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: 'var(--muted-foreground)' }}>
            {product.shortDesc}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div>
            <AvailabilityBadge status={product.availability} />
            {product.priceVisible && product.price && (
              <p className="font-display font-bold text-lg mt-2" style={{ color: 'var(--foreground)' }}>
                {product.price.toLocaleString('fr-FR')} €
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--muted-foreground)' }}>HT</span>
              </p>
            )}
          </div>
          <Link
            href={`/catalogue/${product.slug}`}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: 'var(--orange)', color: 'white' }}
          >
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
