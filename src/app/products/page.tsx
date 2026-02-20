'use client';

import { Suspense, useMemo } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Sparkles, TrendingUp, ArrowUpDown, ArrowDown01, ArrowUp01 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Product, ProductFilters as IProductFilters } from '@/types';
import axios from 'axios';
import { useTranslation } from '@/lib/useTranslation';

/* ── Gender-based color themes ── */
const genderThemes = {
  MEN: {
    accent: '#f97316',        // orange
    accentLight: 'rgba(249,115,22,0.15)',
    accentMid: 'rgba(249,115,22,0.08)',
    accentFaint: 'rgba(249,115,22,0.04)',
    glow: 'rgba(249,115,22,0.12)',
    glowStrong: 'rgba(249,115,22,0.2)',
    border: 'rgba(249,115,22,0.15)',
    badgeBg: 'rgba(249,115,22,0.12)',
    gradientFrom: '#f97316',
    gradientTo: '#fb923c',
    tagBg: 'rgba(249,115,22,0.1)',
    tagBorder: 'rgba(249,115,22,0.2)',
  },
  WOMEN: {
    accent: '#ec4899',        // pink
    accentLight: 'rgba(236,72,153,0.15)',
    accentMid: 'rgba(236,72,153,0.08)',
    accentFaint: 'rgba(236,72,153,0.04)',
    glow: 'rgba(236,72,153,0.12)',
    glowStrong: 'rgba(236,72,153,0.2)',
    border: 'rgba(236,72,153,0.15)',
    badgeBg: 'rgba(236,72,153,0.12)',
    gradientFrom: '#ec4899',
    gradientTo: '#f472b6',
    tagBg: 'rgba(236,72,153,0.1)',
    tagBorder: 'rgba(236,72,153,0.2)',
  },
  DEFAULT: {
    accent: '#f97316',
    accentLight: 'rgba(249,115,22,0.15)',
    accentMid: 'rgba(249,115,22,0.08)',
    accentFaint: 'rgba(249,115,22,0.04)',
    glow: 'rgba(249,115,22,0.12)',
    glowStrong: 'rgba(249,115,22,0.2)',
    border: 'rgba(249,115,22,0.15)',
    badgeBg: 'rgba(249,115,22,0.12)',
    gradientFrom: '#f97316',
    gradientTo: '#fb923c',
    tagBg: 'rgba(249,115,22,0.1)',
    tagBorder: 'rgba(249,115,22,0.2)',
  },
} as const;

const MOCK_PRODUCTS: Product[] = Array.from({ length: 24 }, (_, i) => ({
  id: `prod-${i}`,
  name: [
    'Pro Training Tee',
    'Elite Running Shorts',
    'Performance Hoodie',
    'Compression Leggings',
    'Sport Cap',
    'Training Jacket',
    'Athletic Tank Top',
    'Sport Sneakers',
  ][i % 8],
  description: 'High-performance athletic wear.',
  price: 29.99 + i * 8,
  originalPrice: i % 3 === 0 ? 59.99 + i * 8 : undefined,
  images: [],
  gender: i % 2 === 0 ? 'MEN' : 'WOMEN',
  category: (['UPPER_WEAR', 'LOWER_WEAR', 'WINTER_WEAR', 'SUMMER_WEAR', 'ACCESSORIES'] as const)[i % 5],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: ['Black', 'White', 'Orange'],
  stock: 50,
  isActive: true,
  isFeatured: i < 4,
  popularity: 100 - i * 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>Loading products...</div>}>
      <ProductsPageInner />
    </Suspense>
  );
}

