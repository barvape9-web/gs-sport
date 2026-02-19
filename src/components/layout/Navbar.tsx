'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X, ChevronDown, Search, Shield } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import CartDrawer from '@/components/cart/CartDrawer';

const navLinks = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '/products',
    sublinks: [
      { label: "Men's Collection", href: '/products?gender=MEN' },
      { label: "Women's Collection", href: '/products?gender=WOMEN' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popularity' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { getTotalItems, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <span className="text-2xl font-black tracking-tight">
                  <span className="text-white">GS</span>
                  <span className="text-[#f97316]"> •</span>
                  <span className="text-white"> Sport</span>
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#f97316] to-transparent"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.sublinks && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === link.href
                        ? 'text-[#f97316]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                    {link.sublinks && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.sublinks && activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 glass-card p-2 shadow-2xl"
                      >
                        {link.sublinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <Search size={20} />
              </motion.button>

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="relative p-2 text-white/70 hover:text-white transition-colors"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#f97316] rounded-full text-[10px] font-bold text-white flex items-center justify-center"
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
                    className="flex items-center gap-2 px-3 py-2 glass rounded-full text-sm font-medium text-white/80 hover:text-white transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block max-w-[80px] truncate">{user.name}</span>
                  </motion.button>
                  <div className="absolute right-0 top-full mt-2 w-48 glass-card p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg"
                    >
                      Dashboard
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#f97316] hover:bg-white/5 rounded-lg"
                      >
                        <Shield size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 btn-primary rounded-full text-sm font-semibold text-white"
                  >
                    <User size={16} />
                    Sign In
                  </motion.button>
                </Link>
              )}

              {/* Mobile toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 text-white/70 hover:text-white"
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
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? 'text-[#f97316] bg-orange-500/10'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.sublinks && (
                      <div className="pl-4 mt-1 space-y-1">
                        {link.sublinks.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setIsMobileOpen(false)}
                            className="block px-4 py-2 text-xs text-white/50 hover:text-white/80 rounded-lg hover:bg-white/5"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {!user && (
                  <div className="pt-2 border-t border-white/10">
                    <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                      <button className="w-full btn-primary py-3 rounded-xl text-sm font-semibold text-white">
                        Sign In
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
