'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Truck, RefreshCw, Star, HeadphonesIcon } from 'lucide-react';
import { useTranslation } from '@/lib/useTranslation';

export default function WhyUs() {
  const { t } = useTranslation();

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
  return (
    <section className="py-12 sm:py-20 lg:py-24 relative overflow-hidden isolate" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Decorative orb */}
      <div className="absolute bottom-0 left-0 w-[min(600px,90vw)] h-[min(600px,90vw)] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="glass-card p-5 sm:p-7 group cursor-default"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}20` }}
              >
                <feature.icon size={22} style={{ color: feature.color }} />
              </div>

              {/* Content */}
              <h3 className="font-bold text-base sm:text-lg mb-2 transition-colors"
                style={{ color: 'var(--text-primary)', '--hover-c': 'var(--color-primary)' } as React.CSSProperties}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{feature.description}</p>

              {/* Bottom accent line */}
              <motion.div
                className="mt-5 h-px"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                style={{ background: `linear-gradient(90deg, ${feature.color}40, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-8 py-4 rounded-full font-bold text-white inline-block"
            >
              {t('whyUs.shopNow')}
            </motion.a>
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-semibold text-white inline-block transition-all"
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
