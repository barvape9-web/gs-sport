'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, User, Users, Trash2, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { User as UserType } from '@/types';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import axios from 'axios';

type RoleFilter = 'ALL' | 'USER' | 'ADMIN';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/users');
        setUsers(res.data.users || []);
      } catch {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleRole = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
      await axios.put(`/api/admin/users/${userId}`, { role: newRole }).catch(() => {});
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`).catch(() => {});
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const initials = (name?: string | null) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  const colors = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="admin-page-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="icon-3d w-11 h-11"
            style={{
              background: 'linear-gradient(135deg, #8b5cf625, #8b5cf610)',
              border: '1px solid #8b5cf620',
              boxShadow: '0 4px 15px rgba(139,92,246,0.15), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Users size={18} style={{ color: '#8b5cf6', filter: 'drop-shadow(0 2px 4px rgba(139,92,246,0.4))' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Users</h1>
            <p className="text-white/35 text-sm">{users.length} registered users</p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ y: -2 }} className="admin-stat-card !p-3 text-center" style={{ '--card-glow': 'rgba(249,115,22,0.1)' } as React.CSSProperties}>
            <p className="text-lg font-black text-[#f97316]">{users.filter((u) => u.role === 'ADMIN').length}</p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider font-bold">Admins</p>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} className="admin-stat-card !p-3 text-center" style={{ '--card-glow': 'rgba(59,130,246,0.1)' } as React.CSSProperties}>
            <p className="text-lg font-black text-blue-400">{users.filter((u) => u.role === 'USER').length}</p>
            <p className="text-[10px] text-white/25 uppercase tracking-wider font-bold">Users</p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full input-glass pl-10 pr-4 py-3 rounded-xl text-sm"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className="input-glass pl-9 pr-10 py-3 rounded-xl text-sm appearance-none cursor-pointer min-w-36"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-[#f97316]" size={32} />
        </div>
      )}

      {/* Users Table */}
      <div className="admin-chart-card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th className="hidden md:table-cell">Joined</th>
              <th>Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="icon-3d w-9 h-9 shrink-0"
                      style={{ background: `linear-gradient(135deg, ${colors[idx % colors.length]}25, ${colors[idx % colors.length]}10)`, border: `1px solid ${colors[idx % colors.length]}20` }}
                    >
                      <span className="text-xs font-black" style={{ color: colors[idx % colors.length] }}>{initials(user.name)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name || 'Unknown'}</p>
                      <p className="text-xs text-white/30">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  <span className="text-xs text-white/40">{formatDate(user.createdAt)}</span>
                </td>
                <td>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                  >
                    {user.role === 'ADMIN' ? (
                      <span className="flex items-center gap-1">
                        <Shield size={9} />
                        ADMIN
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User size={9} />
                        USER
                      </span>
                    )}
                  </span>
                </td>
                <td>
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleRole(user.id)}
                      className="px-3 py-1.5 text-[10px] font-bold rounded-lg glass border border-white/10 hover:border-[#f97316]/30 text-white/50 hover:text-white transition-all"
                    >
                      {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={13} />
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
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
