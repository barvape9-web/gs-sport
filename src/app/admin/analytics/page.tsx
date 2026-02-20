'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Calendar,
  Loader2,
  RefreshCw,
  Download,
  ArrowUpRight,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import axios from 'axios';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'];

interface AnalyticsStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface StatusDataPoint {
  name: string;
  value: number;
}

// Mock data generators
const generateMockRevenue = (days: number): ChartDataPoint[] =>
  Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 86400000).toLocaleDateString('en', {
      month: 'short',
      day: 'numeric',
    }),
    revenue: 0,
    orders: 0,
  }));

const mockStatusData: StatusDataPoint[] = [
  { name: 'Delivered', value: 0 },
  { name: 'Shipped', value: 0 },
  { name: 'Processing', value: 0 },
  { name: 'Pending', value: 0 },
  { name: 'Cancelled', value: 0 },
];

const mockStats: AnalyticsStats = {
  totalOrders: 0,
  totalRevenue: 0,
  totalUsers: 0,
  totalProducts: 0,
};

const topProducts: { name: string; sales: number; revenue: number }[] = [];

type Period = '7d' | '30d' | '90d';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats>(mockStats);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [statusData, setStatusData] = useState<StatusDataPoint[]>(mockStatusData);
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);

  const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : 90;

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      await axios.get(`/api/admin/analytics?period=${periodDays}`);
      // Stats are zeroed out — ignore API response
      setRevenueData(generateMockRevenue(periodDays));
    } catch {
      setRevenueData(generateMockRevenue(periodDays));
    } finally {
      setLoading(false);
    }
  }, [periodDays]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      change: '0%',
      up: false,
      icon: DollarSign,
      color: '#f97316',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '0%',
      up: false,
      icon: ShoppingCart,
      color: '#3b82f6',
    },
    {
      title: 'New Users',
      value: stats.totalUsers.toLocaleString(),
      change: '0%',
      up: false,
      icon: Users,
      color: '#10b981',
    },
    {
      title: 'Active Products',
      value: stats.totalProducts.toLocaleString(),
      change: '0%',
      up: false,
      icon: Package,
      color: '#8b5cf6',
    },
  ];

  const totalOrders = statusData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-page-header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="icon-3d w-11 h-11"
            style={{
              background: 'linear-gradient(135deg, #10b98125, #10b98110)',
              border: '1px solid #10b98120',
              boxShadow: '0 4px 15px rgba(16,185,129,0.15), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <TrendingUp size={18} style={{ color: '#10b981', filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.4))' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Performance overview for the last {periodDays} days
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 glass rounded-2xl" style={{ border: '1px solid var(--border-subtle)' }}>
            {(['7d', '30d', '90d'] as const).map((p) => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-xs rounded-xl font-bold uppercase tracking-wider transition-all ${
                  period === p
                    ? 'bg-[#f97316] text-white shadow-lg shadow-orange-500/25'
                    : ''
                }`}
                style={period !== p ? { color: 'var(--text-muted)' } : undefined}
                onMouseEnter={(e) => { if (period !== p) e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { if (period !== p) e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {p}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(249,115,22,0.15)' }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAnalytics}
            className="p-2.5 glass rounded-2xl transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f97316'; e.currentTarget.style.borderColor = 'color-mix(in srgb, #f97316 20%, transparent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </motion.button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-[#f97316]" size={32} />
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="admin-stat-card shine-sweep p-5"
            style={{ '--card-glow': `${stat.color}15` } as React.CSSProperties}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="icon-3d w-10 h-10"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}25, ${stat.color}10)`,
                  border: `1px solid ${stat.color}20`,
                  boxShadow: `0 4px 12px ${stat.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`,
                }}
              >
                <stat.icon size={16} style={{ color: stat.color, filter: `drop-shadow(0 2px 4px ${stat.color}60)` }} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-bold ${
                  stat.up ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stat.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 admin-chart-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #f9731618, #f9731608)', border: '1px solid #f9731612' }}>
                <DollarSign size={13} style={{ color: '#f97316' }} />
              </div>
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Revenue Trend</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Daily revenue for the last {periodDays} days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={12} />
              Last {period}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₾${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,15,0.95)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
                formatter={(value: number | undefined) => [formatPrice(value ?? 0), 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#analyticsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="admin-chart-card p-6"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #3b82f618, #3b82f608)', border: '1px solid #3b82f612' }}>
              <ShoppingCart size={13} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Order Breakdown</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{totalOrders} total orders</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,15,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Status list */}
          <div className="mt-4 space-y-2">
            {statusData.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    ({totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Orders Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-chart-card p-6"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #f9731618, #f9731608)', border: '1px solid #f9731612' }}>
              <Package size={13} style={{ color: '#f97316' }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Orders per Day</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Daily order volume</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,15,15,0.95)',
                  border: '1px solid rgba(249,115,22,0.3)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-chart-card p-6"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #8b5cf618, #8b5cf608)', border: '1px solid #8b5cf612' }}>
              <TrendingUp size={13} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Top Products</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Best performers by revenue</p>
            </div>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-4">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                  style={{
                    backgroundColor: `${COLORS[i]}20`,
                    color: COLORS[i],
                    border: `1px solid ${COLORS[i]}30`,
                  }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{product.sales} sales</p>
                    {/* Mini bar */}
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--overlay-bg)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(product.sales / topProducts[0].sales) * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: COLORS[i] }}>
                  {formatPrice(product.revenue)}
                </span>
                <ArrowUpRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Conversion Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="admin-chart-card p-6"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="icon-3d w-8 h-8" style={{ background: 'linear-gradient(135deg, #ec489918, #ec489908)', border: '1px solid #ec489912' }}>
            <TrendingUp size={13} style={{ color: '#ec4899' }} />
          </div>
          <div>
              <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Key Metrics</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Performance benchmarks</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Avg. Order Value',
              value: stats.totalOrders > 0 ? formatPrice(stats.totalRevenue / stats.totalOrders) : formatPrice(0),
              icon: DollarSign,
              color: '#f97316',
            },
            {
              label: 'Conversion Rate',
              value: '3.2%',
              icon: TrendingUp,
              color: '#10b981',
            },
            {
              label: 'Orders / Day',
              value: Math.round(stats.totalOrders / periodDays).toString(),
              icon: ShoppingCart,
              color: '#3b82f6',
            },
            {
              label: 'Revenue / Day',
              value: formatPrice(stats.totalRevenue / periodDays),
              icon: DollarSign,
              color: '#8b5cf6',
            },
          ].map((metric) => (
            <motion.div key={metric.label} whileHover={{ y: -2 }} className="admin-stat-card !p-4 text-center" style={{ '--card-glow': `${metric.color}10` } as React.CSSProperties}>
              <div className="icon-3d w-8 h-8 mx-auto mb-2" style={{ background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}08)`, border: `1px solid ${metric.color}15` }}>
                <metric.icon size={13} style={{ color: metric.color }} />
              </div>
              <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{metric.value}</p>
              <p className="text-[10px] mt-1 uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
