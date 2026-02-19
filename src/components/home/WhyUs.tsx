'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Truck, RefreshCw, Star, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Every product engineered for maximum performance and durability.',
    color: '#f97316',
  },
  {
    icon: Shield,
    title: 'Premium Quality',
    description: 'Only the finest materials. Quality guaranteed on every item.',
    color: '#3b82f6',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Free express shipping on orders over $100. Delivered fast.',
    color: '#10b981',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns. No questions asked.',
    color: '#8b5cf6',
  },
  {
    icon: Star,
    title: '5★ Rated',
    description: 'Over 50,000 happy athletes trust GS • Sport globally.',
    color: '#f59e0b',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our team is always here to help with any question.',
    color: '#ec4899',
  },
];

export default function WhyUs() {
  return (
    <section className="py-12 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Decorative orb */}
      <div className="absolute bottom-0 left-0 w-[min(600px,90vw)] h-[min(600px,90vw)] bg-[#f97316]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-[#f97316] text-sm font-bold uppercase tracking-[0.3em] mb-4">
            Why GS • Sport
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
            The <span className="gradient-text">Standard</span> of Excellence
          </h2>
          <p className="text-white/40 text-base sm:text-lg max-w-2xl mx-auto">
            We don&apos;t just make sportswear. We engineer excellence into every thread.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="glass-card p-7 group cursor-default"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}20` }}
              >
                <feature.icon size={22} style={{ color: feature.color }} />
              </div>

              {/* Content */}
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-[#f97316] transition-colors">
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>

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
          className="mt-10 sm:mt-16 glass-card p-6 sm:p-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#f97316]/5 via-transparent to-[#f97316]/5 pointer-events-none" />
          <h3 className="text-3xl font-black text-white mb-3">
            Ready to elevate your game?
          </h3>
          <p className="text-white/50 mb-8">
            Join 50,000+ athletes who trust GS • Sport for peak performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-8 py-4 rounded-full font-bold text-white inline-block"
            >
              Shop Now
            </motion.a>
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass px-8 py-4 rounded-full font-semibold text-white inline-block hover:border-[#f97316]/30 transition-all"
            >
              Create Account
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
