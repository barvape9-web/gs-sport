'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Palette,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Shield,
  ChevronRight,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: '#f97316', exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, color: '#3b82f6' },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart, color: '#10b981' },
  { href: '/admin/users', label: 'Users', icon: Users, color: '#8b5cf6' },
  { href: '/admin/chat', label: 'Chat', icon: MessageCircle, color: '#f59e0b' },
  { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp, color: '#ec4899' },
  { href: '/admin/theme', label: 'Theme', icon: Palette, color: '#06b6d4' },
];

/* ── 3D Icon Component ── */
function Icon3D({ icon: Icon, color, size = 20, active = false }: { icon: typeof LayoutDashboard; color: string; size?: number; active?: boolean }) {
  return (
    <div
      className="icon-3d w-9 h-9 shrink-0"
      style={{
        background: active
          ? `linear-gradient(135deg, ${color}30, ${color}15)`
          : `linear-gradient(135deg, ${color}18, ${color}08)`,
        border: `1px solid ${active ? color + '40' : color + '15'}`,
        boxShadow: active
          ? `0 4px 15px ${color}25, 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)`
          : `0 4px 15px rgba(0,0,0,0.2), 0 8px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      <Icon size={size} style={{ color, filter: active ? `drop-shadow(0 0 6px ${color}50)` : 'none' }} />
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen flex relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Mesh gradient background */}
      <div className="admin-mesh-bg" />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 w-[270px] admin-sidebar flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <Link href="/admin" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="icon-3d w-11 h-11"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, #000))',
                boxShadow: '0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <Shield size={20} className="text-white" />
            </motion.div>
            <div>
              <span className="font-black text-sm tracking-wide transition-colors" style={{ color: 'var(--text-primary)' }}>
                GS • Sport
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Sparkles size={9} style={{ color: 'var(--color-primary)' }} />
                <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="text-[9px] uppercase tracking-[0.2em] font-bold px-3 mb-3" style={{ color: 'var(--text-muted)' }}>
            Navigation
          </p>
          {navItems.map(({ href, label, icon: Icon, color, exact }) => {
            const active = isActive({ href, label, icon: Icon, color, exact: exact || false });
            return (
              <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`admin-nav-item ${active ? 'active' : ''}`}
                >
                  <Icon3D icon={Icon} color={color} size={16} active={active} />
                  <span className="relative z-10 font-medium">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-arrow"
                      className="ml-auto"
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                    >
                      <ChevronRight size={14} style={{ color: 'var(--color-primary)' }} />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="icon-3d w-9 h-9" style={{
              background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, #000))',
              boxShadow: '0 4px 12px color-mix(in srgb, var(--color-primary) 25%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}>
              <span className="text-xs font-black text-white">{user?.name?.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <button className="w-full py-2.5 text-xs glass rounded-xl transition-all font-medium" style={{ color: 'var(--text-muted)' }}>
                Main Site
              </button>
            </Link>
            <button
              onClick={() => logout()}
              className="py-2.5 px-3.5 text-xs glass rounded-xl text-red-400/50 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-[270px] min-w-0 relative z-10">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 admin-topbar">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl transition-all" style={{ color: 'var(--text-muted)' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {navItems.find((n) => isActive(n))?.label || 'Admin'}
              </h1>
              <p className="text-[10px] hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="admin-badge"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)', border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)', boxShadow: '0 2px 10px color-mix(in srgb, var(--color-primary) 15%, transparent)' }}
            >
              <Shield size={10} />
              Admin
            </motion.span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
