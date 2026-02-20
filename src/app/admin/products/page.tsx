'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  Save,
  Package,
  Loader2,
} from 'lucide-react';
import { Product, Gender, Category } from '@/types';
import { formatPrice, getCategoryLabel } from '@/lib/utils';
import axios from 'axios';
import toast from 'react-hot-toast';

const MOCK_PRODUCTS: Product[] = Array.from({ length: 10 }, (_, i) => ({
  id: `prod-${i}`,
  name: ['Pro Tee', 'Running Shorts', 'Hoodie', 'Leggings', 'Cap', 'Jacket', 'Tank', 'Sneakers', 'Socks', 'Bag'][i],
  description: 'Premium sportswear product',
  price: 29.99 + i * 10,
  images: [],
  gender: i % 2 === 0 ? 'MEN' : 'WOMEN',
  category: (['UPPER_WEAR', 'LOWER_WEAR', 'ACCESSORIES'] as const)[i % 3],
  sizes: ['S', 'M', 'L', 'XL'],
  colors: ['Black', 'White'],
  stock: 50 + i * 5,
  isActive: true,
  isFeatured: i < 3,
  popularity: 100 - i * 8,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

interface FormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  gender: Gender;
  category: Category;
  stock: string;
  isFeatured: boolean;
  sizes: string;
  colors: string;
}

const defaultForm: FormData = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  gender: 'MEN',
  category: 'UPPER_WEAR',
  stock: '0',
  isFeatured: false,
  sizes: 'XS,S,M,L,XL',
  colors: 'Black,White',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products?admin=true');
        setProducts(res.data.products || MOCK_PRODUCTS);
      } catch {
        setProducts(MOCK_PRODUCTS);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.includes(search.toUpperCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      originalPrice: String(product.originalPrice || ''),
      gender: product.gender,
      category: product.category,
      stock: String(product.stock),
      isFeatured: product.isFeatured,
      sizes: product.sizes.join(','),
      colors: product.colors.join(','),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stock: parseInt(form.stock),
        sizes: form.sizes.split(',').map((s) => s.trim()),
        colors: form.colors.split(',').map((c) => c.trim()),
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, payload);
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
        );
        toast.success('Product updated!');
      } else {
        const res = await axios.post('/api/products', payload);
        setProducts((prev) => [res.data, ...prev]);
        toast.success('Product created!');
      }
      setIsModalOpen(false);
    } catch {
      // Optimistic update for demo
      if (editingProduct) {
        const price = parseFloat(form.price);
        const stock = parseInt(form.stock);
        const originalPrice = form.originalPrice ? parseFloat(form.originalPrice) : undefined;
        const sizes = form.sizes.split(',').map((s: string) => s.trim());
        const colors = form.colors.split(',').map((c: string) => c.trim());
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? { ...p, name: form.name, description: form.description, price, stock, originalPrice, sizes, colors, isFeatured: form.isFeatured, gender: form.gender as import('@/types').Gender, category: form.category as import('@/types').Category }
              : p
          )
        );
      }
      toast.success(editingProduct ? 'Product updated!' : 'Product created!');
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
    } catch {
      // proceed anyway in demo
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Product deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="icon-3d w-11 h-11"
            style={{
              background: 'linear-gradient(135deg, #3b82f625, #3b82f610)',
              border: '1px solid #3b82f620',
              boxShadow: '0 4px 15px rgba(59,130,246,0.15), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Package size={18} style={{ color: '#3b82f6', filter: 'drop-shadow(0 2px 4px rgba(59,130,246,0.4))' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Products</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{products.length} total products</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(249,115,22,0.3)' }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="btn-primary px-5 py-2.5 rounded-2xl font-semibold text-white flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full input-glass pl-10 pr-4 py-3 rounded-2xl text-sm"
        />
      </div>

      {/* Products Table */}
      <div className="admin-chart-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th className="hidden md:table-cell">Category</th>
              <th className="hidden lg:table-cell">Gender</th>
              <th>Price</th>
              <th className="hidden sm:table-cell">Stock</th>
              <th className="hidden sm:table-cell">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 * filtered.indexOf(product) }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="icon-3d w-10 h-10 shrink-0" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))', border: '1px solid rgba(59,130,246,0.12)' }}>
                      <Package size={14} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate max-w-[160px]" style={{ color: 'var(--text-primary)' }}>
                        {product.name}
                      </p>
                      {product.isFeatured && (
                        <span className="text-[10px] text-[#f97316] font-bold">★ Featured</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{getCategoryLabel(product.category)}</span>
                </td>
                <td className="hidden lg:table-cell">
                  <span
                    className={`admin-badge ${
                      product.gender === 'MEN'
                        ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        : product.gender === 'WOMEN' ? 'bg-pink-500/10 text-pink-300 border border-pink-500/20'
                        : 'bg-white/5 text-white/50 border border-white/10'
                    }`}
                  >
                    {product.gender}
                  </span>
                </td>
                <td>
                  <span className="text-sm font-bold text-[#f97316]">
                    {formatPrice(product.price)}
                  </span>
                </td>
                <td className="hidden sm:table-cell">
                  <span
                    className={`text-xs font-bold ${
                      product.stock > 20 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="hidden sm:table-cell">
                  <span
                    className={`admin-badge ${
                      product.isActive
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openEdit(product)}
                      className="p-2 text-white/25 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-xl transition-all"
                    >
                      <Edit size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-white/25 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="admin-chart-card p-6 m-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="icon-3d w-10 h-10" style={{ background: 'linear-gradient(135deg, #f9731625, #f9731610)', border: '1px solid #f9731620', boxShadow: '0 4px 15px rgba(249,115,22,0.15), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <Package size={16} style={{ color: '#f97316' }} />
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {editingProduct ? 'Edit Product' : 'New Product'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-white/30 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Product Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="Product name"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm resize-none"
                      placeholder="Product description"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Price ($)</label>
                    <input
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      type="number"
                      step="0.01"
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Original Price ($)</label>
                    <input
                      value={form.originalPrice}
                      onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                      type="number"
                      step="0.01"
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="0.00 (optional)"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Gender</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                    >
                      <option value="MEN">Men</option>
                      <option value="WOMEN">Women</option>
                      <option value="UNISEX">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                    >
                      <option value="UPPER_WEAR">Upper Wear</option>
                      <option value="LOWER_WEAR">Lower Wear</option>
                      <option value="WINTER_WEAR">Winter Wear</option>
                      <option value="SUMMER_WEAR">Summer Wear</option>
                      <option value="ACCESSORIES">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Stock</label>
                    <input
                      value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })}
                      type="number"
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Sizes (comma-separated)</label>
                    <input
                      value={form.sizes}
                      onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="XS,S,M,L,XL"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Colors (comma-separated)</label>
                    <input
                      value={form.colors}
                      onChange={(e) => setForm({ ...form, colors: e.target.value })}
                      className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                      placeholder="Black,White,Orange"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Product Images</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-[#f97316]/30 transition-colors cursor-pointer">
                      <Upload size={24} className="text-white/20 mx-auto mb-2" />
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to upload product images</p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#f97316]"
                    />
                    <label htmlFor="featured" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Mark as Featured Product
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex-1 btn-primary py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {editingProduct ? 'Update' : 'Create'} Product
                  </motion.button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 glass rounded-xl text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
