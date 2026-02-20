'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useTranslation } from '@/lib/useTranslation';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col glass-dark border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} style={{ color: 'var(--color-primary)' }} />
                <h2 className="text-lg font-bold">{t('cart.yourCart')}</h2>
                <span className="px-2 py-0.5 text-xs rounded-full font-semibold" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', color: 'var(--color-primary)' }}>
                  {items.length}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleCart}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <ShoppingBag size={32} className="text-white/30" />
                  </div>
                  <div>
                    <p className="text-white/60 font-medium">{t('cart.empty')}</p>
                    <p className="text-white/30 text-sm mt-1">{t('cart.addItems')}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleCart}
                    className="btn-primary px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                  >
                    <Link href="/products">{t('cart.browseProducts')}</Link>
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="glass-card p-4"
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <ShoppingBag size={24} />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex gap-2 mt-1">
                            {item.size && (
                              <span className="text-xs text-white/40">{t('cart.size')}: {item.size}</span>
                            )}
                            {item.color && (
                              <span className="text-xs text-white/40">{t('cart.color')}: {item.color}</span>
                            )}
                          </div>
                          <p className="font-bold text-sm mt-1" style={{ color: 'var(--color-primary)' }}>
                            {formatPrice(item.product.price)}
                          </p>
                        </div>

                        {/* Remove */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.productId, item.size, item.color)}
                          className="text-white/30 hover:text-red-400 transition-colors self-start"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1, item.size, item.color)
                            }
                            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <Minus size={12} />
                          </motion.button>
                          <span className="text-sm font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1, item.size, item.color)
                            }
                            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <Plus size={12} />
                          </motion.button>
                        </div>
                        <p className="text-sm font-bold text-white">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">{t('cart.subtotal')}</span>
                  <span className="text-xl font-bold gradient-text">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <Link href="/checkout" onClick={toggleCart}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                  >
                    {t('cart.checkout')}
                    <ArrowRight size={18} />
                  </motion.button>
                </Link>
                <Link href="/products" onClick={toggleCart}>
                  <button className="w-full py-3 text-sm text-white/50 hover:text-white transition-colors">
                    {t('cart.continueShopping')}
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
