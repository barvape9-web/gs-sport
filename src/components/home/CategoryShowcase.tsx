'use client';

import { useRef, useState, useCallback, useEffect, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

function CategoryShowcase() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const categories = [
    {
      gender: 'MEN',
      title: t('categories.mensTitle'),
      subtitle: t('categories.mensSubtitle'),
      description: t('categories.mensDesc'),
      href: '/products?gender=MEN',
      accent: '#3b82f6',
      gradient: 'from-blue-900/30 to-black',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      filters: [t('categories.upperWear'), t('categories.lowerWear'), t('categories.winterWear'), t('categories.accessories')],
    },
    {
      gender: 'WOMEN',
      title: t('categories.womensTitle'),
      subtitle: t('categories.womensSubtitle'),
      description: t('categories.womensDesc'),
      href: '/products?gender=WOMEN',
      accent: '#ec4899',
      gradient: 'from-pink-900/30 to-black',
      image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80',
      filters: [t('categories.upperWear'), t('categories.lowerWear'), t('categories.summerWear'), t('categories.accessories')],
    },
  ];

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const idx = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveSlide(idx);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = useCallback((idx: number) => {
    scrollRef.current?.scrollTo({ left: idx * (scrollRef.current?.offsetWidth ?? 0), behavior: 'smooth' });
  }, []);

  return (
    <section className="py-12 sm:py-20 lg:py-24 relative overflow-hidden isolate" style={{ backgroundColor: 'var(--bg-secondary)', contentVisibility: 'auto', containIntrinsicSize: '0 700px' }}>
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-8 sm:mb-16"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4" style={{ color: 'var(--color-primary)' }}>
            {t('categories.shopByCategory')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
            {t('categories.findYourStyle')} <span className="gradient-text">{t('categories.findYourStyleAccent')}</span>
          </h2>
        </motion.div>

        {/* Mobile: Horizontal swipe carousel */}
        <div
          ref={scrollRef}
          className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
          style={{ WebkitOverflowScrolling: 'touch', scrollPaddingInline: '1rem' }}
        >
          {categories.map((cat, i) => (
            <div
              key={cat.gender}
              className="snap-center flex-shrink-0 w-[85vw] max-w-[400px]"
            >
              <CategoryCard cat={cat} i={i} t={t} />
            </div>
          ))}
        </div>

        {/* Mobile dot indicators */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {categories.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: activeSlide === i ? 'var(--color-primary)' : 'var(--text-muted)',
                opacity: activeSlide === i ? 1 : 0.3,
                transform: activeSlide === i ? 'scale(1.3)' : 'scale(1)',
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.gender}
              initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <CategoryCard cat={cat} i={i} t={t} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  cat: {
    gender: string;
    title: string;
    subtitle: string;
    description: string;
    href: string;
    accent: string;
    image: string;
    filters: string[];
  };
  i: number;
  t: (key: string) => string;
}

const CategoryCard = memo(function CategoryCard({ cat, i, t }: CategoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer min-h-[300px] sm:min-h-[400px] md:min-h-[480px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={cat.image}
          alt={cat.title}
          fill
          sizes="(max-width: 768px) 85vw, 50vw"
          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
          loading="lazy"
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

      {/* Static orb glow (no infinite animation) */}
      <div
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: cat.accent }}
      />

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-8 md:p-10 h-full flex flex-col justify-between min-h-[300px] sm:min-h-[400px] md:min-h-[480px]">
        <div>
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 border"
            style={{
              color: cat.accent,
              borderColor: `${cat.accent}40`,
              backgroundColor: `${cat.accent}15`,
            }}
          >
            {cat.gender === 'MEN' ? t('categories.mens') : t('categories.womens')}
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3">{cat.title}</h3>
          <p className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4" style={{ color: cat.accent }}>
            {cat.subtitle}
          </p>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            {cat.description}
          </p>
        </div>

        {/* Filter tags */}
        <div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
            {cat.filters.map((filter) => (
              <span
                key={filter}
                className="px-3 py-1.5 rounded-full text-xs font-medium border text-white/60 border-white/10 hover:border-white/30 hover:text-white/80 transition-colors cursor-pointer"
              >
                {filter}
              </span>
            ))}
          </div>

          <Link href={cat.href}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-white transition-all duration-300 text-sm sm:text-base active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${cat.accent}, ${cat.accent}99)`,
                boxShadow: `0 0 30px ${cat.accent}33`,
              }}
            >
              {t('categories.shopNow')}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default memo(CategoryShowcase);
