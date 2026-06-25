'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tag, Building2, Globe,
  Mail, Settings, LogOut, Menu, X, ChevronRight, Info,
} from 'lucide-react';
import { SessionProvider, signOut } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

const nav = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Produits', href: '/admin/produits', icon: Package },
  { label: 'Catégories', href: '/admin/categories', icon: Tag },
  { label: 'Marques', href: '/admin/marques', icon: Building2 },
  { label: 'Page d\'accueil', href: '/admin/homepage', icon: Globe },
  { label: 'À propos', href: '/admin/a-propos', icon: Info },
  { label: 'Contacts', href: '/admin/contacts', icon: Mail },
  { label: 'Paramètres', href: '/admin/parametres', icon: Settings },
];

function AdminNav({ pathname }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [siteName, setSiteName] = useState('StockAlerte');
  const [logoUrl, setLogoUrl] = useState('');

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d.company_name) setSiteName(d.company_name);
      if (d.logo_url) setLogoUrl(d.logo_url);
    }).catch(() => {});
  }, []);

  const NavLinks = () => (
    <nav className="flex flex-col gap-1 flex-1">
      {nav.map(({ label, href, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
              active
                ? 'text-white font-medium'
                : 'hover:bg-[var(--sidebar-accent)]'
            }`}
            style={{
              backgroundColor: active ? 'var(--orange)' : 'transparent',
              color: active ? 'white' : 'var(--sidebar-foreground)',
            }}
          >
            <Icon size={16} />
            {label}
            {active && <ChevronRight size={14} className="ml-auto" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 shrink-0 h-screen sticky top-0 border-r"
        style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--sidebar-border)' }}
      >
        <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div
            className="w-7 h-7 rounded-sm overflow-hidden flex items-center justify-center font-display font-bold text-xs text-white flex-shrink-0"
            style={logoUrl ? {} : { backgroundColor: 'var(--orange)' }}
          >
            {logoUrl
              ? <img src={logoUrl} alt={siteName} className="w-full h-full object-cover" />
              : siteName.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-display font-bold" style={{ color: 'var(--sidebar-foreground)' }}>
            {siteName} Admin
          </span>
        </div>
        <div className="flex flex-col flex-1 p-3 overflow-y-auto">
          <NavLinks />
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors hover:bg-[var(--sidebar-accent)]"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b"
        style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--sidebar-border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-sm overflow-hidden flex items-center justify-center font-display font-bold text-xs text-white flex-shrink-0"
            style={logoUrl ? {} : { backgroundColor: 'var(--orange)' }}
          >
            {logoUrl
              ? <img src={logoUrl} alt={siteName} className="w-full h-full object-cover" />
              : siteName.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-display font-bold text-sm" style={{ color: 'var(--sidebar-foreground)' }}>Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="absolute top-14 left-0 bottom-0 w-60 flex flex-col p-3 border-r"
              style={{ backgroundColor: 'var(--sidebar)', borderColor: 'var(--sidebar-border)' }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <NavLinks />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AdminLayoutInner({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, pathname, router]);

  if (pathname === '/admin/login') return children;
  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      <div className="w-8 h-8 border-2 border-[var(--orange)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <AdminNav pathname={pathname} />
      <main className="flex-1 min-w-0 lg:overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayoutClient({ children }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
      <Toaster position="top-right" richColors />
    </SessionProvider>
  );
}
