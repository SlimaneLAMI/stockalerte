import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

async function getProduct(id) {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.specs && !(data.specs instanceof Map)) {
      data.specs = data.specs;
    }
    return data;
  } catch { return null; }
}

export default async function EditProduitPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return <ProductForm initialData={product} isEdit={true} />;
}
