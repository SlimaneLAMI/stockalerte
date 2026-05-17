import { Suspense } from 'react';
import HomepageClient from '@/components/public/HomepageClient';

export const metadata = {
  title: 'StockAlerte — Équipements de Cuisine Professionnelle',
  description: 'Matériel de cuisine professionnel sélectionné pour les chefs exigeants. Cuisson, réfrigération, préparation. Livraison et installation incluses.',
};

export default function HomePage() {
  return (
    <Suspense>
      <HomepageClient />
    </Suspense>
  );
}
