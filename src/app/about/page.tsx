'use client';

import { motion, useInView } from 'framer-motion';
import {
  Heart, Package, Sparkles, Shirt, MessageCircle,
  Truck, Star, Scissors, Palette,
} from 'lucide-react';
import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/* ── animation helpers ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div ref={ref} className={className}>
      {inView ? children : <div style={{ minHeight: 200 }} />}
    </div>
  );
}

/* ── data ──────────────────────────────────────────────── */
const products = [
  { icon: Shirt, label: 'სპორტული ჰუდები', color: '#f97316' },
  { icon: Scissors, label: 'ორეულები', color: '#3b82f6' },
  { icon: Star, label: 'სპორტდარბაზის სტილის სამოსი', color: '#8b5cf6' },
];

/* ── page ──────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20" style={{ backgroundColor: 'var(--bg-primary)' }}>

        {/* ═══════ SECTION 1 — HERO ═══════ */}
        <section className="relative overflow-hidden">
          {/* subtle radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 30% 40%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent)',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* ── Image ── */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative group flex justify-center lg:justify-start"
              >
                <div className="relative">
                  {/* outer glow ring */}
                  <div
                    className="absolute -inset-1 rounded-3xl opacity-40 blur-xl transition-opacity duration-500 group-hover:opacity-70"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 40%, #000))',
                    }}
                  />
                  <motion.div
                    whileHover={{ scale: 1.03, rotateY: 4, rotateX: -2 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="relative overflow-hidden rounded-3xl shadow-2xl"
                    style={{ perspective: 800 }}
                  >
                    <Image
                      src="/founder.jpg"
                      alt="გიორგი სარდლიშვილი — GS Sport Founder"
                      width={520}
                      height={650}
                      priority
                      className="w-full max-w-[420px] sm:max-w-[480px] h-auto object-cover rounded-3xl"
                    />
                    {/* bottom gradient overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-28"
                      style={{
                        background:
                          'linear-gradient(to top, color-mix(in srgb, var(--bg-primary) 90%, transparent), transparent)',
                      }}
                    />
                    {/* founder badge */}
                    <div
                      className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-2xl backdrop-blur-lg flex items-center gap-3"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--bg-primary) 70%, transparent)',
                        border: '1px solid var(--glass-border)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #000))',
                        }}
                      >
                        GS
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          გიორგი სარდლიშვილი
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          Founder & Creator
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* ── Text ── */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-6"
              >
                {/* badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
                    color: 'var(--color-primary)',
                    border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
                  }}
                >
                  🇬🇪 Made in Georgia
                </motion.div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
                  <span style={{ color: 'var(--text-primary)' }}>GS </span>
                  <span style={{ color: 'var(--color-primary)' }}>SPORT</span>
                </h1>

                <p
                  className="text-base sm:text-lg font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ქართული სპორტული ბრენდი
                </p>

                <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <p>
                    მე ვარ <strong style={{ color: 'var(--text-primary)' }}>გიორგი სარდლიშვილი</strong>.
                    <br />
                    სპორტი ჩემი ცხოვრების ნაწილია და სწორედ ამ სიყვარულიდან დაიბადა იდეა — შემექმნა
                    სპორტული ბრენდი, რომელიც სრულად საქართველოში იკერება.
                  </p>

                  <p>ჩვენ ვქმნით სპორტულ სამოსს, რომელიც აერთიანებს:</p>

                  <ul className="space-y-2 pl-1">
                    {['კომფორტს', 'ხარისხიან მასალას', 'თანამედროვე სპორტულ სტილს'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-md flex items-center justify-center text-white text-xs shrink-0"
                          style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p>
                    ჩვენს გვერდზე მუდმივად იხილავთ კერვის პროცესს, რადგან ჩვენთვის სანდოობა და
                    გამჭვირვალობა ძალიან მნიშვნელოვანია, ყოველი დეტალი იქმნება ყურადღებით.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════ SECTION 2 — WHAT WE PRODUCE ═══════ */}
        <Section>
          <section className="relative py-20 sm:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="text-center mb-14"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
                  👕 რას ვკერავთ?
                </h2>
                <p className="text-sm sm:text-base max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                  ქართული ხელნაკეთი სპორტული სამოსი პრემიუმ ხარისხით
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                {products.map((item, i) => (
                  <motion.div
                    key={item.label}
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                    whileHover={{ y: -10, scale: 1.03 }}
                    className="group relative rounded-3xl p-8 text-center cursor-default transition-shadow duration-500"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 60%, transparent)',
                      border: '1px solid var(--glass-border)',
                      boxShadow: '0 4px 30px rgba(0,0,0,.2)',
                    }}
                  >
                    {/* hover glow */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 30%, color-mix(in srgb, ${item.color} 12%, transparent), transparent 70%)`,
                      }}
                    />

                    {/* 3D icon container */}
                    <motion.div
                      whileHover={{ rotateY: 15, rotateX: -10 }}
                      transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                      className="relative mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{
                        background: `linear-gradient(145deg, ${item.color}, color-mix(in srgb, ${item.color} 50%, #000))`,
                        boxShadow: `0 8px 32px color-mix(in srgb, ${item.color} 35%, transparent), inset 0 1px 0 rgba(255,255,255,.15)`,
                        perspective: 600,
                      }}
                    >
                      <item.icon size={34} className="text-white drop-shadow-lg" />
                    </motion.div>

                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      {item.label}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </Section>

        {/* ═══════ SECTION 3 — CUSTOM DESIGN CTA ═══════ */}
        <Section>
          <section className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="relative rounded-3xl p-8 sm:p-12 overflow-hidden"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 50%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-primary) 20%, var(--glass-border))',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* decorative background glow */}
                <div
                  className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-20"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <div
                  className="pointer-events-none absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-10"
                  style={{ backgroundColor: '#8b5cf6' }}
                />

                <div className="relative flex flex-col sm:flex-row items-start gap-6">
                  {/* 3D sparkle icon */}
                  <motion.div
                    whileHover={{ rotateY: 20, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      background: 'linear-gradient(145deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 50%, #000))',
                      boxShadow: '0 8px 32px color-mix(in srgb, var(--color-primary) 30%, transparent), inset 0 1px 0 rgba(255,255,255,.15)',
                    }}
                  >
                    <Palette size={30} className="text-white" />
                  </motion.div>

                  <div className="space-y-4">
                    <h3
                      className="text-xl sm:text-2xl font-extrabold flex items-center gap-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Sparkles size={22} style={{ color: 'var(--color-primary)' }} />
                      შექმენი შენი საკუთარი სტილი
                    </h3>

                    <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      მოგვწერე პირად შეტყობინებაში და ერთად შევქმნით შენზე მორგებულ, კომფორტულ
                      დიზაინს. ჩვენი გუნდი დაგეხმარება, რომ მაქსიმალურად მოვერგოთ შენს მოთხოვნებს.
                    </p>

                    <Link href="/contact">
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 mt-2 px-6 py-3 rounded-xl text-sm font-bold text-white uppercase tracking-wider"
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #000))',
                          boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 30%, transparent)',
                        }}
                      >
                        <MessageCircle size={18} />
                        მოგვწერე
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </Section>

        {/* ═══════ SECTION 4 — DELIVERY ═══════ */}
        <Section>
          <section className="py-16 sm:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="relative inline-flex flex-col items-center gap-5 rounded-3xl px-8 sm:px-14 py-10"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 50%, transparent)',
                  border: '1px solid var(--glass-border)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* 3D truck icon */}
                <motion.div
                  whileHover={{ rotateY: 15, rotateX: -8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(145deg, #10b981, color-mix(in srgb, #10b981 50%, #000))',
                    boxShadow: '0 8px 32px color-mix(in srgb, #10b981 30%, transparent), inset 0 1px 0 rgba(255,255,255,.15)',
                  }}
                >
                  <Truck size={30} className="text-white" />
                </motion.div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    📦 საკურიერო მომსახურება
                  </h3>
                  <p className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
                    ხელმისაწვდომია მთელი საქართველოს მასშტაბით
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </Section>

        {/* ═══════ FOOTER MESSAGE ═══════ */}
        <Section>
          <section className="pb-24 pt-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="space-y-4"
              >
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  მადლობა, რომ დაინტერესდი და სრულად წაიკითხე ჩვენი პოსტი{' '}
                  <Heart size={16} className="inline-block" style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }} />
                  <br />
                  გისურვებთ ბედნიერ და ენერგიულ დღეს!
                </p>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg sm:text-xl font-extrabold tracking-wider"
                >
                  <span style={{ color: 'var(--text-primary)' }}>GS </span>
                  <span style={{ color: 'var(--color-primary)' }}>SPORT</span>
                  <span style={{ color: 'var(--text-muted)' }}> — Made in Georgia </span>
                  <span>🇬🇪</span>
                  <Heart
                    size={16}
                    className="inline-block ml-1"
                    style={{ color: 'var(--color-primary)', fill: 'var(--color-primary)' }}
                  />
                </motion.p>

                {/* decorative divider */}
                <div className="flex justify-center pt-4">
                  <div
                    className="w-20 h-1 rounded-full"
                    style={{
                      background: 'linear-gradient(to right, transparent, var(--color-primary), transparent)',
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </section>
        </Section>
      </main>
      <Footer />
    </>
  );
}
