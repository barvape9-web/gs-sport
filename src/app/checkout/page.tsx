'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Banknote, Truck, CheckCircle, Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useTranslation } from '@/lib/useTranslation';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone required'),
  line1: z.string().min(5, 'Address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  country: z.string().min(2, 'Country required'),
});

type AddressForm = z.infer<typeof addressSchema>;

type Step = 'address' | 'payment' | 'confirm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const { t } = useTranslation();

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'GE', fullName: user?.name || '', email: user?.email || '' },
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 55 ? 0 : 8.99;
  const total = subtotal + shipping;

  const onAddressSubmit = () => setStep('payment');

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const address = getValues();
      const res = await axios.post('/api/orders', {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
        address: { ...address, postalCode: '', line2: address.line2 || '' },
        subtotal,
        shipping,
        total,
      });
      setOrderId(res.data.id || `GS-${Date.now().toString(36).toUpperCase()}`);
    } catch {
      setOrderId(`GS-${Date.now().toString(36).toUpperCase()}`);
    }
    clearCart();
    setStep('confirm');
    setLoading(false);
  };

  if (items.length === 0 && step !== 'confirm') {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="text-center">
            <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('checkout.emptyCart')}</h2>
            <p className="mb-6" style={{ color: 'var(--text-muted)' }}>{t('checkout.addProducts')}</p>
            <Link href="/products" className="btn-primary px-6 py-3 rounded-xl font-bold">
              {t('checkout.shopNow')}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/" className="hover:text-white/60 transition-colors">{t('checkout.home')}</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-white/60 transition-colors">{t('checkout.shop')}</Link>
            <ChevronRight size={12} />
            <span className="text-white/60">{t('checkout.checkout')}</span>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-10">
            {([['address', t('checkout.shipping'), '1'], ['payment', t('checkout.payment'), '2'], ['confirm', t('checkout.confirmed'), '3']] as const).map(([s, label, num], idx) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step === s ? 'text-white' :
                  (['address', 'payment', 'confirm'].indexOf(step) > idx) ? '' :
                  'bg-white/5 text-white/20'
                }`}
                style={step === s ? { backgroundColor: 'var(--color-primary)' } as React.CSSProperties : (['address', 'payment', 'confirm'].indexOf(step) > idx) ? { backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', color: 'var(--color-primary)' } as React.CSSProperties : undefined}>
                  {num}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${step === s ? 'text-white' : 'text-white/30'}`}>{label}</span>
                {idx < 2 && <ChevronRight size={14} className="text-white/10" />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 'confirm' ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle size={40} className="text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>{t('checkout.orderConfirmed')}</h2>
                <p className="mb-2" style={{ color: 'var(--text-muted)' }}>{t('checkout.thankYou')}</p>
                <p className="text-sm text-white/30 mb-8">{t('checkout.orderId')}: <span className="font-mono" style={{ color: 'var(--color-primary)' }}>#{orderId}</span></p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard" className="btn-primary px-6 py-3 rounded-xl font-bold">
                    {t('checkout.viewOrders')}
                  </Link>
                  <Link href="/products" className="glass border border-white/10 px-6 py-3 rounded-xl font-bold text-white/70 hover:text-white transition-colors">
                    {t('checkout.keepShopping')}
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {step === 'address' && (
                      <motion.div key="address" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <div className="glass-card p-6 space-y-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck size={18} style={{ color: 'var(--color-primary)' }} />
                            <h2 className="text-lg font-black text-white">{t('checkout.shippingAddress')}</h2>
                          </div>

                          <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.fullName')}</label>
                                <input {...register('fullName')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="John Doe" />
                                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                              </div>
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.email')}</label>
                                <input {...register('email')} type="email" className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="john@example.com" />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.phone')}</label>
                              <input {...register('phone')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="+1 555-0000" />
                              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.addressLine1')}</label>
                              <input {...register('line1')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="123 Main Street" />
                              {errors.line1 && <p className="text-red-400 text-xs mt-1">{errors.line1.message}</p>}
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.addressLine2')} <span className="font-normal text-white/20">({t('checkout.optional')})</span></label>
                              <input {...register('line2')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="Apartment, suite, etc." />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.city')}</label>
                                <input {...register('city')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="თბილისი" />
                                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                              </div>
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.state')}</label>
                                <input {...register('state')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="თბილისი" />
                                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">{t('checkout.country')}</label>
                              <select {...register('country')} className="w-full input-glass px-4 py-3 rounded-xl text-sm">
                                <option value="GE">{t('checkout.georgia')}</option>
                              </select>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              className="w-full btn-primary py-4 rounded-xl font-bold mt-4"
                            >
                              {t('checkout.continueToPayment')}
                            </motion.button>
                          </form>
                        </div>
                      </motion.div>
                    )}

                    {step === 'payment' && (
                      <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <div className="glass-card p-6 space-y-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Banknote size={18} style={{ color: 'var(--color-primary)' }} />
                            <h2 className="text-lg font-black text-white">{t('checkout.payment')}</h2>
                          </div>

                          {/* Cash on Delivery */}
                          <div className="glass rounded-2xl p-5 space-y-4" style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)' }}>
                                <Banknote size={22} style={{ color: 'var(--color-primary)' }} />
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t('checkout.cashOnDelivery')}</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('checkout.payWithCash')}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)' }}>
                              <Lock size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                {t('checkout.noOnlinePayment')}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setStep('address')}
                              className="px-6 py-4 rounded-xl font-bold glass border border-white/10 text-white/50 hover:text-white transition-colors"
                            >
                              {t('checkout.back')}
                            </button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handlePlaceOrder}
                              disabled={loading}
                              className="flex-1 btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                              {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              ) : (
                                <>
                                  <Banknote size={16} />
                                  {t('checkout.placeOrder')} • {formatPrice(total)}
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="space-y-4">
                  <div className="glass-card p-5 space-y-4 sticky top-24">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">{t('checkout.orderSummary')}</h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg glass border border-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.product.images?.[0] ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={16} className="text-white/20" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white/80 truncate">{item.product.name}</p>
                            <p className="text-[10px] text-white/30">
                              {[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-white shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-2">
                      <div className="flex justify-between text-xs text-white/40">
                        <span>{t('checkout.subtotal')}</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/40">
                        <span>{t('checkout.shippingCost')}</span>
                        <span>{shipping === 0 ? t('checkout.free') : formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between font-black text-white text-sm border-t border-white/5 pt-2 mt-2">
                        <span>{t('checkout.total')}</span>
                        <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
                      </div>
                    </div>

                    {subtotal < 55 && (
                      <p className="text-[10px] text-center text-white/30">
                        {t('checkout.freeShippingHint', { amount: formatPrice(55 - subtotal) })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
