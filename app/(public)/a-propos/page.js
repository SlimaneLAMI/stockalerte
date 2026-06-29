import AProposClient from '@/components/public/AProposClient';
import { getSettings } from '@/lib/getSettings';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

export async function generateMetadata() {
  const s = await getSettings();
  const name = s.company_name || 'StockAlerte';
  const title = s.about_title || `À propos de ${name}`;
  const description = s.about_paragraphs?.[0]?.content
    || s.about_paragraphs?.[0]
    || `Découvrez l'histoire et les valeurs de ${name}, spécialiste des équipements de cuisine professionnelle.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/a-propos` },
    openGraph: {
      title,
      description,
      url: `${BASE}/a-propos`,
    },
  };
}

export default function AProposPage() {
  return <AProposClient />;
}
