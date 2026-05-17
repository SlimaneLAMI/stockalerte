import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/public/ProductPageClient';

async function getProduct(slug) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getRelated(categoryId, currentSlug) {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products?category=${categoryId}&limit=4`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    return (data.products || []).filter(p => p.slug !== currentSlug).slice(0, 3);
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produit introuvable' };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = product.categoryId?._id
    ? await getRelated(product.categoryId._id, slug)
    : [];

  return <ProductPageClient product={product} related={related} />;
}
