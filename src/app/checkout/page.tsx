'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Banknote, Truck, CheckCircle, Lock, ShoppingBag, Copy, Check, Landmark, CreditCard } from 'lucide-react';
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
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(text);
    toast.success('IBAN დაკოპირებულია!');
    setTimeout(() => setCopiedIban(null), 2000);
  };

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
          <div className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t('checkout.home')}</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>{t('checkout.shop')}</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--text-secondary)' }}>{t('checkout.checkout')}</span>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-10">
            {([['address', t('checkout.shipping'), '1'], ['payment', t('checkout.payment'), '2'], ['confirm', t('checkout.confirmed'), '3']] as const).map(([s, label, num], idx) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step === s ? 'text-white' :
                  (['address', 'payment', 'confirm'].indexOf(step) > idx) ? '' :
                  ''
                }`}
                style={step === s ? { backgroundColor: 'var(--color-primary)' } as React.CSSProperties : (['address', 'payment', 'confirm'].indexOf(step) > idx) ? { backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', color: 'var(--color-primary)' } as React.CSSProperties : { backgroundColor: 'var(--overlay-bg)', color: 'var(--text-muted)' }}>
                  {num}
                </div>
                <span className="text-xs font-semibold hidden sm:block" style={{ color: step === s ? 'var(--text-primary)' : 'var(--text-muted)' }}>{label}</span>
                {idx < 2 && <ChevronRight size={14} style={{ color: 'var(--border-subtle)' }} />}
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
                <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>{t('checkout.orderId')}: <span className="font-mono" style={{ color: 'var(--color-primary)' }}>#{orderId}</span></p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard" className="btn-primary px-6 py-3 rounded-xl font-bold">
                    {t('checkout.viewOrders')}
                  </Link>
                  <Link href="/products" className="glass px-6 py-3 rounded-xl font-bold transition-colors" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
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
                            <h2 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{t('checkout.shippingAddress')}</h2>
                          </div>

                          <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.fullName')}</label>
                                <input {...register('fullName')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="John Doe" />
                                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                              </div>
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.email')}</label>
                                <input {...register('email')} type="email" className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="john@example.com" />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.phone')}</label>
                              <input {...register('phone')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="+1 555-0000" />
                              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.addressLine1')}</label>
                              <input {...register('line1')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="123 Main Street" />
                              {errors.line1 && <p className="text-red-400 text-xs mt-1">{errors.line1.message}</p>}
                            </div>

                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.addressLine2')} <span className="font-normal" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>({t('checkout.optional')})</span></label>
                              <input {...register('line2')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="Apartment, suite, etc." />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.city')}</label>
                                <input {...register('city')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="თბილისი" />
                                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                              </div>
                              <div>
                                <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.state')}</label>
                                <input {...register('state')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="თბილისი" />
                                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('checkout.country')}</label>
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
                            <h2 className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{t('checkout.payment')}</h2>
                          </div>

                          {/* Bank Transfer */}
                          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)' }}>
                            {/* Header */}
                            <div className="px-5 py-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 12%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))' }}>
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #000))', boxShadow: '0 4px 15px color-mix(in srgb, var(--color-primary) 30%, transparent)' }}>
                                <Landmark size={20} className="text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>საბანკო გადარიცხვა</p>
                                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>გადარიცხეთ ქვემოთ მოცემულ ანგარიშზე</p>
                              </div>
                            </div>

                            <div className="px-5 py-4 space-y-3" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, var(--bg-secondary))' }}>
                              {/* BOG */}
                              <div className="glass rounded-xl p-3.5 flex items-center gap-3 group cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => copyToClipboard('GE89BG0000000580619674')} style={{ border: '1px solid color-mix(in srgb, #f97316 20%, transparent)' }}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#f97316', boxShadow: '0 2px 10px rgba(249,115,22,0.25)' }}>
                                  <CreditCard size={16} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#f97316' }}>BOG Bank</p>
                                  <p className="text-xs font-mono font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>GE89BG0000000580619674</p>
                                </div>
                                <motion.div whileTap={{ scale: 0.85 }} className="p-1.5 rounded-lg shrink-0" style={{ backgroundColor: 'color-mix(in srgb, #f97316 10%, transparent)' }}>
                                  {copiedIban === 'GE89BG0000000580619674' ? <Check size={14} className="text-green-400" /> : <Copy size={14} style={{ color: '#f97316' }} />}
                                </motion.div>
                              </div>

                              {/* TBC */}
                              <div className="glass rounded-xl p-3.5 flex items-center gap-3 group cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => copyToClipboard('GE80TB7099445061600037')} style={{ border: '1px solid color-mix(in srgb, #3b82f6 20%, transparent)' }}>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#3b82f6', boxShadow: '0 2px 10px rgba(59,130,246,0.25)' }}>
                                  <CreditCard size={16} className="text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#3b82f6' }}>TBC Bank</p>
                                  <p className="text-xs font-mono font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>GE80TB7099445061600037</p>
                                </div>
                                <motion.div whileTap={{ scale: 0.85 }} className="p-1.5 rounded-lg shrink-0" style={{ backgroundColor: 'color-mix(in srgb, #3b82f6 10%, transparent)' }}>
                                  {copiedIban === 'GE80TB7099445061600037' ? <Check size={14} className="text-green-400" /> : <Copy size={14} style={{ color: '#3b82f6' }} />}
                                </motion.div>
                              </div>

                              {/* Recipient */}
                              <div className="rounded-xl p-3 space-y-1.5" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)', border: '1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)' }}>
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>მიმღები</p>
                                </div>
                                <p className="text-sm font-bold pl-3.5" style={{ color: 'var(--text-primary)' }}>გიორგი სარდლიშვილი</p>
                              </div>

                              {/* Purpose Note */}
                              <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: 'color-mix(in srgb, #10b981 8%, transparent)', border: '1px solid color-mix(in srgb, #10b981 15%, transparent)' }}>
                                <Lock size={13} className="shrink-0 mt-0.5 text-emerald-400" />
                                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                                  დანიშნულებაში ჩაწერეთ <span className="font-bold text-emerald-300">ნივთის სახელი</span> და <span className="font-bold text-emerald-300">პროფილის სახელი</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Cash on Delivery */}
                          <div className="glass rounded-2xl p-5 space-y-4" style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)' }}>
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)' }}>
                                <Banknote size={20} style={{ color: 'var(--color-primary)' }} />
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t('checkout.cashOnDelivery')}</p>
                                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('checkout.payWithCash')}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 rounded-xl p-3" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)' }}>
                              <Lock size={13} className="shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                {t('checkout.noOnlinePayment')}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setStep('address')}
                              className="px-6 py-4 rounded-xl font-bold glass transition-colors"
                              style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
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
                                <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-subtle)', borderTopColor: 'var(--text-primary)' }} />
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
                    <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{t('checkout.orderSummary')}</h3>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg glass overflow-hidden shrink-0 flex items-center justify-center" style={{ border: '1px solid var(--border-subtle)' }}>
                            {item.product.images?.[0] ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ShoppingBag size={16} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>{item.product.name}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold shrink-0" style={{ color: 'var(--text-primary)' }}>{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>{t('checkout.subtotal')}</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>{t('checkout.shippingCost')}</span>
                        <span>{shipping === 0 ? t('checkout.free') : formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm pt-2 mt-2" style={{ color: 'var(--text-primary)', borderTop: '1px solid var(--border-subtle)' }}>
                        <span>{t('checkout.total')}</span>
                        <span style={{ color: 'var(--color-primary)' }}>{formatPrice(total)}</span>
                      </div>
                    </div>

                    {subtotal < 55 && (
                      <p className="text-[10px] text-center" style={{ color: 'var(--text-muted)' }}>
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
