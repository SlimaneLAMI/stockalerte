import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import PublicProviders from '@/components/PublicProviders';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';

async function getSettings() {
  try {
    await connectDB();
    const docs = await SiteSettings.find().lean();
    const s = {};
    docs.forEach(d => { s[d.key] = d.value; });
    return s;
  } catch {
    return {};
  }
}

export default async function PublicLayout({ children }) {
  const settings = await getSettings();
  return (
    <PublicProviders settings={settings}>
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PublicProviders>
  );
}
