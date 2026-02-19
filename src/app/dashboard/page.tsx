'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Heart, User, Settings, ShoppingBag, LogOut, Star } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { Order } from '@/types';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import axios from 'axios';
import Link from 'next/link';

const tabs = [
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'saved', label: 'Saved Items', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/user');
        setOrders(res.data.data || []);
      } catch {
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/60 mb-4">Please sign in to view your dashboard</p>
            <Link href="/login">
              <button className="btn-primary px-6 py-2.5 rounded-full text-white font-semibold">
                Sign In
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-24">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-6 mb-10"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center text-3xl font-black text-white shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                Welcome, <span className="gradient-text">{user.name}</span>
              </h1>
              <p className="text-white/40 mt-1">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/20">
                <Star size={10} className="fill-current" />
                {user.role === 'ADMIN' ? 'Admin' : 'Member'}
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-4 space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <motion.button
                    key={id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === id
                        ? 'bg-[#f97316]/15 text-[#f97316] border border-[#f97316]/20'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </motion.button>
                ))}

                {user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#f97316] hover:bg-[#f97316]/10 transition-all"
                    >
                      <Settings size={18} />
                      Admin Panel
                    </motion.button>
                  </Link>
                )}

                <div className="pt-2 border-t border-white/10 mt-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all"
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-bold text-white mb-6">Order History</h2>

                  {isLoadingOrders ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="glass-card p-5 shimmer h-24 rounded-xl" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                      <ShoppingBag size={40} className="text-white/20 mx-auto mb-4" />
                      <p className="text-white/50 font-semibold mb-2">No orders yet</p>
                      <p className="text-white/30 text-sm mb-6">Start shopping to see your orders here</p>
                      <Link href="/products">
                        <button className="btn-primary px-6 py-2.5 rounded-full text-white text-sm font-semibold">
                          Shop Now
                        </button>
                      </Link>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-bold text-white">
                                #{order.id.slice(-8).toUpperCase()}
                              </span>
                              <span
                                className={`px-2 py-0.5 text-xs font-bold rounded-full ${getOrderStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-white/40">{formatDate(order.createdAt)}</p>
                            <p className="text-xs text-white/40 mt-1">
                              {order.items?.length || 0} item(s)
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-[#f97316]">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
                  <div className="glass-card p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                        <input
                          defaultValue={user.name}
                          className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                        <input
                          defaultValue={user.email}
                          type="email"
                          className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary mt-6 px-8 py-3 rounded-xl font-semibold text-white"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'saved' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Saved Products</h2>
                  <div className="glass-card p-12 text-center">
                    <Heart size={40} className="text-white/20 mx-auto mb-4" />
                    <p className="text-white/50">No saved items yet</p>
                    <Link href="/products">
                      <button className="mt-4 btn-primary px-6 py-2.5 rounded-full text-white text-sm font-semibold">
                        Browse Products
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Settings</h2>
                  <div className="glass-card p-8 space-y-6">
                    {[
                      { label: 'Email Notifications', desc: 'Receive order updates via email' },
                      { label: 'SMS Notifications', desc: 'Receive shipping updates via SMS' },
                      { label: 'Marketing Emails', desc: 'Receive deals and promotions' },
                    ].map((setting) => (
                      <div key={setting.label} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{setting.label}</p>
                          <p className="text-xs text-white/40">{setting.desc}</p>
                        </div>
                        <div className="w-12 h-6 rounded-full bg-[#f97316] cursor-pointer relative">
                          <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
