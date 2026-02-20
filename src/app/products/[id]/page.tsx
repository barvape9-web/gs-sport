'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronRight, Play, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ReviewSection from '@/components/products/ReviewSection';
import { useTranslation } from '@/lib/useTranslation';

const MOCK_PRODUCT: Product = {
  id: '1',
  name: 'GS Pro Elite Running Jacket',
  description:
    'Engineered for peak performance, the GS Pro Elite Running Jacket combines cutting-edge fabric technology with a sleek aerodynamic design. Featuring moisture-wicking MoistureGuard™ fabric, reflective details for visibility, and an adjustable fit system, this jacket keeps you comfortable mile after mile.',
  price: 129.99,
  originalPrice: 179.99,
  images: [],
  category: 'UPPER_WEAR',
  gender: 'MEN',
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: ['#0ea5e9', '#1e293b', '#f97316'],
  stock: 42,
  isFeatured: true,
  rating: 4.8,
  reviewCount: 124,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product>(MOCK_PRODUCT);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addItem, toggleCart } = useCartStore();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch {
        // Use mock data
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Check if product is saved
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const res = await axios.get('/api/saved');
        if (res.data.ids?.includes(id)) setWishlist(true);
      } catch {
        // not logged in or error
      }
    };
    if (id) checkSaved();
  }, [id]);

  const handleToggleWishlist = async () => {
    try {
      const res = await axios.post('/api/saved', { productId: id });
      setWishlist(res.data.saved);
      toast.success(res.data.message);
    } catch {
      toast.error('Sign in to save items');
    }
  };

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success('Added to cart!');
    toggleCart();
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const defaultPlaceholder = '/gs.jpg';
  const productImages = product.images && product.images.length > 0 ? product.images : [defaultPlaceholder];
  const productVideos = product.videos || [];
  
  // Unified media array: images first, then videos
  type MediaItem = { type: 'image'; src: string } | { type: 'video'; src: string };
  const mediaItems: MediaItem[] = [
    ...productImages.map((src): MediaItem => ({ type: 'image', src })),
    ...productVideos.map((src): MediaItem => ({ type: 'video', src })),
  ];

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToSlide = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const slide = carouselRef.current.children[index] as HTMLElement;
    if (slide) {
      slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    setActiveImg(index);
  }, []);

  // Sync activeImg on scroll (snap)
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const slideWidth = el.offsetWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      if (newIndex !== activeImg && newIndex >= 0 && newIndex < mediaItems.length) {
        setActiveImg(newIndex);
      }
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [activeImg, mediaItems.length]);

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-20 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6 sm:mb-8" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>{t('productDetail.home')}</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>{t('productDetail.products')}</Link>
            <ChevronRight size={12} />
            <span className="truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Media Carousel */}
            <div className="space-y-3">
              {/* Main carousel */}
              <div className="relative">
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {mediaItems.map((item, i) => (
                    <div
                      key={i}
                      className="snap-center flex-shrink-0 w-full aspect-square relative rounded-2xl overflow-hidden glass"
                      style={{ border: '1px solid var(--card-border)' }}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.src}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = defaultPlaceholder; }}
                        />
                      ) : (
                        <video
                          src={item.src}
                          controls
                          preload="metadata"
                          className="w-full h-full object-contain bg-black"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 text-white text-xs font-black px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                    -{discount}%
                  </div>
                )}

                {/* Wishlist button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-xl glass"
                  style={{ border: '1px solid var(--border-subtle)' }}
                >
                  <Heart
                    size={18}
                    style={wishlist ? { fill: 'var(--color-primary)', color: 'var(--color-primary)' } : { color: 'var(--text-muted)' }}
                  />
                </motion.button>

                {/* Prev / Next arrows (desktop) */}
                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={() => scrollToSlide(Math.max(0, activeImg - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass items-center justify-center hidden sm:flex"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button
                      onClick={() => scrollToSlide(Math.min(mediaItems.length - 1, activeImg + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full glass items-center justify-center hidden sm:flex"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {mediaItems.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                    {mediaItems.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToSlide(i)}
                        className="w-2 h-2 rounded-full transition-all"
                        style={{
                          backgroundColor: activeImg === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)',
                          transform: activeImg === i ? 'scale(1.3)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails — images + videos */}
              {mediaItems.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                  {mediaItems.map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => scrollToSlide(i)}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all"
                      style={{ borderColor: activeImg === i ? 'var(--color-primary)' : 'var(--border-subtle)' }}
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.src}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = defaultPlaceholder; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-black/80 flex items-center justify-center relative">
                          <video src={item.src} className="w-full h-full object-cover opacity-60" muted preload="metadata" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play size={16} className="text-white" fill="white" />
                          </div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Name + rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    product.gender === 'MEN'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                  }`}>
                    {product.gender}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--text-muted) 10%, transparent)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                    {product.category?.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>{product.name}</h1>
                {product.rating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          style={i < Math.floor(product.rating!) ? { fill: 'var(--color-primary)', color: 'var(--color-primary)' } : { color: 'var(--border-subtle)' }}
                        />
                      ))}
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{product.rating} ({product.reviewCount} {t('productDetail.reviews')})</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg line-through mb-0.5" style={{ color: 'var(--text-muted)' }}>{formatPrice(product.originalPrice)}</span>
                )}
                {discount > 0 && (
                  <span className="text-sm font-bold mb-0.5" style={{ color: 'var(--color-primary)' }}>{t('productDetail.save')} {formatPrice(product.originalPrice! - product.price)}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    {t('productDetail.color')} {selectedColor && <span className="normal-case" style={{ color: 'var(--text-secondary)' }}>{t('productDetail.selected')}</span>}
                  </p>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color ? 'scale-110' : 'border-transparent'
                        }`}
                        style={selectedColor === color ? { background: color, borderColor: 'var(--text-primary)' } : { background: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>{t('productDetail.size')}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all`}
                        style={selectedSize === size ? { borderColor: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' } : { borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>{t('productDetail.quantity')}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center glass rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 transition-all"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      -
                    </button>
                    <span className="px-4 py-3 text-sm font-bold w-12 text-center" style={{ color: 'var(--text-primary)' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-4 py-3 transition-all"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.stock} {t('productDetail.inStock')}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(249,115,22,0.5)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="flex-1 relative overflow-hidden py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 text-white group/btn"
                  style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #f97316 100%)',
                    boxShadow: '0 4px 24px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <ShoppingCart size={18} className="drop-shadow-sm" />
                  <span className="drop-shadow-sm tracking-wide">{t('productDetail.addToCart')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-2xl font-bold backdrop-blur-md transition-all duration-300"
                  style={{
                    background: 'rgba(249,115,22,0.08)',
                    border: '1px solid rgba(249,115,22,0.25)',
                    color: 'var(--color-primary)',
                    boxShadow: '0 2px 12px rgba(249,115,22,0.08)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,115,22,0.15)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.25)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(249,115,22,0.08)'; }}
                >
                  {t('productDetail.buyNow')}
                </motion.button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, text: t('productDetail.freeShipping'), sub: t('productDetail.ordersOver') },
                  { icon: Shield, text: t('productDetail.guaranteed'), sub: t('productDetail.authentic') },
                  { icon: RotateCcw, text: t('productDetail.easyReturns'), sub: t('productDetail.returnPolicy') },
                ].map(({ icon: Icon, text, sub }) => (
                  <div key={text} className="glass p-3 rounded-xl text-center" style={{ border: '1px solid var(--card-border)' }}>
                    <Icon size={16} className="mx-auto mb-1.5" style={{ color: 'var(--color-primary)' }} />
                    <p className="text-[10px] font-bold" style={{ color: 'var(--text-secondary)' }}>{text}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={id as string} />
      </main>
      <Footer />
    </>
  );
}
