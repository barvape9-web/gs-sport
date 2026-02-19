'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, CreditCard, Truck, CheckCircle, Lock, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Valid phone required'),
  line1: z.string().min(5, 'Address required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  postalCode: z.string().min(3, 'Postal code required'),
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

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'US', fullName: user?.name || '', email: user?.email || '' },
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 75 ? 0 : 5.99;
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
        address: { ...address, postalCode: address.postalCode, line2: address.line2 || '' },
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
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag size={48} className="text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-white/40 mb-6">Add some products before checking out</p>
            <Link href="/products" className="btn-primary px-6 py-3 rounded-xl font-bold">
              Shop Now
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
      <main className="min-h-screen pt-20 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/30 mb-8">
            <Link href="/" className="hover:text-white/60 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-white/60 transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <span className="text-white/60">Checkout</span>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-10">
            {([['address', 'Shipping', '1'], ['payment', 'Payment', '2'], ['confirm', 'Confirmed', '3']] as const).map(([s, label, num], idx) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step === s ? 'bg-[#f97316] text-white' :
                  (['address', 'payment', 'confirm'].indexOf(step) > idx) ? 'bg-[#f97316]/20 text-[#f97316]' :
                  'bg-white/5 text-white/20'
                }`}>
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
                <h2 className="text-3xl font-black text-white mb-3">Order Confirmed!</h2>
                <p className="text-white/50 mb-2">Thank you for shopping with GS • Sport</p>
                <p className="text-sm text-white/30 mb-8">Order ID: <span className="font-mono text-[#f97316]">#{orderId}</span></p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard" className="btn-primary px-6 py-3 rounded-xl font-bold">
                    View Orders
                  </Link>
                  <Link href="/products" className="glass border border-white/10 px-6 py-3 rounded-xl font-bold text-white/70 hover:text-white transition-colors">
                    Keep Shopping
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
                            <Truck size={18} className="text-[#f97316]" />
                            <h2 className="text-lg font-black text-white">Shipping Address</h2>
                          </div>

                          <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Full Name</label>
                                <input {...register('fullName')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="John Doe" />
                                {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                              </div>
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Email</label>
                                <input {...register('email')} type="email" className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="john@example.com" />
                                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Phone</label>
                              <input {...register('phone')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="+1 555-0000" />
                              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Address Line 1</label>
                              <input {...register('line1')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="123 Main Street" />
                              {errors.line1 && <p className="text-red-400 text-xs mt-1">{errors.line1.message}</p>}
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Address Line 2 <span className="font-normal text-white/20">(optional)</span></label>
                              <input {...register('line2')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="Apartment, suite, etc." />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">City</label>
                                <input {...register('city')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="New York" />
                                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city.message}</p>}
                              </div>
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">State</label>
                                <input {...register('state')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="NY" />
                                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state.message}</p>}
                              </div>
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Postal Code</label>
                                <input {...register('postalCode')} className="w-full input-glass px-4 py-3 rounded-xl text-sm" placeholder="10001" />
                                {errors.postalCode && <p className="text-red-400 text-xs mt-1">{errors.postalCode.message}</p>}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Country</label>
                              <select {...register('country')} className="w-full input-glass px-4 py-3 rounded-xl text-sm">
                                <option value="US">United States</option>
                                <option value="CA">Canada</option>
                                <option value="GB">United Kingdom</option>
                                <option value="AU">Australia</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                              </select>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              className="w-full btn-primary py-4 rounded-xl font-bold mt-4"
                            >
                              Continue to Payment
                            </motion.button>
                          </form>
                        </div>
                      </motion.div>
                    )}

                    {step === 'payment' && (
                      <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <div className="glass-card p-6 space-y-5">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard size={18} className="text-[#f97316]" />
                            <h2 className="text-lg font-black text-white">Payment</h2>
                          </div>

                          <div className="glass border border-[#f97316]/20 rounded-xl p-4 flex items-center gap-3">
                            <Lock size={16} className="text-[#f97316] shrink-0" />
                            <p className="text-xs text-white/50">
                              This is a demo store. No real payment will be processed. Click "Place Order" to complete your demo order.
                            </p>
                          </div>

                          {/* Mock card fields */}
                          <div className="space-y-4 opacity-60 pointer-events-none">
                            <div>
                              <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Card Number</label>
                              <input value="4242 4242 4242 4242" readOnly className="w-full input-glass px-4 py-3 rounded-xl text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">Expiry</label>
                                <input value="12/28" readOnly className="w-full input-glass px-4 py-3 rounded-xl text-sm" />
                              </div>
                              <div>
                                <label className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1.5">CVV</label>
                                <input value="•••" readOnly className="w-full input-glass px-4 py-3 rounded-xl text-sm" />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => setStep('address')}
                              className="px-6 py-4 rounded-xl font-bold glass border border-white/10 text-white/50 hover:text-white transition-colors"
                            >
                              Back
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
                                  <Lock size={16} />
                                  Place Order • {formatPrice(total)}
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
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Order Summary</h3>

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
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/40">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between font-black text-white text-sm border-t border-white/5 pt-2 mt-2">
                        <span>Total</span>
                        <span className="text-[#f97316]">{formatPrice(total)}</span>
                      </div>
                    </div>

                    {subtotal < 75 && (
                      <p className="text-[10px] text-center text-white/30">
                        Add <span className="text-[#f97316]">{formatPrice(75 - subtotal)}</span> more for free shipping
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
