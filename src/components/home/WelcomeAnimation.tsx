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
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 1200),
      setTimeout(() => setStage(3), 2000),
      setTimeout(() => onComplete(), 3200),
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
            {/* Logo mark */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={stage >= 1 ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-8"
            >
              <div className="relative w-24 h-24">
                {/* Outer ring */}
                <motion.div
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={stage >= 1 ? { opacity: 1 } : {}}
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid color-mix(in srgb, var(--color-primary) 30%, transparent)' }}
                />
                {/* Inner glow */}
                <div className="absolute inset-2 rounded-full flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to bottom right, var(--color-primary), color-mix(in srgb, var(--color-primary) 80%, #000))', boxShadow: '0 0 30px color-mix(in srgb, var(--color-primary) 50%, transparent)' }}>
                  <span className="text-white font-black text-3xl tracking-tight">GS</span>
                </div>
                {/* Rotating border segments */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full opacity-60"
                  style={{ borderRadius: '50%', borderTop: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)', borderBottom: '2px solid transparent', borderLeft: '2px solid transparent' }}
                />
              </div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stage >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-center"
            >
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={stage >= 2 ? { width: '40px' } : {}}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="h-px"
                  style={{ backgroundImage: 'linear-gradient(to right, transparent, var(--color-primary))' }}
                />
                <motion.span
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={stage >= 2 ? { opacity: 1, letterSpacing: '0.3em' } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-xs font-bold uppercase tracking-[0.3em]"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Premium
                </motion.span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={stage >= 2 ? { width: '40px' } : {}}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="h-px"
                  style={{ backgroundImage: 'linear-gradient(to left, transparent, var(--color-primary))' }}
                />
              </div>

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
              <div className="h-px bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={stage >= 2 ? { width: '100%' } : {}}
                  transition={{ duration: 1, ease: 'easeInOut', delay: 0.6 }}
                  className="h-full"
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
