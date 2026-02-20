'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus, Loader2, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/lib/useTranslation';
import axios from 'axios';
import toast from 'react-hot-toast';

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

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        >
          <div className="glass-card p-8 sm:p-10">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
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
