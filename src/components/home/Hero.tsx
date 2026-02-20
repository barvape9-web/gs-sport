'use client';

import { useRef, useState, useCallback, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence, type PanInfo } from 'framer-motion';
import { ArrowRight, Zap, Star, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/lib/useTranslation';

const FloatingOrbs = dynamic(() => import('@/components/three/FloatingOrbs'), {
  ssr: false,
  loading: () => null,
});

const SLIDE_COUNT = 2;
const AUTO_INTERVAL = 6000;
const SWIPE_THRESHOLD = 50;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

export default function Hero() {
  const { t } = useTranslation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stats = [
    { icon: Star, value: '50K+', label: t('hero.happyCustomers') },
    { icon: Zap, value: '200+', label: t('hero.premiumProducts') },
    { icon: Shield, value: '5★', label: t('hero.averageRating') },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeSlide ? 1 : -1);
    setActiveSlide(idx);
  }, [activeSlide]);

  const next = useCallback(() => {
    setDirection(1);
    setActiveSlide((p) => (p + 1) % SLIDE_COUNT);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActiveSlide((p) => (p - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTO_INTERVAL);
  }, [next]);

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) { next(); resetTimer(); }
    else if (info.offset.x > SWIPE_THRESHOLD) { prev(); resetTimer(); }
  }, [next, prev, resetTimer]);

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

      {/* Gradient radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,90vw)] h-[min(900px,90vw)] rounded-full blur-[150px] pointer-events-none z-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }} />
      <div className="absolute top-0 right-0 w-[min(500px,60vw)] h-[min(500px,60vw)] rounded-full blur-[100px] pointer-events-none z-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 6%, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-[min(400px,50vw)] h-[min(400px,50vw)] rounded-full blur-[100px] pointer-events-none z-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }} />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 w-full"
      >
        {/* Swipe carousel container */}
        <div className="relative overflow-hidden touch-pan-y">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {activeSlide === 0 && (
              <motion.div
                key="slide-main"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
                className="text-center cursor-grab active:cursor-grabbing"
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
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-tight mb-6 uppercase">
                  <span className="block" style={{ color: 'var(--text-primary)' }}>{t('hero.title1')}</span>
                  <span className="block gradient-text glow-text">{t('hero.title2')}</span>
                </h1>

                {/* Subtitle */}
                <p
                  className="text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t('hero.subtitle')}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-14">
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
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 w-full max-w-lg mx-auto gap-2 sm:gap-3">
                  {stats.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="glass-card py-3 sm:py-5 px-3 sm:px-4 text-center group transition-all" style={{ borderColor: 'transparent' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 20%, transparent)')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}>
                      <Icon size={18} style={{ color: 'var(--color-primary)' }} className="mx-auto mb-1 sm:mb-2" />
                      <div className="text-lg sm:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</div>
                      <div className="text-[10px] sm:text-xs mt-0.5 font-medium" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSlide === 1 && (
              <motion.div
                key="slide-georgia"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={handleDragEnd}
                className="flex flex-col items-center justify-center cursor-grab active:cursor-grabbing min-h-[50vh] sm:min-h-[55vh]"
              >
                {/* Made in Georgia image */}
                <div className="relative w-[280px] h-[200px] sm:w-[420px] sm:h-[300px] md:w-[520px] md:h-[370px] lg:w-[620px] lg:h-[440px]">
                  <Image
                    src="/made-in-georgia.png"
                    alt="Made in Georgia"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>

                {/* Caption */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg font-semibold uppercase tracking-[0.25em] text-center"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  🇬🇪 {t('hero.madeInGeorgia')}
                </motion.p>

                <Link href="/products" className="mt-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary px-8 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-widest text-white flex items-center gap-2 group"
                  >
                    {t('hero.shopCollection')}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Slide indicators + nav arrows */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => { prev(); resetTimer(); }}
            className="w-8 h-8 rounded-full glass flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetTimer(); }}
                className="relative h-2 rounded-full transition-all duration-300 overflow-hidden"
                style={{
                  width: activeSlide === i ? 28 : 8,
                  backgroundColor: activeSlide === i
                    ? 'var(--color-primary)'
                    : 'color-mix(in srgb, var(--text-muted) 30%, transparent)',
                }}
              >
                {activeSlide === i && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: AUTO_INTERVAL / 1000, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 70%, #fff)' }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => { next(); resetTimer(); }}
            className="w-8 h-8 rounded-full glass flex items-center justify-center transition-all hover:scale-110"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

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
