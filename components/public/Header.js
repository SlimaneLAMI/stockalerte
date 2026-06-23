'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useSettings } from '@/components/SettingsContext';

const nav = [
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const s = useSettings();
  const companyName = s.company_name || 'StockAlerte';
  const logoLetters = companyName.slice(0, 2).toUpperCase();
  const isHome = pathname === '/';
  const textColor = (isHome && !scrolled) ? 'white' : 'var(--foreground)';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: (scrolled || !isHome) ? 'var(--background)' : 'transparent',
          borderBottom: (scrolled || !isHome) ? '1px solid var(--border)' : '1px solid transparent',
          backdropFilter: (scrolled || !isHome) ? 'blur(12px)' : 'none',
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="w-8 h-8 rounded-sm flex items-center justify-center font-display font-bold text-sm text-white"
              style={{ backgroundColor: 'var(--orange)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {logoLetters}
            </motion.div>
            <span
              className="font-display font-bold text-xl tracking-tight transition-colors duration-300"
              style={{ color: textColor }}
            >
              {companyName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {nav.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="relative font-body font-medium text-sm tracking-wide transition-colors duration-200"
                style={{
                  color: pathname.startsWith(href) ? 'var(--orange)' : textColor,
                  opacity: pathname.startsWith(href) ? 1 : 0.85,
                }}
              >
                {label}
                {pathname.startsWith(href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                    style={{ backgroundColor: 'var(--orange)' }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-[var(--muted)]"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? (
                <Sun size={16} style={{ color: textColor }} />
              ) : (
                <Moon size={16} style={{ color: textColor }} />
              )}
            </button>

            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-sm text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: 'var(--orange)' }}
            >
              Nous contacter
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-sm transition-colors hover:bg-[var(--muted)]"
            >
              {open ? <X size={18} style={{ color: textColor }} /> : <Menu size={18} style={{ color: textColor }} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/20" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute top-0 right-0 bottom-0 w-72 flex flex-col pt-20 p-8"
              style={{ backgroundColor: 'var(--background)', borderLeft: '1px solid var(--border)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <nav className="flex flex-col gap-6">
                {nav.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className="font-display font-bold text-2xl transition-colors"
                    style={{ color: pathname.startsWith(href) ? 'var(--orange)' : 'var(--foreground)' }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-3 rounded-sm text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--orange)' }}
                >
                  Nous contacter
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
