'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, Shield, Globe } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useLanguageStore, Locale } from '@/store/languageStore';
import { useTranslation } from '@/lib/useTranslation';
import CartDrawer from '@/components/cart/CartDrawer';

const localeOptions: { value: Locale; label: string; flag: string }[] = [
  { value: 'ka', label: 'ქარ', flag: '🇬🇪' },
  { value: 'en', label: 'ENG', flag: '🇬🇧' },
  { value: 'ru', label: 'РУС', flag: '🇷🇺' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const { locale, setLocale } = useLanguageStore();
  const { t } = useTranslation();

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.products'), href: '/products' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real live user counter — heartbeat + fetch
  useEffect(() => {
    let sessionId = sessionStorage.getItem('gs-session-id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('gs-session-id', sessionId);
    }

    const heartbeat = async () => {
      try {
        const res = await fetch('/api/online', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (typeof data.count === 'number') setOnlineCount(data.count);
      } catch { /* silent */ }
    };

    heartbeat();
    const interval = setInterval(heartbeat, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalItems = getTotalItems();

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'backdrop-blur-xl shadow-2xl'
            : 'backdrop-blur-md'
        }`}
        style={{
          backgroundColor: isScrolled
            ? 'color-mix(in srgb, var(--bg-primary) 95%, transparent)'
            : 'color-mix(in srgb, var(--bg-primary) 60%, transparent)',
          borderBottom: isScrolled ? '1px solid var(--glass-border)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <span className="text-xl sm:text-2xl font-extrabold tracking-[0.12em] uppercase">
                  <span style={{ color: 'var(--text-primary)' }}>GS</span>
                  <span style={{ color: 'var(--color-primary)' }}> •</span>
                  <span style={{ color: 'var(--text-primary)' }}> Sport</span>
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5"
                  style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), transparent)' }}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    className={`group relative flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-300`}
                    style={{ color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {link.label}
                    <span
                      className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${
                        pathname === link.href ? 'scale-x-100' : ''
                      }`}
                      style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, transparent), transparent)' }}
                    />
                  </Link>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold transition-all"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--color-primary) 25%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Globe size={14} style={{ color: 'var(--color-primary)' }} />
                  <span className="hidden sm:inline">{localeOptions.find(l => l.value === locale)?.flag}</span>
                  <span>{localeOptions.find(l => l.value === locale)?.label}</span>
                </motion.button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 p-1.5 shadow-2xl z-50 min-w-[120px] rounded-xl"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--bg-primary) 97%, var(--color-primary))',
                        border: '1px solid color-mix(in srgb, var(--color-primary) 15%, var(--bg-secondary))',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
                      }}
                    >
                      {localeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setLocale(opt.value); setLangOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            locale === opt.value ? '' : ''
                          }`}
                          style={locale === opt.value ? {
                            backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                            color: 'var(--color-primary)',
                          } : { color: 'var(--text-secondary)' }}
                          onMouseEnter={(e) => { if (locale !== opt.value) e.currentTarget.style.backgroundColor = 'var(--overlay-bg)'; }}
                          onMouseLeave={(e) => { if (locale !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <span>{opt.flag}</span>
                          <span>{opt.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Live Counter */}
              {onlineCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border"
                  style={{
                    borderColor: 'color-mix(in srgb, #22c55e 25%, transparent)',
                    backgroundColor: 'color-mix(in srgb, #22c55e 6%, transparent)',
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <motion.span
                    key={onlineCount}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[11px] font-semibold tracking-wide"
                    style={{ color: '#4ade80' }}
                  >
                    {t('nav.online')}: {onlineCount}
                  </motion.span>
                </motion.div>
              )}

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="relative p-2 rounded-lg transition-all duration-300"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* User */}
              {user ? (
                <div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-3 py-2 glass rounded-full text-sm font-medium transition-all"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom right, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, #000))' }}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="hidden sm:block max-w-[80px] truncate">{user.name}</span>
                  </motion.button>
                  <div
                    className="absolute right-0 top-full mt-2 w-48 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--bg-primary) 97%, var(--color-primary))',
                      border: '1px solid color-mix(in srgb, var(--color-primary) 15%, var(--bg-secondary))',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
                    }}
                  >
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2.5 text-sm rounded-lg"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {t('nav.dashboard')}
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg"
                        style={{ color: 'var(--color-primary)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--overlay-bg)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Shield size={14} />
                        {t('nav.adminPanel')}
                      </Link>
                    )}
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 rounded-lg"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--overlay-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-xs font-semibold uppercase tracking-widest text-white"
                  >
                    <User size={16} />
                    {t('nav.signIn')}
                  </motion.button>
                </Link>
              )}

              {/* Mobile toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 rounded-lg transition-all duration-300"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden backdrop-blur-xl"
              style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 95%, transparent)', borderTop: '1px solid var(--glass-border)' }}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? 'bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]'
                          : ''
                      }`}
                      style={pathname === link.href ? { color: 'var(--color-primary)' } : { color: 'var(--text-secondary)' }}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
                {!user && (
                  <div className="pt-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
                    <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                      <button className="w-full btn-primary py-3 rounded-xl text-sm font-semibold text-white">
                        {t('nav.signIn')}
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <CartDrawer />
    </>
  );
}
