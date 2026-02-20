'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeAnimationProps {
  onComplete: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 600),
      setTimeout(() => setStage(2), 1500),
      setTimeout(() => setStage(3), 4400),
      setTimeout(() => onComplete(), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {stage < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,90vw)] h-[min(800px,90vw)] rounded-full"
              style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 5%, transparent)' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,70vw)] h-[min(600px,70vw)] rounded-full"
              style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 8%, transparent)' }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(400px,50vw)] h-[min(400px,50vw)] rounded-full"
              style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)' }}
            />

            {/* Glow orbs */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)' }}
            />
          </div>

          {/* Logo animation */}
          <div className="relative z-10 flex flex-col items-center">
            {/* GS Slash Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={stage >= 1 ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, type: 'spring', stiffness: 180, damping: 14 }}
              className="mb-8 relative"
            >
              {/* Glow behind logo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={stage >= 1 ? { opacity: [0, 0.6, 0.3] } : {}}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="absolute inset-0 -m-6 rounded-full blur-2xl"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
              />
              <svg
                width="120"
                height="120"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10"
              >
                <defs>
                  <filter id="slashBlur">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                  <clipPath id="slashClipLeft">
                    <rect x="0" y="0" width="200" height="200" />
                  </clipPath>
                </defs>
                {/* G letter */}
                <motion.text
                  x="28"
                  y="145"
                  fill="white"
                  fontSize="140"
                  fontWeight="900"
                  fontFamily="Inter, system-ui, sans-serif"
                  initial={{ opacity: 0, x: -20 }}
                  animate={stage >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                >
                  G
                </motion.text>
                {/* S letter */}
                <motion.text
                  x="100"
                  y="155"
                  fill="white"
                  fontSize="130"
                  fontWeight="900"
                  fontFamily="Inter, system-ui, sans-serif"
                  initial={{ opacity: 0, x: 20 }}
                  animate={stage >= 1 ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                >
                  S
                </motion.text>
                {/* Diagonal slash */}
                <motion.line
                  x1="160"
                  y1="15"
                  x2="40"
                  y2="185"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={stage >= 1 ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                />
                {/* Slash glow line */}
                <motion.line
                  x1="160"
                  y1="15"
                  x2="40"
                  y2="185"
                  strokeWidth="14"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={stage >= 1 ? { pathLength: 1, opacity: [0, 0.5, 0.15] } : {}}
                  transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                  style={{ stroke: 'var(--color-primary)' }}
                  filter="url(#slashBlur)"
                />
              </svg>
              {/* Pulse ring */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={stage >= 1 ? { scale: [0.8, 1.3, 1.5], opacity: [0.5, 0.2, 0] } : {}}
                transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                className="absolute inset-0 -m-4 rounded-full"
                style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 40%, transparent)' }}
              />
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stage >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.div
                initial={{ x: -80, opacity: 0 }}
                animate={stage >= 2 ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                className="flex items-center justify-center gap-3 mb-2"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={stage >= 2 ? { width: '40px' } : {}}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="h-px"
                  style={{ backgroundImage: 'linear-gradient(to right, transparent, var(--color-primary))' }}
                />
                <motion.span
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={stage >= 2 ? { opacity: 1, letterSpacing: '0.3em' } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-xs font-bold uppercase tracking-[0.3em]"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Premium
                </motion.span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={stage >= 2 ? { width: '40px' } : {}}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="h-px"
                  style={{ backgroundImage: 'linear-gradient(to left, transparent, var(--color-primary))' }}
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={stage >= 2 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-white tracking-tight"
              >
                GS <span style={{ color: 'var(--color-primary)' }}>•</span> Sport
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={stage >= 2 ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-white/40 text-sm mt-2 tracking-widest uppercase"
              >
                Engineered for Peak Performance
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={stage >= 2 ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-10 w-48"
            >
              <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={stage >= 2 ? { width: '100%' } : {}}
                  transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundImage: 'linear-gradient(to right, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #fff))' }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
