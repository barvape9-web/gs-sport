'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: "Men's Collection", href: '/products?gender=MEN' },
    { label: "Women's Collection", href: '/products?gender=WOMEN' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Sale', href: '/products?sale=true' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping Policy', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none" style={{ backgroundImage: 'linear-gradient(to bottom, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent, transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-black">
                <span style={{ color: 'var(--text-primary)' }}>GS</span>
                <span style={{ color: 'var(--color-primary)' }}> •</span>
                <span style={{ color: 'var(--text-primary)' }}> Sport</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-muted)' }}>
              Premium sportswear engineered for peak performance. Elevate your game with GS • Sport.
            </p>

            {/* Newsletter */}
            <div className="glass-card p-4">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Stay Updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 input-glass px-3 py-2 rounded-lg text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary p-2 rounded-lg"
                >
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-primary)' }}>
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--text-muted)', '--hover-color': 'var(--color-primary)' } as React.CSSProperties}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: Mail, text: 'support@gs-sport.com' },
            { icon: Phone, text: '+1 (800) GS-SPORT' },
            { icon: MapPin, text: 'New York, NY 10001' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 glass-card px-4 py-3">
              <Icon size={16} style={{ color: 'var(--color-primary)' }} />
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} GS • Sport. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ scale: 1.2 }}
                aria-label={label}
                className="transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>

          <div className="flex gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
