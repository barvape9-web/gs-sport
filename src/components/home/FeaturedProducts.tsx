'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'MEN' | 'WOMEN'>('ALL');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products?featured=true&limit=8');
        setProducts(res.data.products || []);
      } catch {
        // Use mock data if API not available
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

  return (
    <section className="py-12 sm:py-24 bg-[#0a0a0a] relative overflow-hidden isolate">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[min(500px,90vw)] h-[min(500px,90vw)] bg-[#f97316]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-[#f97316] text-sm font-semibold uppercase tracking-widest mb-3">
              <TrendingUp size={16} />
              Featured Collection
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Best <span className="gradient-text">Sellers</span>
            </h2>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-2"
          >
            {(['ALL', 'MEN', 'WOMEN'] as const).map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-[#f97316] text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card aspect-[3/4] shimmer rounded-2xl" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
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
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 btn-primary rounded-full font-semibold text-white group"
            >
              View All Products
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

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
