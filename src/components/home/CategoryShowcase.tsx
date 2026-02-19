'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    gender: 'MEN',
    title: "Men's Collection",
    subtitle: 'Power. Performance. Precision.',
    description: 'Engineered for the modern athlete. From training to street.',
    href: '/products?gender=MEN',
    accent: '#3b82f6',
    gradient: 'from-blue-900/30 to-black',
    filters: ['Upper Wear', 'Lower Wear', 'Winter Wear', 'Accessories'],
  },
  {
    gender: 'WOMEN',
    title: "Women's Collection",
    subtitle: 'Bold. Beautiful. Unstoppable.',
    description: 'Designed for women who push boundaries every day.',
    href: '/products?gender=WOMEN',
    accent: '#ec4899',
    gradient: 'from-pink-900/30 to-black',
    filters: ['Upper Wear', 'Lower Wear', 'Summer Wear', 'Accessories'],
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-24 bg-[#060606] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#f97316] text-sm font-bold uppercase tracking-[0.3em] mb-4">
            Shop by Category
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Find Your <span className="gradient-text">Style</span>
          </h2>
        </motion.div>

        {/* Two column showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.gender}
              initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ minHeight: '500px' }}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`}
                style={{
                  background: `linear-gradient(135deg, ${cat.accent}22 0%, #0a0a0a 100%)`,
                }}
              />
              <div className="absolute inset-0 glass-card border-0" />

              {/* Animated background orb */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, delay: i }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: cat.accent }}
              />

              {/* Content */}
              <div className="relative z-10 p-10 h-full flex flex-col justify-between" style={{ minHeight: '500px' }}>
                <div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 border"
                    style={{
                      color: cat.accent,
                      borderColor: `${cat.accent}40`,
                      backgroundColor: `${cat.accent}15`,
                    }}
                  >
                    {cat.gender === 'MEN' ? "Men's" : "Women's"}
                  </div>

                  <h3 className="text-4xl font-black text-white mb-3">{cat.title}</h3>
                  <p className="text-lg font-semibold mb-4" style={{ color: cat.accent }}>
                    {cat.subtitle}
                  </p>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                    {cat.description}
                  </p>
                </div>

                {/* Filter tags */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {cat.filters.map((filter) => (
                      <span
                        key={filter}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border text-white/60 border-white/10 hover:border-white/30 hover:text-white/80 transition-all cursor-pointer"
                      >
                        {filter}
                      </span>
                    ))}
                  </div>

                  <Link href={cat.href}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 px-8 py-4 rounded-full font-bold text-white group-hover:gap-4 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}99)`,
                        boxShadow: `0 0 30px ${cat.accent}33`,
                      }}
                    >
                      Shop Now
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
