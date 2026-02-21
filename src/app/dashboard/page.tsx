'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Heart, User, Settings, ShoppingBag, LogOut, Star, Trash2,
  ChevronRight, TruckIcon, Clock, CheckCircle2, XCircle, Loader2,
  MapPin, Camera,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuthStore } from '@/store/authStore';
import { Order, Product } from '@/types';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/useTranslation';

const statusIcons: Record<string, typeof Package> = {
  PENDING: Clock,
  PROCESSING: Loader2,
  SHIPPED: TruckIcon,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function DashboardPage() {
  const { user, logout, setUser } = useAuthStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('orders');
  const ordersRef = useRef<HTMLDivElement>(null);

  const scrollToOrders = useCallback(() => {
    setActiveTab('orders');
    setTimeout(() => {
      ordersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Allowed: JPG, PNG, WebP.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum 5 MB.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('name', profileName);
      formData.append('email', profileEmail);

      const res = await axios.put('/api/auth/profile', formData);
      setUser(res.data.user);
      toast.success(t('dashboard.avatarUpdated') || 'Profile photo updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim() || !profileEmail.trim()) {
      toast.error(t('dashboard.fillAllFields') || 'Please fill all fields');
      return;
    }
    setSavingProfile(true);
    try {
      const res = await axios.put('/api/auth/profile', { name: profileName.trim(), email: profileEmail.trim() });
      setUser(res.data.user);
      toast.success(t('dashboard.profileUpdated') || 'Profile updated!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const tabs = [
    { id: 'orders', label: t('dashboard.orders'), icon: Package, gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { id: 'saved', label: t('dashboard.savedItems'), icon: Heart, gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
    { id: 'profile', label: t('dashboard.profile'), icon: User, gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { id: 'settings', label: t('dashboard.settings'), icon: Settings, gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  ];

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/user');
        setOrders(res.data.orders || []);
      } catch {
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    const fetchSaved = async () => {
      try {
        const res = await axios.get('/api/saved');
        setSavedProducts(res.data.products || []);
      } catch {
        setSavedProducts([]);
      } finally {
        setIsLoadingSaved(false);
      }
    };
    if (user) {
      fetchOrders();
      fetchSaved();
    }
  }, [user]);

  const handleRemoveSaved = async (productId: string) => {
    try {
      await axios.post('/api/saved', { productId });
      setSavedProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch {
      // ignore
    }
  };

  if (!user) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))',
                border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                boxShadow: '0 20px 40px color-mix(in srgb, var(--color-primary) 15%, transparent)',
              }}
            >
              <User size={40} style={{ color: 'var(--color-primary)' }} />
            </motion.div>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.signInRequired')}</p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-8 py-3 rounded-2xl text-white font-bold"
              >
                {t('login.signIn')}
              </motion.button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const stats = [
    {
      label: t('dashboard.orders'),
      value: orders.length,
      icon: Package,
      gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
      shadow: 'rgba(249,115,22,0.3)',
    },
    {
      label: t('dashboard.savedItems'),
      value: savedProducts.length,
      icon: Heart,
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      shadow: 'rgba(236,72,153,0.3)',
    },
    {
      label: t('dashboard.delivered'),
      value: orders.filter((o) => o.status === 'DELIVERED').length,
      icon: CheckCircle2,
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      shadow: 'rgba(34,197,94,0.3)',
    },
  ];

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black text-white overflow-hidden relative"
              style={{
                backgroundImage: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #000))',
                boxShadow: '0 10px 40px color-mix(in srgb, var(--color-primary) 35%, transparent), 0 0 0 1px color-mix(in srgb, var(--color-primary) 20%, transparent)',
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </motion.div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                {t('dashboard.welcome')} <span className="gradient-text">{user.name}</span>
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
              <span
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundImage: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent), color-mix(in srgb, var(--color-primary) 10%, transparent))',
                  color: 'var(--color-primary)',
                  border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
                  boxShadow: '0 4px 15px color-mix(in srgb, var(--color-primary) 10%, transparent)',
                }}
              >
                <Star size={11} className="fill-current" />
                {user.role === 'ADMIN' ? t('dashboard.admin') : t('dashboard.member')}
              </span>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => {
                    if (stat.label === t('dashboard.orders')) scrollToOrders();
                  }}
                  className="glass-card p-5 flex items-center gap-4 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: stat.gradient,
                      boxShadow: `0 8px 25px ${stat.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    }}
                  >
                    <Icon size={22} className="text-white" />
                  </motion.div>
                  <div>
                    <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-3 space-y-1"
              >
                {tabs.map(({ id, label, icon: Icon, gradient }) => (
                  <motion.button
                    key={id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(id);
                      if (id === 'orders') {
                        setTimeout(() => {
                          ordersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all relative overflow-hidden"
                    style={
                      activeTab === id
                        ? {
                            backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                            color: 'var(--color-primary)',
                            border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                            boxShadow: '0 4px 15px color-mix(in srgb, var(--color-primary) 10%, transparent)',
                          }
                        : { color: 'var(--text-secondary)' }
                    }
                    onMouseEnter={(e) => {
                      if (activeTab !== id) {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.backgroundColor = 'var(--overlay-bg)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== id) {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.backgroundColor = '';
                      }
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={
                        activeTab === id
                          ? {
                              background: gradient,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
                            }
                          : {
                              backgroundColor: 'var(--overlay-bg)',
                            }
                      }
                    >
                      <Icon size={16} className={activeTab === id ? 'text-white' : ''} style={activeTab !== id ? { color: 'var(--text-muted)' } : {}} />
                    </div>
                    {label}
                    {activeTab === id && (
                      <ChevronRight size={14} className="ml-auto" style={{ color: 'var(--color-primary)' }} />
                    )}
                  </motion.button>
                ))}

                {user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <motion.button
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, #000))',
                          boxShadow: '0 4px 12px color-mix(in srgb, var(--color-primary) 25%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                      >
                        <Settings size={16} className="text-white" />
                      </div>
                      {t('dashboard.adminPanel')}
                    </motion.button>
                  </Link>
                )}

                <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => logout()}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-red-400/80 hover:text-red-400 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                      <LogOut size={16} className="text-red-400" />
                    </div>
                    {t('nav.logout')}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    ref={ordersRef}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #f97316, #ea580c)',
                          boxShadow: '0 8px 20px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                      >
                        <Package size={18} className="text-white" />
                      </motion.div>
                      <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{t('dashboard.orderHistory')}</h2>
                    </div>

                    {isLoadingOrders ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="glass-card p-6 shimmer h-28 rounded-2xl" />
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="glass-card p-12 text-center"
                      >
                        <motion.div
                          animate={{ y: [0, -8, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                          style={{
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))',
                            border: '1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)',
                            boxShadow: '0 15px 40px color-mix(in srgb, var(--color-primary) 10%, transparent)',
                          }}
                        >
                          <ShoppingBag size={32} style={{ color: 'var(--color-primary)' }} />
                        </motion.div>
                        <p className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{t('dashboard.noOrders')}</p>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{t('dashboard.startShopping')}</p>
                        <Link href="/products">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary px-8 py-3 rounded-2xl text-white text-sm font-bold"
                          >
                            {t('dashboard.shopNow')}
                          </motion.button>
                        </Link>
                      </motion.div>
                    ) : (
                      orders.map((order, idx) => {
                        const StatusIcon = statusIcons[order.status] || Package;
                        const isExpanded = expandedOrder === order.id;
                        return (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card overflow-hidden"
                            style={{
                              border: isExpanded ? '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)' : undefined,
                              boxShadow: isExpanded ? '0 10px 40px color-mix(in srgb, var(--color-primary) 10%, transparent)' : undefined,
                            }}
                          >
                            {/* Order header - clickable */}
                            <motion.div
                              whileHover={{ backgroundColor: 'var(--overlay-bg)' }}
                              onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                              className="p-5 cursor-pointer flex items-center gap-4"
                            >
                              {/* Product thumbnails */}
                              <div className="flex -space-x-3 flex-shrink-0">
                                {(order.items || []).slice(0, 3).map((item, i) => (
                                  <div
                                    key={item.id}
                                    className="w-12 h-12 rounded-xl overflow-hidden border-2 relative"
                                    style={{
                                      borderColor: 'var(--bg-secondary)',
                                      zIndex: 3 - i,
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                    }}
                                  >
                                    {item.product?.images?.[0] ? (
                                      <img
                                        src={item.product.images[0]}
                                        alt={item.product?.name || ''}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--overlay-bg)' }}>
                                        <ShoppingBag size={14} style={{ color: 'var(--text-muted)' }} />
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {(order.items?.length || 0) > 3 && (
                                  <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center border-2 text-xs font-bold"
                                    style={{
                                      borderColor: 'var(--bg-secondary)',
                                      backgroundColor: 'var(--overlay-bg)',
                                      color: 'var(--text-muted)',
                                    }}
                                  >
                                    +{(order.items?.length || 0) - 3}
                                  </div>
                                )}
                              </div>

                              {/* Order info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                    #{order.id.slice(-8).toUpperCase()}
                                  </span>
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full ${getOrderStatusColor(order.status)}`}
                                  >
                                    <StatusIcon size={10} className={order.status === 'PROCESSING' ? 'animate-spin' : ''} />
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {formatDate(order.createdAt)} · {order.items?.length || 0} {t('dashboard.items')}
                                </p>
                              </div>

                              {/* Price & expand */}
                              <div className="flex items-center gap-3">
                                <p className="text-lg font-black" style={{ color: 'var(--color-primary)' }}>
                                  {formatPrice(order.total)}
                                </p>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                                </motion.div>
                              </div>
                            </motion.div>

                            {/* Expanded details */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 space-y-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                    {/* Items list */}
                                    <div className="pt-4 space-y-3">
                                      {(order.items || []).map((item) => (
                                        <motion.div
                                          key={item.id}
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="flex items-center gap-4 p-3 rounded-xl"
                                          style={{ backgroundColor: 'var(--overlay-bg)' }}
                                        >
                                          <Link href={`/products/${item.productId}`} className="shrink-0">
                                            <motion.div
                                              whileHover={{ scale: 1.08 }}
                                              className="w-16 h-16 rounded-xl overflow-hidden"
                                              style={{
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                                              }}
                                            >
                                              {item.product?.images?.[0] ? (
                                                <img
                                                  src={item.product.images[0]}
                                                  alt={item.product?.name || ''}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                                  <ShoppingBag size={20} style={{ color: 'var(--text-muted)' }} />
                                                </div>
                                              )}
                                            </motion.div>
                                          </Link>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                                              {item.product?.name || 'Product'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                              {item.size && (
                                                <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: 'var(--overlay-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                                                  {item.size}
                                                </span>
                                              )}
                                              {item.color && (
                                                <span className="text-xs px-2 py-0.5 rounded-md font-medium flex items-center gap-1" style={{ backgroundColor: 'var(--overlay-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                                                  <span className="w-2.5 h-2.5 rounded-full border" style={{ backgroundColor: item.color, borderColor: 'var(--border-subtle)' }} />
                                                  {item.color}
                                                </span>
                                              )}
                                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                × {item.quantity}
                                              </span>
                                            </div>
                                          </div>
                                          <p className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                                            {formatPrice(item.price * item.quantity)}
                                          </p>
                                        </motion.div>
                                      ))}
                                    </div>

                                    {/* Order summary */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                      {order.address && (
                                        <div className="flex-1 flex items-start gap-2">
                                          <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                            <p className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{order.address.fullName}</p>
                                            <p>{order.address.line1}, {order.address.city}</p>
                                            {order.address.phone && <p>{order.address.phone}</p>}
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex-shrink-0 text-right text-xs space-y-1">
                                        <div className="flex items-center justify-end gap-6">
                                          <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                                          <span style={{ color: 'var(--text-secondary)' }}>{formatPrice(order.subtotal)}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-6">
                                          <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                                          <span style={{ color: order.shipping === 0 ? '#22c55e' : 'var(--text-secondary)' }}>
                                            {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-end gap-6 pt-1 font-bold" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                          <span style={{ color: 'var(--text-primary)' }}>Total</span>
                                          <span style={{ color: 'var(--color-primary)' }}>{formatPrice(order.total)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {activeTab === 'saved' && (
                  <motion.div
                    key="saved"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #ec4899, #db2777)',
                          boxShadow: '0 8px 20px rgba(236,72,153,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                      >
                        <Heart size={18} className="text-white" />
                      </motion.div>
                      <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{t('dashboard.savedProducts')}</h2>
                    </div>

                    {isLoadingSaved ? (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="glass-card p-5 shimmer h-24 rounded-2xl" />
                        ))}
                      </div>
                    ) : savedProducts.length === 0 ? (
                      <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="glass-card p-12 text-center"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                          style={{
                            background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(236,72,153,0.05))',
                            border: '1px solid rgba(236,72,153,0.15)',
                            boxShadow: '0 15px 40px rgba(236,72,153,0.1)',
                          }}
                        >
                          <Heart size={32} className="text-pink-400" />
                        </motion.div>
                        <p className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{t('dashboard.noSavedItems')}</p>
                        <Link href="/products">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-4 btn-primary px-8 py-3 rounded-2xl text-white text-sm font-bold"
                          >
                            {t('dashboard.browseProducts')}
                          </motion.button>
                        </Link>
                      </motion.div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedProducts.map((product, idx) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -2 }}
                            className="glass-card p-4 flex items-center gap-4 group"
                          >
                            <Link href={`/products/${product.id}`} className="shrink-0">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="rounded-xl overflow-hidden"
                                style={{
                                  width: '72px',
                                  height: '72px',
                                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                                }}
                              >
                                {product.images?.[0] ? (
                                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--overlay-bg)' }}>
                                    <ShoppingBag size={20} style={{ color: 'var(--text-muted)' }} />
                                  </div>
                                )}
                              </motion.div>
                            </Link>
                            <Link href={`/products/${product.id}`} className="flex-1 min-w-0">
                              <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</p>
                              <p className="text-sm font-bold mt-1" style={{ color: 'var(--color-primary)' }}>{formatPrice(product.price)}</p>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveSaved(product.id)}
                              className="p-2.5 rounded-xl transition-colors"
                              style={{ backgroundColor: 'rgba(239,68,68,0.08)' }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)')}
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          boxShadow: '0 8px 20px rgba(59,130,246,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                      >
                        <User size={18} className="text-white" />
                      </motion.div>
                      <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{t('dashboard.profileInfo')}</h2>
                    </div>

                    <div className="glass-card p-8">
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center text-3xl font-black text-white"
                            style={{
                              backgroundImage: user.avatar ? 'none' : 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #000))',
                              boxShadow: '0 10px 40px color-mix(in srgb, var(--color-primary) 25%, transparent)',
                            }}
                          >
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name?.charAt(0).toUpperCase()
                            )}
                          </motion.div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-white"
                            style={{
                              background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, #000))',
                              boxShadow: '0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent)',
                              border: '3px solid var(--bg-primary)',
                            }}
                          >
                            {uploadingAvatar ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Camera size={16} />
                            )}
                          </motion.button>
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleAvatarUpload}
                          />
                        </div>
                        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                          {t('dashboard.changePhoto') || 'Click to change photo'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.fullName')}</label>
                          <input
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{t('dashboard.email')}</label>
                          <input
                            value={profileEmail}
                            onChange={(e) => setProfileEmail(e.target.value)}
                            type="email"
                            className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="btn-primary mt-6 px-8 py-3 rounded-xl font-bold text-white disabled:opacity-50"
                      >
                        {savingProfile ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            {t('dashboard.saving') || 'Saving...'}
                          </span>
                        ) : (
                          t('dashboard.saveChanges')
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                          boxShadow: '0 8px 20px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
                        }}
                      >
                        <Settings size={18} className="text-white" />
                      </motion.div>
                      <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{t('dashboard.settingsTitle')}</h2>
                    </div>

                    <div className="glass-card p-8 space-y-6">
                      {[
                        { label: t('dashboard.emailNotifications'), desc: t('dashboard.emailNotificationsDesc'), color: '#f97316' },
                        { label: t('dashboard.smsNotifications'), desc: t('dashboard.smsNotificationsDesc'), color: '#3b82f6' },
                        { label: t('dashboard.marketingEmails'), desc: t('dashboard.marketingEmailsDesc'), color: '#8b5cf6' },
                      ].map((setting) => (
                        <div key={setting.label} className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--overlay-bg)' }}>
                          <div>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{setting.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{setting.desc}</p>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-12 h-6 rounded-full cursor-pointer relative"
                            style={{
                              backgroundColor: setting.color,
                              boxShadow: `0 4px 12px ${setting.color}40`,
                            }}
                          >
                            <motion.div
                              className="absolute top-1 w-4 h-4 rounded-full bg-white"
                              style={{ right: '4px' }}
                              whileHover={{ scale: 1.1 }}
                            />
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
