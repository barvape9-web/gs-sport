'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

/* ── tiny random-particle generator (deterministic per mount) ────── */
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    dx: (Math.random() - 0.5) * 60,
    dy: (Math.random() - 0.5) * 60,
  }));
}

function generateStreaks(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    angle: Math.random() * 360,
    length: Math.random() * 120 + 60,
    duration: Math.random() * 1.5 + 1,
    delay: Math.random() * 3,
  }));
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [stage, setStage] = useState(0);
  const particles = useMemo(() => generateParticles(40), []);
  const streaks = useMemo(() => generateStreaks(8), []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2800),
      setTimeout(() => setStage(4), 3600),
      setTimeout(() => onComplete(), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.section
          id="welcome-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#0a0a0a' }}
        >
          {/* ── Cinematic dark gradient background ──────────────── */}
          <div className="absolute inset-0">
            {/* Radial vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(249,115,22,0.06) 0%, transparent 70%), radial-gradient(ellipse at 50% 50%, #0a0a0a 60%, #000 100%)',
              }}
            />
            {/* Top-down cinematic bars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 2 }}
              className="absolute inset-x-0 top-0 h-24"
              style={{ background: 'linear-gradient(to bottom, #000, transparent)' }}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 2 }}
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: 'linear-gradient(to top, #000, transparent)' }}
            />
          </div>

          {/* ── Rotating orbit rings ───────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              { size: 'min(900px,95vw)', dur: 25, dir: 1, op: 0.04 },
              { size: 'min(650px,75vw)', dur: 18, dir: -1, op: 0.06 },
              { size: 'min(400px,55vw)', dur: 12, dir: 1, op: 0.1 },
            ].map((ring, i) => (
              <motion.div
                key={i}
                animate={{ rotate: ring.dir * 360 }}
                transition={{ duration: ring.dur, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: ring.size,
                  height: ring.size,
                  border: `1px solid rgba(249,115,22,${ring.op})`,
                }}
              />
            ))}
          </div>

          {/* ── Floating particles ─────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: [0, p.dx],
                  y: [0, p.dy],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: 'rgba(249,115,22,0.7)',
                  boxShadow: '0 0 6px rgba(249,115,22,0.4)',
                }}
              />
            ))}
          </div>

          {/* ── Light streaks ──────────────────────────────────── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {streaks.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: [0, 0.3, 0], scaleX: [0, 1, 0] }}
                transition={{
                  duration: s.duration,
                  delay: s.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute origin-left"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.length,
                  height: 1,
                  transform: `rotate(${s.angle}deg)`,
                  background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)',
                }}
              />
            ))}
          </div>

          {/* ── Central glow ───────────────────────────────────── */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px]"
            style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}
          />

          {/* ── Main content ───────────────────────────────────── */}
          <div className="relative z-10 flex flex-col items-center">

            {/* ── PREMIUM label with accent lines ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={stage >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' as const }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={stage >= 1 ? { width: 50 } : {}}
                transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' as const }}
                className="h-px"
                style={{
                  background: 'linear-gradient(to right, transparent, #f97316)',
                }}
              />
              <motion.span
                initial={{ opacity: 0, letterSpacing: '0.6em' }}
                animate={
                  stage >= 1
                    ? { opacity: 1, letterSpacing: '0.35em' }
                    : {}
                }
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' as const }}
                className="text-[11px] sm:text-xs font-bold uppercase select-none"
                style={{ color: '#f97316' }}
              >
                Premium
              </motion.span>
              <motion.div
                initial={{ width: 0 }}
                animate={stage >= 1 ? { width: 50 } : {}}
                transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' as const }}
                className="h-px"
                style={{
                  background: 'linear-gradient(to left, transparent, #f97316)',
                }}
              />
            </motion.div>

            {/* ── welcome.jpg logo — mix-blend-mode: screen removes black bg ── */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotateX: 15 }}
              animate={
                stage >= 1
                  ? {
                      scale: [1, 1.06, 1.02],
                      opacity: 1,
                      rotateX: 0,
                      y: [0, -5, 0],
                    }
                  : {}
              }
              transition={{
                scale: { duration: 2, times: [0, 0.4, 1], ease: 'easeOut' as const },
                opacity: { duration: 0.8, ease: 'easeOut' as const },
                rotateX: { duration: 1.2, ease: 'easeOut' as const },
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.2 },
              }}
              className="relative mb-8"
              style={{ perspective: '800px' }}
            >
              {/* Glow layers behind image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  stage >= 1
                    ? { opacity: [0, 0.6, 0.3, 0.45, 0.3], scale: [0.5, 1.1, 1] }
                    : {}
                }
                transition={{ duration: 2.5, ease: 'easeOut' as const }}
                className="absolute inset-0 -m-12 rounded-full blur-3xl"
                style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={stage >= 1 ? { opacity: [0, 0.25, 0.12] } : {}}
                transition={{ duration: 2, delay: 0.5, ease: 'easeOut' as const }}
                className="absolute inset-0 -m-20 rounded-full blur-[80px]"
                style={{ backgroundColor: 'rgba(249,115,22,0.08)' }}
              />

              {/* The actual logo image — brightness + contrast crush the dark bg to pure black, screen blend removes it */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/welcome.jpg"
                alt="GS Sport"
                className="relative z-10 w-[320px] sm:w-[420px] md:w-[500px] h-auto select-none"
                style={{
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.15) contrast(1.35) drop-shadow(0 0 40px rgba(249,115,22,0.25))',
                }}
                draggable={false}
              />

              {/* Expanding pulse rings */}
              {[0, 0.35, 0.7].map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={
                    stage >= 1
                      ? { scale: [0.8, 1.3, 1.6], opacity: [0.4, 0.12, 0] }
                      : {}
                  }
                  transition={{ duration: 1.5, delay: 0.6 + d, ease: 'easeOut' as const }}
                  className="absolute inset-0 -m-6 rounded-full pointer-events-none"
                  style={{
                    border: '1px solid rgba(249,115,22,0.3)',
                  }}
                />
              ))}
            </motion.div>

            {/* ── GS • Sport title ── */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.75, y: 10 }}
              animate={
                stage >= 2
                  ? { opacity: 1, scale: 1, y: 0 }
                  : {}
              }
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' as const }}
              className="text-5xl sm:text-7xl font-black text-white tracking-tight select-none"
            >
              GS{' '}
              <span
                style={{
                  color: '#f97316',
                  textShadow: '0 0 30px rgba(249,115,22,0.5)',
                }}
              >
                •
              </span>{' '}
              Sport
            </motion.h1>

            {/* ── Cinematic progress bar ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="mt-12 w-56"
            >
              <div className="h-[2px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={stage >= 2 ? { width: '100%' } : {}}
                  transition={{ duration: 2.2, ease: 'easeInOut' as const, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #f97316, #fb923c, #f97316)',
                    boxShadow: '0 0 12px rgba(249,115,22,0.5)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
