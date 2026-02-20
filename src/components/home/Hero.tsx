'use client';

import { useRef, memo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Star, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/lib/useTranslation';

const FloatingOrbs = dynamic(() => import('@/components/three/FloatingOrbs'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { icon: Star, value: '50K+', label: t('hero.happyCustomers') },
    { icon: Zap, value: '200+', label: t('hero.premiumProducts') },
    { icon: Shield, value: '5★', label: t('hero.averageRating') },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden isolate"
      style={{ backgroundColor: 'var(--bg-primary)', contain: 'layout style' }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <FloatingOrbs />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg z-0 opacity-40" />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--bg-primary) 30%, transparent), color-mix(in srgb, var(--bg-primary) 20%, transparent), color-mix(in srgb, var(--bg-primary) 55%, transparent))' }} />

      {/* Gradient radial — stronger glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,90vw)] h-[min(900px,90vw)] rounded-full blur-[150px] pointer-events-none z-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }} />
      <div className="absolute top-0 right-0 w-[min(500px,60vw)] h-[min(500px,60vw)] rounded-full blur-[100px] pointer-events-none z-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 6%, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-[min(400px,50vw)] h-[min(400px,50vw)] rounded-full blur-[100px] pointer-events-none z-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }} />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg mb-10"
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }} />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>
            {t('hero.badge')}
          </span>
          <ArrowRight size={14} style={{ color: 'var(--color-primary)' }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6 uppercase"
        >
          <span className="block" style={{ color: 'var(--text-primary)' }}>{t('hero.title1')}</span>
          <span className="block gradient-text glow-text">{t('hero.title2')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-14"
        >
          <Link href="/products">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold uppercase tracking-widest text-white flex items-center gap-2 group transition-all duration-200 active:scale-95"
            >
              {t('hero.shopCollection')}
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>

          <Link href="/products?gender=WOMEN">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-semibold uppercase tracking-widest glass transition-all duration-300"
              style={{ borderColor: 'transparent', color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 30%, transparent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
            >
              {t('hero.womensCollection')}
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 w-full max-w-lg mx-auto gap-2 sm:gap-3"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass-card py-3 sm:py-5 px-3 sm:px-4 text-center group transition-all" style={{ borderColor: 'transparent' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 20%, transparent)')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}>
              <Icon size={18} style={{ color: 'var(--color-primary)' }} className="mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</div>
              <div className="text-[10px] sm:text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t('hero.scroll')}</span>
            <div className="w-px h-8" style={{ backgroundImage: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-primary) 60%, transparent), transparent)' }} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