function ProductsPageInner() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [filters, setFilters] = useState<IProductFilters>({
    gender: (searchParams.get('gender') as IProductFilters['gender']) || undefined,
    sortBy: (searchParams.get('sort') as IProductFilters['sortBy']) || 'newest',
  });

  const theme = useMemo(() => {
    if (filters.gender === 'WOMEN') return genderThemes.WOMEN;
    if (filters.gender === 'MEN') return genderThemes.MEN;
    return genderThemes.DEFAULT;
  }, [filters.gender]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.gender) params.set('gender', filters.gender);
      if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
      if (filters.sortBy) params.set('sortBy', filters.sortBy);
      if (filters.search) params.set('search', filters.search);

      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data.products || []);
    } catch {
      // Use mock data
      let filtered = MOCK_PRODUCTS;
      if (filters.gender) filtered = filtered.filter((p) => p.gender === filters.gender);
      if (filters.category) filtered = filtered.filter((p) => p.category === filters.category);
      if (filters.minPrice) filtered = filtered.filter((p) => p.price >= filters.minPrice!);
      if (filters.maxPrice) filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
      if (filters.sortBy === 'popularity') filtered.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
      if (filters.sortBy === 'price_asc') filtered.sort((a, b) => a.price - b.price);
      if (filters.sortBy === 'price_desc') filtered.sort((a, b) => b.price - a.price);
      setProducts(filtered);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Header — gender-themed */}
        <div className="relative py-16 overflow-hidden" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* Animated glow blob — color changes with gender */}
          <motion.div
            key={filters.gender || 'all'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,90vw)] h-[min(300px,50vw)] rounded-full blur-[80px] pointer-events-none"
            style={{ backgroundColor: theme.glow }}
          />

          {/* Side accent glows for gender */}
          {filters.gender && (
            <>
              <motion.div
                key={`glow-l-${filters.gender}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: [0.3, 0.5, 0.3], x: 0 }}
                transition={{ opacity: { duration: 3, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0.6 } }}
                className="absolute -left-20 top-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none"
                style={{ backgroundColor: theme.glowStrong }}
              />
              <motion.div
                key={`glow-r-${filters.gender}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: [0.2, 0.4, 0.2], x: 0 }}
                transition={{ opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, x: { duration: 0.6 } }}
                className="absolute -right-20 top-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full blur-[80px] pointer-events-none"
                style={{ backgroundColor: theme.glowStrong }}
              />
            </>
          )}

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={filters.gender || 'all'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <motion.p
                  className="text-sm font-bold uppercase tracking-widest mb-3"
                  style={{ color: theme.accent }}
                >
                  {filters.gender ? t(`products.${filters.gender.toLowerCase()}Collection`) : t('products.allProducts')}
                </motion.p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
                  {filters.gender === 'MEN' ? (
                    <>{t('products.mensCollectionTitle')} <span style={{ background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('products.collection')}</span></>
                  ) : filters.gender === 'WOMEN' ? (
                    <>{t('products.womensCollectionTitle')} <span style={{ background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('products.collection')}</span></>
                  ) : (
                    <>{t('products.ourCollection')} <span className="gradient-text">{t('products.collection')}</span></>
                  )}
                </h1>

                {/* Animated accent line */}
                <motion.div
                  className="mx-auto h-0.5 rounded-full mb-4"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
                />

                <p className="text-base sm:text-lg" style={{ color: 'var(--text-muted)' }}>{products.length} {t('products.productsFound')}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Controls */}
          <div className="mb-6 sm:mb-8 space-y-3">
            {/* Top row: filter button + sort */}
            <div className="flex items-center justify-between gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${
                  showFilters ? 'text-white' : 'glass'
                }`}
                style={showFilters ? { backgroundColor: theme.accent } : { color: 'var(--text-secondary)' }}
              >
                <SlidersHorizontal size={16} />
                {t('products.filters')}
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-white rounded-full text-xs font-bold flex items-center justify-center" style={{ color: theme.accent }}>
                    {activeFilterCount}
                  </span>
                )}
              </motion.button>

              {/* Sort */}
              <div className="relative shrink-0">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 pl-2.5 sm:pl-4 pr-7 sm:pr-10 py-1.5 sm:py-2.5 rounded-full text-[10px] sm:text-sm cursor-pointer max-w-[140px] sm:max-w-none transition-all duration-200"
                  style={{
                    background: showSortDropdown
                      ? `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}10)`
                      : 'var(--overlay-bg)',
                    border: showSortDropdown
                      ? `1px solid ${theme.accent}40`
                      : '1px solid var(--border-subtle)',
                    color: showSortDropdown ? theme.accent : 'var(--text-secondary)',
                  }}
                >
                  <ArrowUpDown size={12} className="shrink-0" />
                  <span className="truncate">
                    {[
                      { value: 'newest', label: t('products.newest') },
                      { value: 'popularity', label: t('products.mostPopular') },
                      { value: 'price_asc', label: t('products.priceLowHigh') },
                      { value: 'price_desc', label: t('products.priceHighLow') },
                    ].find(o => o.value === filters.sortBy)?.label || t('products.newest')}
                  </span>
                </motion.button>
                <motion.div
                  className="absolute right-2 sm:right-3 top-1/2 pointer-events-none"
                  animate={{ rotate: showSortDropdown ? 180 : 0 }}
                  style={{ y: '-50%' }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
                </motion.div>

                {/* Custom dropdown */}
                <AnimatePresence>
                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 z-50 w-56 overflow-hidden rounded-2xl"
                        style={{
                          background: 'var(--bg-elevated)',
                          backdropFilter: 'blur(20px)',
                          border: `1px solid ${theme.accent}25`,
                          boxShadow: `0 20px 60px var(--shadow-color), 0 0 30px ${theme.accent}10`,
                        }}
                      >
                        <div className="p-1.5">
                          {[
                            { value: 'newest', label: t('products.newest'), icon: Sparkles, color: '#f97316' },
                            { value: 'popularity', label: t('products.mostPopular'), icon: TrendingUp, color: '#22c55e' },
                            { value: 'price_asc', label: t('products.priceLowHigh'), icon: ArrowUp01, color: '#3b82f6' },
                            { value: 'price_desc', label: t('products.priceHighLow'), icon: ArrowDown01, color: '#a855f7' },
                          ].map(({ value, label, icon: SortIcon, color }, index) => {
                            const isActive = filters.sortBy === value;
                            return (
                              <motion.button
                                key={value}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                  setFilters((f) => ({ ...f, sortBy: value as IProductFilters['sortBy'] }));
                                  setShowSortDropdown(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group/sort"
                                style={{
                                  background: isActive ? `${color}15` : 'transparent',
                                  border: isActive ? `1px solid ${color}25` : '1px solid transparent',
                                }}
                                whileHover={{ x: 3 }}
                              >
                                <motion.div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                  style={{
                                    background: isActive ? `${color}20` : 'var(--overlay-bg)',
                                    boxShadow: isActive ? `0 2px 10px ${color}20` : 'none',
                                    border: `1px solid ${isActive ? color + '30' : 'var(--border-subtle)'}`,
                                  }}
                                  whileHover={{
                                    scale: 1.1,
                                    rotateY: 15,
                                    boxShadow: `0 4px 16px ${color}30`,
                                  }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                >
                                  <SortIcon size={14} style={{ color: isActive ? color : 'var(--text-muted)' }} />
                                </motion.div>
                                <span
                                  className="text-xs font-medium flex-1"
                                  style={{ color: isActive ? color : 'var(--text-secondary)' }}
                                >
                                  {label}
                                </span>
                                {isActive && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Active filter tags — separate row */}
            <AnimatePresence>
              {(filters.gender || filters.category) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 flex-wrap overflow-hidden"
                >
                  {filters.gender && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: theme.tagBg, border: `1px solid ${theme.tagBorder}`, color: 'var(--text-primary)' }}
                    >
                      {filters.gender}
                      <button onClick={() => setFilters((f) => ({ ...f, gender: undefined }))} className="hover:opacity-70 transition-opacity">
                        <X size={12} />
                      </button>
                    </motion.span>
                  )}
                  {filters.category && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: theme.tagBg, border: `1px solid ${theme.tagBorder}`, color: 'var(--text-primary)' }}
                    >
                      {filters.category.replace('_', ' ')}
                      <button onClick={() => setFilters((f) => ({ ...f, category: undefined }))} className="hover:opacity-70 transition-opacity">
                        <X size={12} />
                      </button>
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 sm:gap-8 relative">
            {/* Filters Sidebar — overlay on mobile, inline on desktop */}
            <AnimatePresence>
              {showFilters && (
                <>
                  {/* Mobile backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowFilters(false)}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: -20, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: 'min(280px, 80vw)' }}
                    exit={{ opacity: 0, x: -20, width: 0 }}
                    className="fixed left-0 top-0 bottom-0 z-50 pt-24 pb-6 px-3 overflow-y-auto lg:relative lg:z-auto lg:pt-0 lg:pb-0 lg:px-0 flex-shrink-0"
                    style={{ backgroundColor: 'var(--bg-primary)' }}
                  >
                    {/* Close button — mobile only */}
                    <button
                      onClick={() => setShowFilters(false)}
                      className="absolute top-20 right-3 z-10 p-2 rounded-full glass lg:hidden"
                    >
                      <X size={16} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <ProductFilters filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Products Grid */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 sm:gap-4"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="glass-card aspect-[3/4] shimmer rounded-xl" />
                    ))}
                  </motion.div>
                ) : products.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--overlay-bg)' }}>
                      <SlidersHorizontal size={32} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{t('products.noProducts')}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('products.tryAdjusting')}</p>
                    <button
                      onClick={() => setFilters({ sortBy: 'newest' })}
                      className="mt-4 text-sm hover:underline"
                      style={{ color: theme.accent }}
                    >
                      {t('products.clearAllFilters')}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 sm:gap-4"
                  >
                    {products.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.4 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
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
