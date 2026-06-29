import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/public/ProductPageClient';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

async function getProduct(slug) {
  try {
    const res = await fetch(`${BASE}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function getRelated(categoryId, currentSlug) {
  try {
    const res = await fetch(`${BASE}/api/products?category=${categoryId}&limit=4`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return (data.products || []).filter(p => p.slug !== currentSlug).slice(0, 3);
  } catch { return []; }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produit introuvable' };

  const title = product.metaTitle || product.name;
  const description = product.metaDesc || product.shortDesc || '';
  const image = product.images?.[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/catalogue/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE}/catalogue/${slug}`,
      type: 'website',
      ...(image && { images: [{ url: image, width: 1200, height: 900, alt: title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = product.categoryId?._id
    ? await getRelated(product.categoryId._id, slug)
    : [];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${BASE}/catalogue` },
      ...(product.categoryId?.name
        ? [{ '@type': 'ListItem', position: 3, name: product.categoryId.name, item: `${BASE}/catalogue/categorie/${product.categoryId.slug || ''}` }]
        : []),
      { '@type': 'ListItem', position: product.categoryId?.name ? 4 : 3, name: product.name, item: `${BASE}/catalogue/${slug}` },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDesc || '',
    image: product.images?.map(i => i.url) || [],
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    category: product.categoryId?.name || undefined,
    url: `${BASE}/catalogue/${slug}`,
    ...(product.priceVisible && product.price && {
      offers: {
        '@type': 'Offer',
        price: product.salePrice || product.price,
        priceCurrency: 'EUR',
        availability: product.availability === 'En stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
        url: `${BASE}/catalogue/${slug}`,
      },
    }),
    ...(product.condition && {
      itemCondition: {
        'Neuf': 'https://schema.org/NewCondition',
        'Comme neuf': 'https://schema.org/LikeNewCondition',
        'Bonne occasion': 'https://schema.org/UsedCondition',
        'Occasion': 'https://schema.org/UsedCondition',
      }[product.condition],
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductPageClient product={product} related={related} />
    </>
  );
}
