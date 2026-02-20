'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Star, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';

const FloatingOrbs = dynamic(() => import('@/components/three/FloatingOrbs'), {
  ssr: false,
  loading: () => null,
});

const stats = [
  { icon: Star, value: '50K+', label: 'Happy Customers' },
  { icon: Zap, value: '200+', label: 'Premium Products' },
  { icon: Shield, value: '5★', label: 'Average Rating' },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <FloatingOrbs />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg z-0 opacity-60" />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70 z-0 pointer-events-none" />

      {/* Gradient radial — stronger glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,90vw)] h-[min(900px,90vw)] rounded-full bg-[#f97316]/10 blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-[min(500px,60vw)] h-[min(500px,60vw)] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[min(400px,50vw)] h-[min(400px,50vw)] rounded-full bg-[#f97316]/8 blur-[100px] pointer-events-none z-0" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg mb-10"
        >
          <span className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
          <span className="text-xs sm:text-sm text-white/70 font-semibold uppercase tracking-[0.2em]">
            New Season Collection 2026
          </span>
          <ArrowRight size={14} className="text-[#f97316]" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6 uppercase"
        >
          <span className="block text-white">Unleash</span>
          <span className="block gradient-text glow-text">Your Power</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Premium sportswear engineered for peak performance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16"
        >
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(249, 115, 22, 0.35)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-10 py-4 rounded-lg text-base sm:text-lg font-semibold uppercase tracking-widest text-white flex items-center gap-2 group transition-all duration-300"
            >
              Shop Collection
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.span>
            </motion.button>
          </Link>

          <Link href="/products?gender=WOMEN">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-lg text-base sm:text-lg font-semibold uppercase tracking-widest text-white glass hover:border-[#f97316]/30 transition-all duration-300"
            >
              Women&apos;s Collection
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 w-full max-w-lg mx-auto gap-1 sm:gap-2"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass-card py-3 sm:py-5 px-2 sm:px-4 text-center group hover:border-[#f97316]/20 transition-all">
              <Icon size={20} className="text-[#f97316] mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-black text-white">{value}</div>
              <div className="text-[10px] sm:text-xs text-white/40 mt-0.5 font-medium">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/30 uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-[#f97316]/60 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
