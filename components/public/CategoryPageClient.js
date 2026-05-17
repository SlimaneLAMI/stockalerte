'use client';
import Image from 'next/image';
import Breadcrumbs from './Breadcrumbs';
import CatalogueClient from './CatalogueClient';

export default function CategoryPageClient({ category }) {
  return (
    <>
      {/* Hero banner */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        {category.bannerImage ? (
          <Image src={category.bannerImage} alt={category.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: 'var(--muted)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 to-[#1a1a1a]/20" />
        <div className="absolute bottom-0 left-0 max-w-[1400px] w-full mx-auto px-6 lg:px-12 pb-10">
          <span className="text-3xl block mb-2">{category.icon}</span>
          <h1 className="font-display font-bold text-3xl md:text-5xl text-white mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-white/70 max-w-xl">{category.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8">
        <Breadcrumbs items={[
          { label: 'Accueil', href: '/' },
          { label: 'Catalogue', href: '/catalogue' },
          { label: category.name },
        ]} />
      </div>

      <CatalogueClient initialCategory={category._id} />
    </>
  );
}
