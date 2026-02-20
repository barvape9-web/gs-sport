'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, Loader2, Check, Sparkles, Star, Zap, Crown, Heart, Award } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/lib/useTranslation';
import axios from 'axios';
import toast from 'react-hot-toast';

/* ── floating 3D icon config ── */
const floatingIcons = [
  { Icon: Sparkles, size: 26, x: '5%',  y: '12%', delay: 0,   dur: 6.5, rx: 15, ry: -20 },
  { Icon: Star,     size: 22, x: '48%', y: '8%',  delay: 1,   dur: 7,   rx: -12, ry: 18 },
  { Icon: Zap,      size: 28, x: '93%', y: '15%', delay: 0.5, dur: 5.5, rx: 18, ry: 22 },
  { Icon: Crown,    size: 24, x: '4%',  y: '80%', delay: 1.8, dur: 8,   rx: -20, ry: 15 },
  { Icon: Heart,    size: 20, x: '50%', y: '88%', delay: 0.3, dur: 6,   rx: 14, ry: -18 },
  { Icon: Award,    size: 26, x: '94%', y: '78%', delay: 1.4, dur: 7.5, rx: -16, ry: 20 },
];

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();
  const { t } = useTranslation();

  const benefits = [
    t('register.benefit1'),
    t('register.benefit2'),
    t('register.benefit3'),
    t('register.benefit4'),
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/register', data);
      setUser(res.data.user);
      toast.success('Account created! Welcome to GS • Sport!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[min(500px,80vw)] h-[min(500px,80vw)] rounded-full blur-[100px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)' }} />

      {/* 3D Floating Icons — desktop */}
      {floatingIcons.map(({ Icon, size, x, y, delay, dur, rx, ry }, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none hidden sm:block"
          style={{ left: x, top: y, perspective: 600 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.45, 0.25, 0.45, 0],
            scale: [0.8, 1, 0.9, 1, 0.8],
            y: [0, -14, 0, 14, 0],
            rotateX: [0, rx, 0, -rx, 0],
            rotateY: [0, ry, 0, -ry, 0],
          }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="p-2.5 rounded-xl"
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

      {/* Mobile: 2 small icons */}
      {floatingIcons.slice(0, 2).map(({ Icon, delay, dur, rx, ry }, i) => (
        <motion.div
          key={`m-${i}`}
          className="absolute pointer-events-none sm:hidden"
          style={{ left: i === 0 ? '6%' : '84%', top: i === 0 ? '10%' : '82%', perspective: 400 }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.35, 0.2, 0.35, 0],
            y: [0, -8, 0, 8, 0],
            rotateX: [0, rx * 0.5, 0, -rx * 0.5, 0],
            rotateY: [0, ry * 0.5, 0, -ry * 0.5, 0],
          }}
          transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="p-1.5 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.03))',
              border: '1px solid rgba(249,115,22,0.08)',
              boxShadow: '0 0 14px rgba(249,115,22,0.06)',
            }}
          >
            <Icon size={16} style={{ color: 'rgba(249,115,22,0.4)' }} strokeWidth={1.5} />
          </div>
        </motion.div>
      ))}

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {/* Left - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center"
        >
          <Link href="/" className="mb-10">
            <span className="text-3xl font-black">
              <span style={{ color: 'var(--text-primary)' }}>GS</span>
              <span style={{ color: 'var(--color-primary)' }}> •</span>
              <span style={{ color: 'var(--text-primary)' }}> Sport</span>
            </span>
          </Link>
          <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('register.joinElite')} <span className="gradient-text">{t('register.joinEliteAccent')}</span>
          </h2>
          <p className="text-base sm:text-lg mb-10 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t('register.createDescription')}
          </p>
          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                  <Check size={12} style={{ color: 'var(--color-primary)' }} />
                </div>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
        >
          {/* Form card glow */}
          <motion.div
            className="absolute -inset-3 rounded-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.07) 0%, transparent 70%)',
              filter: 'blur(18px)',
            }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="glass-card p-8 sm:p-10 relative">
            <div className="lg:hidden text-center mb-8">
              <Link href="/">
                <span className="text-2xl font-black">
                  <span style={{ color: 'var(--text-primary)' }}>GS</span>
                  <span style={{ color: 'var(--color-primary)' }}> •</span>
                  <span style={{ color: 'var(--text-primary)' }}> Sport</span>
                </span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t('register.createAccount')}</h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{t('register.fillDetails')}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('register.fullName')}</label>
                <input
                  {...register('name')}
                  placeholder="John Doe"
                  className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('register.email')}</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('register.password')}</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full input-glass px-4 py-3 rounded-xl text-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{t('register.confirmPassword')}</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    {t('register.createAccount')}
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
              {t('register.alreadyHaveAccount')}{' '}
              <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                {t('register.signIn')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
