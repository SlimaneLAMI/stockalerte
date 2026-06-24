import { Suspense } from 'react';
import CatalogueClient from '@/components/public/CatalogueClient';

export const metadata = {
  title: 'Catalogue',
  description: 'Parcourez notre catalogue complet d\'équipements de cuisine professionnelle. Cuisson, réfrigération, préparation.',
};

export default async function CataloguePage({ searchParams }) {
  const { category } = await searchParams;
  return (
    <Suspense>
      <CatalogueClient initialCategory={category || null} />
    </Suspense>
  );
}
