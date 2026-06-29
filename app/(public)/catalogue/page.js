import { Suspense } from 'react';
import CatalogueClient from '@/components/public/CatalogueClient';
import { getSettings } from '@/lib/getSettings';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

export async function generateMetadata() {
  const s = await getSettings();
  const name = s.company_name || 'StockAlerte';
  const title = `Catalogue — Équipements de cuisine professionnelle | ${name}`;
  const description = `Parcourez notre catalogue complet d'équipements de cuisine professionnelle. Cuisson, réfrigération, préparation — tout le matériel pro pour restaurants, hôtels et collectivités.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/catalogue` },
    openGraph: {
      title,
      description,
      url: `${BASE}/catalogue`,
    },
  };
}

export default async function CataloguePage({ searchParams }) {
  const { category } = await searchParams;
  return (
    <Suspense>
      <CatalogueClient initialCategory={category || null} />
    </Suspense>
  );
}
