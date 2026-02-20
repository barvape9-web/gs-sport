'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

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

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="glass-card p-8 sm:p-10 border border-white/10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/">
              <span className="text-3xl font-black uppercase tracking-tight">
                <span className="text-white">GS</span>
                <span style={{ color: 'var(--color-primary)' }}> •</span>
                <span className="text-white"> Sport</span>
              </span>
            </Link>
            <h1 className="text-2xl font-extrabold uppercase tracking-wide text-white mt-4">
              Welcome back
            </h1>
            <p className="text-white/40 text-sm mt-1">Sign in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">
                Email
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
              <label className="block text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">
                Password
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
                Forgot password?
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
                  Sign In
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-transparent text-white/30">or</span>
              </div>
            </div>

            {/* Demo accounts */}
            <div className="glass rounded-lg p-4 text-xs text-white/40 space-y-1 border border-white/10">
              <p className="font-semibold uppercase tracking-widest text-white/60 mb-2">
                Demo Accounts
              </p>
              <p>Admin: admin@gs-sport.com / admin123</p>
              <p>User: user@gs-sport.com / user123</p>
            </div>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/40 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
