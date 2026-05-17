import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Nouveau produit' };

export default function NouveauProduitPage() {
  return <ProductForm isEdit={false} />;
}
