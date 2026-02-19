'use client';

import { Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { Product, ProductFilters as IProductFilters } from '@/types';
import axios from 'axios';

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
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/40">Loading products...</div>}>
      <ProductsPageInner />
    </Suspense>
  );
}

function ProductsPageInner() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IProductFilters>({
    gender: (searchParams.get('gender') as IProductFilters['gender']) || undefined,
    sortBy: (searchParams.get('sort') as IProductFilters['sortBy']) || 'newest',
  });

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
      <div className="min-h-screen bg-[#0a0a0a] pt-24">
        {/* Header */}
        <div className="relative py-16 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,90vw)] h-[min(300px,50vw)] bg-[#f97316]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[#f97316] text-sm font-bold uppercase tracking-widest mb-3">
                {filters.gender ? `${filters.gender}'s Collection` : 'All Products'}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                {filters.gender === 'MEN' ? (
                  <>Men&apos;s <span className="gradient-text">Collection</span></>
                ) : filters.gender === 'WOMEN' ? (
                  <>Women&apos;s <span className="gradient-text">Collection</span></>
                ) : (
                  <>Our <span className="gradient-text">Collection</span></>
                )}
              </h1>
              <p className="text-white/40 text-lg">{products.length} products found</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Controls */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                showFilters ? 'bg-[#f97316] text-white' : 'glass text-white/70 hover:text-white'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-white text-[#f97316] rounded-full text-xs font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>

            {/* Active filters */}
            <div className="flex items-center gap-2 flex-wrap flex-1">
              {filters.gender && (
                <span className="flex items-center gap-1 px-3 py-1 glass rounded-full text-xs text-white/70">
                  {filters.gender}
                  <button onClick={() => setFilters((f) => ({ ...f, gender: undefined }))}>
                    <X size={12} className="hover:text-[#f97316]" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="flex items-center gap-1 px-3 py-1 glass rounded-full text-xs text-white/70">
                  {filters.category.replace('_', ' ')}
                  <button onClick={() => setFilters((f) => ({ ...f, category: undefined }))}>
                    <X size={12} className="hover:text-[#f97316]" />
                  </button>
                </span>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, sortBy: e.target.value as IProductFilters['sortBy'] }))
                }
                className="input-glass pl-4 pr-10 py-2.5 rounded-full text-sm appearance-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="popularity">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex gap-4 sm:gap-8">
            {/* Filters Sidebar */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'min(280px, 80vw)' }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <ProductFilters filters={filters} onFiltersChange={setFilters} />
                </motion.div>
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
                    className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="glass-card aspect-[3/4] shimmer rounded-2xl" />
                    ))}
                  </motion.div>
                ) : products.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <SlidersHorizontal size={32} className="text-white/20" />
                    </div>
                    <h3 className="text-white/60 font-semibold mb-2">No products found</h3>
                    <p className="text-white/30 text-sm">Try adjusting your filters</p>
                    <button
                      onClick={() => setFilters({ sortBy: 'newest' })}
                      className="mt-4 text-[#f97316] text-sm hover:underline"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
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
