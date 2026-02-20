'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

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

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pt-20 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6 sm:mb-8" style={{ color: 'var(--text-muted)' }}>
            <Link href="/" className="transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>Products</Link>
            <ChevronRight size={12} />
            <span className="truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-square rounded-2xl overflow-hidden glass" style={{ border: '1px solid var(--card-border)' }}
              >
                <img
                  src={productImages[activeImg] || defaultPlaceholder}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = defaultPlaceholder; }}
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 text-white text-xs font-black px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                    -{discount}%
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 p-2.5 rounded-xl glass" style={{ border: '1px solid var(--border-subtle)' }}
                >
                  <Heart
                    size={18}
                    style={wishlist ? { fill: 'var(--color-primary)', color: 'var(--color-primary)' } : { color: 'var(--text-muted)' }}
                  />
                </motion.button>
              </motion.div>

              {/* Thumbnails — only show when multiple images */}
              {productImages.length > 1 && (
                <div className="flex gap-3">
                  {productImages.map((img, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all`}
                      style={{ borderColor: activeImg === i ? 'var(--color-primary)' : 'var(--border-subtle)' }}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = defaultPlaceholder; }}
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Product Videos */}
              {product.videos && product.videos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Product Videos</h3>
                  {product.videos.map((videoUrl, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden glass" style={{ border: '1px solid var(--card-border)' }}>
                      <video
                        src={videoUrl}
                        controls
                        className="w-full max-h-[400px] object-contain bg-black"
                        preload="metadata"
                      />
                    </div>
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
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{product.rating} ({product.reviewCount} reviews)</span>
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
                  <span className="text-sm font-bold mb-0.5" style={{ color: 'var(--color-primary)' }}>Save {formatPrice(product.originalPrice! - product.price)}</span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{product.description}</p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    Color {selectedColor && <span className="normal-case" style={{ color: 'var(--text-secondary)' }}>selected</span>}
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
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Size</p>
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
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Quantity</p>
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
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{product.stock} in stock</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 btn-primary py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="flex-1 py-4 rounded-xl font-bold glass border transition-all"
                  style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)', color: 'var(--color-primary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--color-primary) 10%, transparent)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                >
                  Buy Now
                </motion.button>
              </div>

              {/* Perks */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, text: 'Free Shipping', sub: 'Orders over $75' },
                  { icon: Shield, text: 'Guaranteed', sub: '100% authentic' },
                  { icon: RotateCcw, text: 'Easy Returns', sub: '30-day policy' },
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
      </main>
      <Footer />
    </>
  );
}
