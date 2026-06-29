import ContactClient from '@/components/public/ContactClient';
import { getSettings } from '@/lib/getSettings';

const BASE = process.env.NEXTAUTH_URL || 'https://stockalerte.onrender.com';

export async function generateMetadata() {
  const s = await getSettings();
  const name = s.company_name || 'StockAlerte';
  const title = `Contactez-nous — ${name}`;
  const description = `Prenez contact avec ${name} pour tout projet d'équipement de cuisine professionnelle. Devis gratuit, réponse sous 48h.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE}/contact` },
    openGraph: {
      title,
      description,
      url: `${BASE}/contact`,
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
