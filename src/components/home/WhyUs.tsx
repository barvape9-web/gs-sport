'use client';

import { useRef, useState, useCallback, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Truck, RefreshCw, Star, HeadphonesIcon } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

function WhyUs() {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const features = [
    {
      icon: Zap,
      title: t('whyUs.highPerformance'),
      description: t('whyUs.highPerformanceDesc'),
      color: 'var(--color-primary)',
    },
    {
      icon: Shield,
      title: t('whyUs.premiumQuality'),
      description: t('whyUs.premiumQualityDesc'),
      color: '#3b82f6',
    },
    {
      icon: Truck,
      title: t('whyUs.fastShipping'),
      description: t('whyUs.fastShippingDesc'),
      color: '#10b981',
    },
    {
      icon: RefreshCw,
      title: t('whyUs.easyReturns'),
      description: t('whyUs.easyReturnsDesc'),
      color: '#8b5cf6',
    },
    {
      icon: Star,
      title: t('whyUs.fiveStarRated'),
      description: t('whyUs.fiveStarRatedDesc'),
      color: '#f59e0b',
    },
    {
      icon: HeadphonesIcon,
      title: t('whyUs.support'),
      description: t('whyUs.supportDesc'),
      color: '#ec4899',
    },
  ];

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const cardWidth = 260;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveSlide(Math.min(idx, features.length - 1));
  }, [features.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollTo = useCallback((idx: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 260;
    scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
  }, []);

  return (
    <section className="py-12 sm:py-20 lg:py-24 relative overflow-hidden isolate" style={{ backgroundColor: 'var(--bg-primary)', contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Decorative orb */}
      <div className="absolute bottom-0 left-0 w-[min(600px,90vw)] h-[min(600px,90vw)] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="text-center mb-10 sm:mb-16"
        >
          <p className="text-sm font-bold uppercase tracking-[0.3em] mb-4" style={{ color: 'var(--color-primary)' }}>
            {t('whyUs.subtitle')}
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('whyUs.title')} <span className="gradient-text">{t('whyUs.titleAccent')}</span> 
          </h2>
          <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            {t('whyUs.description')}
          </p>
        </motion.div>

        {/* Mobile: Horizontal swipe carousel */}
        <div className="sm:hidden">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4 pb-4"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {features.map((feature, i) => (
              <div key={feature.title} className="snap-start flex-shrink-0 w-[75vw] max-w-[280px]">
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-4">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: activeSlide === i ? 'var(--color-primary)' : 'var(--text-muted)',
                  opacity: activeSlide === i ? 1 : 0.3,
                  transform: activeSlide === i ? 'scale(1.4)' : 'scale(1)',
                }}
                aria-label={`Feature ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Features Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          className="mt-8 sm:mt-16 glass-card p-5 sm:p-8 md:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, color-mix(in srgb, var(--color-primary) 5%, transparent), transparent, color-mix(in srgb, var(--color-primary) 5%, transparent))' }} />
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            {t('whyUs.cta')}
          </h3>
          <p className="mb-6 sm:mb-8" style={{ color: 'var(--text-muted)' }}>
            {t('whyUs.ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/products"
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-8 py-4 rounded-full font-bold text-white inline-block active:scale-95"
            >
              {t('whyUs.shopNow')}
            </motion.a>
            <motion.a
              href="/register"
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-semibold text-white inline-block transition-colors active:scale-95"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 30%, transparent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
            >
              {t('whyUs.createAccount')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: {
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    title: string;
    description: string;
    color: string;
  };
}

const FeatureCard = memo(function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <div className="glass-card p-5 sm:p-7 group cursor-default h-full">
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}20` }}
      >
        <feature.icon size={22} style={{ color: feature.color }} />
      </div>

      {/* Content */}
      <h3 className="font-bold text-base sm:text-lg mb-2 transition-colors"
        style={{ color: 'var(--text-primary)' }}
      >
        {feature.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{feature.description}</p>

      {/* Bottom accent line */}
      <div
        className="mt-5 h-px w-full"
        style={{ background: `linear-gradient(90deg, ${feature.color}40, transparent)` }}
      />
    </div>
  );
});

export default memo(WhyUs);
