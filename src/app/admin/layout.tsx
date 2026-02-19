'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/admin/theme', label: 'Theme', icon: Palette },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 glass-dark border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="font-black text-white text-sm">GS • Sport</span>
              <p className="text-[10px] text-white/30 font-medium">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive({ href, label, icon: Icon, exact: href === '/admin' })
                    ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/20'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                {label}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-xs font-black text-white">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <button className="w-full py-2 text-xs glass rounded-lg text-white/50 hover:text-white transition-colors">
                Main Site
              </button>
            </Link>
            <button
              onClick={() => logout()}
              className="py-2 px-3 text-xs glass rounded-lg text-red-400/60 hover:text-red-400 transition-colors flex items-center"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 h-16 glass-dark border-b border-white/5">
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex-1 lg:flex-none">
            <h1 className="text-sm font-semibold text-white/80">
              {navItems.find((n) => isActive(n))?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#f97316] font-bold px-2 py-1 rounded-full border border-[#f97316]/20 bg-[#f97316]/10">
              Admin
            </span>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
