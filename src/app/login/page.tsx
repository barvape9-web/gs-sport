'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Loader2, Shield, Lock, Fingerprint, Sparkles, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/lib/useTranslation';
import axios from 'axios';
import toast from 'react-hot-toast';

/* ── floating 3D icon config ── */
const floatingIcons = [
  { Icon: Shield,      size: 28, x: '8%',  y: '18%', delay: 0,   dur: 6,   rx: 15, ry: 20  },
  { Icon: Lock,        size: 24, x: '85%', y: '22%', delay: 0.8, dur: 7,   rx: -10, ry: 25 },
  { Icon: Fingerprint, size: 32, x: '12%', y: '72%', delay: 1.5, dur: 8,   rx: 20, ry: -15 },
  { Icon: Sparkles,    size: 22, x: '88%', y: '68%', delay: 0.4, dur: 5.5, rx: -15, ry: 20 },
  { Icon: KeyRound,    size: 26, x: '6%',  y: '45%', delay: 2,   dur: 7.5, rx: 10, ry: -20 },
  { Icon: ShieldCheck, size: 24, x: '92%', y: '45%', delay: 1.2, dur: 6.5, rx: -20, ry: 15 },
];

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/login', data);
      setUser(res.data.user);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,90vw)] h-[min(800px,90vw)] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 4%, transparent)' }} />

      {/* Animated rings */}
      {[300, 500, 700].map((size, i) => (
        <motion.div
          key={size}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ width: `min(${size}px, 90vw)`, height: `min(${size}px, 90vw)`, border: '1px solid color-mix(in srgb, var(--color-primary) 5%, transparent)' }}
        />
      ))}

      {/* 3D Floating Icons */}
      {floatingIcons.map(({ Icon, size, x, y, delay, dur, rx, ry }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none hidden sm:block"
          style={{ left: x, top: y, perspective: 600 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.5, 0.3, 0.5, 0],
            scale: [0.8, 1, 0.9, 1, 0.8],
            y: [0, -12, 0, 12, 0],
            rotateX: [0, rx, 0, -rx, 0],
            rotateY: [0, ry, 0, -ry, 0],
          }}
          transition={{
            duration: dur,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div
            className="relative p-2.5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))',
              border: '1px solid rgba(249,115,22,0.1)',
              boxShadow: '0 0 20px rgba(249,115,22,0.08)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Icon size={size} style={{ color: 'rgba(249,115,22,0.5)' }} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}

      {/* Mobile: only 2 small icons */}
      {floatingIcons.slice(0, 2).map(({ Icon, x, y, delay, dur, rx, ry }, i) => (
        <motion.div
          key={`m-${i}`}
          className="absolute pointer-events-none sm:hidden"
          style={{ left: i === 0 ? '5%' : '82%', top: i === 0 ? '15%' : '75%', perspective: 400 }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0.25, 0.4, 0],
            y: [0, -8, 0, 8, 0],
            rotateX: [0, rx * 0.6, 0, -rx * 0.6, 0],
            rotateY: [0, ry * 0.6, 0, -ry * 0.6, 0],
          }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="p-2 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.03))',
              border: '1px solid rgba(249,115,22,0.08)',
              boxShadow: '0 0 14px rgba(249,115,22,0.06)',
            }}
          >
            <Icon size={18} style={{ color: 'rgba(249,115,22,0.4)' }} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Card glow */}
        <motion.div
          className="absolute -inset-3 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Card */}
        <div className="glass-card p-8 sm:p-10 border border-white/10 relative">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <span className="text-3xl font-black uppercase tracking-tight">
                <span style={{ color: 'var(--text-primary)' }}>GS</span>
                <span style={{ color: 'var(--color-primary)' }}> •</span>
                <span style={{ color: 'var(--text-primary)' }}> Sport</span>
              </span>
            </Link>
            <h1 className="text-2xl font-extrabold uppercase tracking-wide mt-4" style={{ color: 'var(--text-primary)' }}>
              {t('login.welcomeBack')}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('login.signInToContinue')}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                {t('login.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full input-glass px-4 py-3 rounded-lg text-sm focus:ring-2"
                style={{ '--tw-ring-color': 'color-mix(in srgb, var(--color-primary) 25%, transparent)' } as React.CSSProperties}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                {t('login.password')}
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full input-glass px-4 py-3 rounded-lg text-sm pr-12 focus:ring-2"
                  style={{ '--tw-ring-color': 'color-mix(in srgb, var(--color-primary) 25%, transparent)' } as React.CSSProperties}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs" style={{ color: 'var(--color-primary)' }}>
                {t('login.forgotPassword')}
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3.5 rounded-lg font-semibold uppercase tracking-widest text-white flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  {t('login.signIn')}
                </>
              )}
            </motion.button>

          </form>

          {/* Sign up link */}
          <div className="text-center mt-8 pt-6" style={{ borderTop: '1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('login.noAccount')}
            </p>
            <Link href="/register">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block text-lg sm:text-xl font-bold tracking-wide transition-all"
                style={{ color: 'var(--color-primary)' }}
              >
                {t('login.createOne')}
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
