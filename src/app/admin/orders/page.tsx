'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Eye, Edit, Loader2, Check, ShoppingCart, X, Package, Phone } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

/* ── Status badge with click-to-open dropdown (portalled to body) ── */
function StatusDropdown({
  orderId,
  currentStatus,
  onUpdate,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  onUpdate: (id: string, status: OrderStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 6, left: rect.left });
    setOpen(true);
  }, []);

  /* close on outside click or Escape */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropRef.current &&
        !dropRef.current.contains(e.target as Node) &&
        badgeRef.current &&
        !badgeRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={badgeRef}
        onClick={openMenu}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-full cursor-pointer transition-all hover:ring-1 hover:ring-white/20 ${getOrderStatusColor(currentStatus)}`}
      >
        {currentStatus}
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Portal dropdown rendered at body level so overflow can't clip it */}
      {open && pos && typeof document !== 'undefined' && (
        <AnimatePresence>
          <motion.div
            ref={dropRef}
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[9999] w-44 rounded-xl border border-white/10 bg-[#141414]/95 backdrop-blur-xl shadow-2xl p-1.5"
            style={{ top: pos.top, left: pos.left }}
          >
            <p className="px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
              Change Status
            </p>
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onUpdate(orderId, s);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                  currentStatus === s
                    ? 'text-[#f97316] bg-[#f97316]/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      s === 'PENDING' ? 'bg-yellow-400' :
                      s === 'PROCESSING' ? 'bg-blue-400' :
                      s === 'SHIPPED' ? 'bg-purple-400' :
                      s === 'DELIVERED' ? 'bg-green-400' :
                      'bg-red-400'
                    }`}
                  />
                  {s}
                </span>
                {currentStatus === s && <Check size={12} className="text-[#f97316]" />}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/orders');
        setOrders(res.data.orders || []);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    toast.success(`Order status → ${newStatus}`);
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="icon-3d w-11 h-11"
            style={{
              background: 'linear-gradient(135deg, #10b98125, #10b98110)',
              border: '1px solid #10b98120',
              boxShadow: '0 4px 15px rgba(16,185,129,0.15), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <ShoppingCart size={18} style={{ color: '#10b981', filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.4))' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Orders</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{orders.length} total orders</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email..."
            className="w-full input-glass pl-10 pr-4 py-3 rounded-2xl text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
            className="input-glass pl-9 pr-10 py-3 rounded-2xl text-sm appearance-none cursor-pointer min-w-40"
          >
            <option value="ALL">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#f97316]" size={32} />
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['ALL', ...ALL_STATUSES] as const).map((status, i) => {
          const count = status === 'ALL' ? orders.length : orders.filter((o) => o.status === status).length;
          const statusColors: Record<string, string> = {
            ALL: '#f97316', PENDING: '#eab308', PROCESSING: '#3b82f6',
            SHIPPED: '#8b5cf6', DELIVERED: '#10b981', CANCELLED: '#ef4444',
          };
          const color = statusColors[status] || '#f97316';
          const selected = statusFilter === status;
          return (
            <motion.button
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStatusFilter(status as OrderStatus | 'ALL')}
              className="admin-stat-card text-center"
              style={{
                '--card-glow': `${color}15`,
                borderColor: selected ? `${color}40` : undefined,
                background: selected
                  ? `linear-gradient(135deg, ${color}10, ${color}05)`
                  : undefined,
              } as React.CSSProperties}
            >
              <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{count}</p>
              <p className="text-[10px] mt-1 uppercase tracking-wider font-bold" style={{ color: selected ? color : 'var(--text-muted)' }}>
                {status}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="admin-chart-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th className="hidden md:table-cell">Customer</th>
              <th className="hidden lg:table-cell">Date</th>
              <th>Total</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order, i) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <td>
                  <span className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                    #{order.id.replace('ord-', '').toUpperCase()}
                  </span>
                </td>
                <td className="hidden md:table-cell">
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{order.user?.name}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{order.user?.email}</p>
                </td>
                <td className="hidden lg:table-cell">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(order.createdAt)}</span>
                </td>
                <td>
                  <span className="text-sm font-bold text-[#f97316]">{formatPrice(order.total)}</span>
                </td>
                <td>
                  <StatusDropdown
                    orderId={order.id}
                    currentStatus={order.status}
                    onUpdate={updateStatus}
                  />
                </td>
                <td>
                  <div className="flex items-center justify-end gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-white/25 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      title="View Order"
                    >
                      <Eye size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-white/25 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-xl transition-all"
                      title="Edit Order"
                    >
                      <Edit size={14} />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center" style={{ color: 'var(--text-muted)' }}>
            <ShoppingCart size={32} className="mx-auto mb-3 opacity-30" />
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl max-h-[90vh] overflow-y-auto"
            >
              <div className="admin-chart-card p-6 m-4">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="icon-3d w-10 h-10" style={{ background: 'linear-gradient(135deg, #10b98125, #10b98110)', border: '1px solid #10b98120', boxShadow: '0 4px 15px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                      <Package size={16} style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Order Details</h2>
                      <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>#{selectedOrder.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-white/30 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Customer */}
                <div className="space-y-4">
                  <div className="glass rounded-xl p-4" style={{ border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Customer</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedOrder.user?.name || 'N/A'}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{selectedOrder.user?.email || 'N/A'}</p>
                  </div>

                  {/* Address */}
                  {selectedOrder.address && (
                    <div className="glass rounded-xl p-4" style={{ border: '1px solid var(--border-subtle)' }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Shipping Address</p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {selectedOrder.address.fullName}<br />
                        {selectedOrder.address.line1}<br />
                        {selectedOrder.address.line2 && <>{selectedOrder.address.line2}<br /></>}
                        {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.postalCode}<br />
                        {selectedOrder.address.country}
                      </p>
                      {selectedOrder.address.phone && (
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                          <Phone size={13} style={{ color: 'var(--color-primary)' }} />
                          <a href={`tel:${selectedOrder.address.phone}`} className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                            {selectedOrder.address.phone}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="glass rounded-xl p-4" style={{ border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Status</p>
                    <StatusDropdown orderId={selectedOrder.id} currentStatus={selectedOrder.status} onUpdate={(id, status) => {
                      updateStatus(id, status);
                      setSelectedOrder(prev => prev ? { ...prev, status } : null);
                    }} />
                  </div>

                  {/* Items */}
                  <div className="glass rounded-xl p-4" style={{ border: '1px solid var(--border-subtle)' }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Items ({selectedOrder.items?.length || 0})</p>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 glass" style={{ border: '1px solid var(--border-subtle)' }}>
                            {item.product?.images?.[0] ? (
                              <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={12} className="text-white/20" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.product?.name || 'Product'}</p>
                            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="glass rounded-xl p-4" style={{ border: '1px solid var(--border-subtle)' }}>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Subtotal</span>
                        <span>{formatPrice(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                        <span>Shipping</span>
                        <span>{selectedOrder.shipping === 0 ? 'FREE' : formatPrice(selectedOrder.shipping)}</span>
                      </div>
                      <div className="flex justify-between font-black text-sm border-t pt-2" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--color-primary)' }}>{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Ordered on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
