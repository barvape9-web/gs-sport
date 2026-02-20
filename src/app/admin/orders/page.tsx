'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, Eye, Edit, Loader2, Check } from 'lucide-react';
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
            <p className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-white/25 font-bold">
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Orders</h1>
          <p className="text-white/40 text-sm">{orders.length} total orders</p>
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
            className="w-full input-glass pl-10 pr-4 py-3 rounded-xl text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
            className="input-glass pl-9 pr-10 py-3 rounded-xl text-sm appearance-none cursor-pointer min-w-40"
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
        {(['ALL', ...ALL_STATUSES] as const).map((status) => {
          const count = status === 'ALL' ? orders.length : orders.filter((o) => o.status === status).length;
          return (
            <motion.button
              key={status}
              whileHover={{ y: -2 }}
              onClick={() => setStatusFilter(status as OrderStatus | 'ALL')}
              className={`glass-card p-3 text-center transition-all ${
                statusFilter === status ? 'border-[#f97316]/40 bg-[#f97316]/5' : ''
              }`}
            >
              <p className="text-xl font-black text-white">{count}</p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider font-medium">{status}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
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
            {filtered.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td>
                  <span className="text-sm font-mono font-bold text-white">
                    #{order.id.replace('ord-', '').toUpperCase()}
                  </span>
                </td>
                <td className="hidden md:table-cell">
                  <p className="text-xs text-white/70">{order.user?.name}</p>
                  <p className="text-[10px] text-white/30">{order.user?.email}</p>
                </td>
                <td className="hidden lg:table-cell">
                  <span className="text-xs text-white/50">{formatDate(order.createdAt)}</span>
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
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                      <Eye size={14} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-white/30 hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-lg transition-all"
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
          <div className="py-16 text-center text-white/30">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
