import { notFound } from 'next/navigation';
import CategoryPageClient from '@/components/public/CategoryPageClient';

async function getCategory(slug) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/categories/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: 'Catégorie introuvable' };
  return { title: cat.name, description: cat.description };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  return <CategoryPageClient category={category} />;
}
