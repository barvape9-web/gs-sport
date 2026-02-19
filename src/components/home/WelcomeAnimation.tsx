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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#f97316]/5"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#f97316]/8"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#f97316]/12"
            />

            {/* Glow orbs */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#f97316]/5 blur-3xl"
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
                  className="absolute inset-0 rounded-full border-2 border-[#f97316]/30"
                />
                {/* Inner glow */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)]">
                  <span className="text-white font-black text-3xl tracking-tight">GS</span>
                </div>
                {/* Rotating border segments */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-t-2 border-r-2 border-[#f97316] opacity-60"
                  style={{ borderRadius: '50%' }}
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
                  className="h-px bg-gradient-to-r from-transparent to-[#f97316]"
                />
                <motion.span
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={stage >= 2 ? { opacity: 1, letterSpacing: '0.3em' } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-xs text-[#f97316] font-bold uppercase tracking-[0.3em]"
                >
                  Premium
                </motion.span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={stage >= 2 ? { width: '40px' } : {}}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="h-px bg-gradient-to-l from-transparent to-[#f97316]"
                />
              </div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.8 }}
                animate={stage >= 2 ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-white tracking-tight"
              >
                GS <span className="text-[#f97316]">•</span> Sport
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
                  className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
