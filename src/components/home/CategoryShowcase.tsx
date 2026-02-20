'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80',
    filters: ['Upper Wear', 'Lower Wear', 'Summer Wear', 'Accessories'],
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-12 sm:py-24 bg-[#060606] relative overflow-hidden isolate">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4" style={{ color: 'var(--color-primary)' }}>
            Shop by Category
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
            Find Your <span className="gradient-text">Style</span>
          </h2>
        </motion.div>

        {/* Two column showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.gender}
              initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl cursor-pointer min-h-[350px] sm:min-h-[450px] md:min-h-[500px]"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Dark overlay for readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${cat.accent}40 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.95) 100%)`,
                }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }} />

              {/* Animated background orb */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, delay: i }}
                className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: cat.accent }}
              />

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-between min-h-[350px] sm:min-h-[450px] md:min-h-[500px]">
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

                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">{cat.title}</h3>
                  <p className="text-base sm:text-lg font-semibold mb-4" style={{ color: cat.accent }}>
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
