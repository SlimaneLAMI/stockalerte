import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs mb-8" aria-label="Fil d'Ariane">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} style={{ color: 'var(--muted-foreground)' }} />}
          {item.href && i < items.length - 1 ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-[var(--orange)]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: i === items.length - 1 ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
