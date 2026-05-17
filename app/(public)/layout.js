import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import PublicProviders from '@/components/PublicProviders';

export const dynamic = 'force-dynamic';

export default function PublicLayout({ children }) {
  return (
    <PublicProviders>
      <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </PublicProviders>
  );
}
