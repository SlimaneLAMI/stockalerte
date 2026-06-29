import { notFound } from 'next/navigation';
import CategoryPageClient from '@/components/public/CategoryPageClient';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

async function getCategory(slug) {
  try {
    const res = await fetch(`${BASE}/api/categories/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: 'Catégorie introuvable' };

  const title = `${cat.name} — Catalogue équipements professionnels`;
  const description = cat.description || `Découvrez notre gamme d'équipements ${cat.name} pour professionnels de la restauration.`;
  const image = cat.bannerImage;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/catalogue/categorie/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/catalogue/categorie/${slug}`,
      ...(image && { images: [{ url: image, width: 1200, height: 630, alt: cat.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${BASE}/catalogue` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${BASE}/catalogue/categorie/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryPageClient category={category} />
    </>
  );
}
