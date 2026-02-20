'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';
import { useTranslation } from '@/lib/useTranslation';

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MEN' | 'WOMEN'>('ALL');
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products?featured=true&limit=8');
        setProducts(res.data.products || []);
      } catch {
        setProducts(getMockProducts());
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    activeFilter === 'ALL'
      ? products
      : products.filter((p) => p.gender === activeFilter);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.offsetWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [updateScrollButtons, filteredProducts]);

  const scrollBy = useCallback((dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  }, []);

  return (
    <section className="py-12 sm:py-20 lg:py-24 relative overflow-hidden isolate" style={{ backgroundColor: 'var(--bg-primary)', contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[min(500px,90vw)] h-[min(500px,90vw)] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
              <TrendingUp size={16} />
              {t('featured.title')}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
              {t('featured.bestSellers')} <span className="gradient-text">{t('featured.bestSellersAccent')}</span>
            </h2>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            {(['ALL', 'MEN', 'WOMEN'] as const).map((filter) => {
              const filterLabel = filter === 'ALL' ? t('featured.all') : filter === 'MEN' ? t('featured.men') : t('featured.women');
              return (
              <motion.button
                key={filter}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'text-white'
                    : 'glass text-white/60 hover:text-white'
                }`}
                style={activeFilter === filter ? { backgroundColor: 'var(--color-primary)', boxShadow: '0 0 20px color-mix(in srgb, var(--color-primary) 30%, transparent)' } : undefined}
              >
                {filterLabel}
              </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile: Horizontal swipe carousel */}
        <div className="sm:hidden relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <AnimatePresence mode="wait">
              {isLoading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={`skel-${i}`} className="snap-start flex-shrink-0 w-[70vw] max-w-[280px]">
                      <div className="glass-card aspect-[3/4] shimmer rounded-xl" />
                    </div>
                  ))
                : filteredProducts.map((product) => (
                    <div key={product.id} className="snap-start flex-shrink-0 w-[70vw] max-w-[280px]">
                      <ProductCard product={product} />
                    </div>
                  ))}
            </AnimatePresence>
          </div>

          {/* Scroll arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scrollBy(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full glass flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} style={{ color: 'var(--text-primary)' }} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scrollBy(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full glass flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} style={{ color: 'var(--text-primary)' }} />
            </button>
          )}
        </div>

        {/* Desktop: Grid layout */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 items-stretch"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card aspect-[3/4] shimmer rounded-xl sm:rounded-2xl" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 items-stretch"
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="flex justify-center mt-12"
        >
          <Link href="/products">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 btn-primary rounded-full font-semibold text-white group active:scale-95"
            >
              {t('featured.viewAll')}
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(FeaturedProducts);

function getMockProducts(): Product[] {
  const categories = ['UPPER_WEAR', 'LOWER_WEAR', 'ACCESSORIES'] as const;
  const genders = ['MEN', 'WOMEN'] as const;
  const names = [
    'Pro Performance Tee',
    'Elite Running Shorts',
    'Sport Cap',
    'Training Jacket',
    'Compression Leggings',
    'Performance Hoodie',
    'Athletic Tank Top',
    'Sport Sneakers',
  ];

  return names.map((name, i) => ({
    id: `mock-${i}`,
    name,
    description: 'High-performance athletic wear designed for maximum comfort and style.',
    price: 49.99 + i * 15,
    originalPrice: 79.99 + i * 15,
    images: [],
    gender: genders[i % 2],
    category: categories[i % 3],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Orange'],
    stock: 50,
    isActive: true,
    isFeatured: true,
    popularity: 100 - i * 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}
