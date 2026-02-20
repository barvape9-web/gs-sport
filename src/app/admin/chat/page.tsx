'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Send, Loader2, Search, User, Clock,
  CheckCheck, Check, XCircle, ArrowLeft, Headphones,
  CircleDot, Archive,
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ChatConversation, ChatMessage } from '@/types';
import { useAuthStore } from '@/store/authStore';

export default function AdminChatPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<(ChatConversation & { unreadCount: number })[]>([]);
  const [activeConv, setActiveConv] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await axios.get('/api/chat');
      setConversations(res.data);
    } catch { /* silent */ }
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await axios.get(`/api/chat/${convId}`);
      setMessages(res.data.messages);
      setActiveConv(res.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchConversations().finally(() => setLoading(false));
  }, [fetchConversations]);

  // Poll for new messages
  useEffect(() => {
    if (activeConv) {
      pollRef.current = setInterval(() => fetchMessages(activeConv.id), 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeConv, fetchMessages]);

  // Poll conversations list
  useEffect(() => {
    const interval = setInterval(fetchConversations, 8000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    try {
      const res = await axios.post(`/api/chat/${activeConv.id}`, { content: newMsg });
      setMessages((prev) => [...prev, res.data]);
      setNewMsg('');
    } catch {
      toast.error('Failed to send');
    } finally {
      setSending(false);
    }
  };

  const toggleConversationStatus = async (convId: string, isOpen: boolean) => {
    try {
      await axios.patch(`/api/chat/${convId}`, { isOpen });
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, isOpen } : c))
      );
      if (activeConv?.id === convId) {
        setActiveConv((prev) => prev ? { ...prev, isOpen } : null);
      }
      toast.success(isOpen ? 'Conversation reopened' : 'Conversation closed');
    } catch {
      toast.error('Failed to update');
    }
  };

  const openConversation = async (conv: ChatConversation & { unreadCount: number }) => {
    setLoadingMsgs(true);
    await fetchMessages(conv.id);
    setLoadingMsgs(false);
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'open' && !conv.isOpen) return false;
    if (filter === 'closed' && conv.isOpen) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        conv.subject.toLowerCase().includes(q) ||
        conv.user?.name?.toLowerCase().includes(q) ||
        conv.user?.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f59e0b30, #f59e0b15)',
                border: '1px solid #f59e0b40',
                boxShadow: '0 4px 15px #f59e0b25, 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Headphones size={20} style={{ color: '#f59e0b' }} />
            </div>
            Live Chat
            {totalUnread > 0 && (
              <span
                className="px-2 py-0.5 text-xs font-bold rounded-full text-white animate-pulse"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {totalUnread} new
              </span>
            )}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage customer conversations
          </p>
        </div>
      </div>

      {/* Main chat layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6" style={{ minHeight: '600px' }}>
        {/* Conversation List (hide on mobile when active chat) */}
        <div className={`lg:col-span-4 admin-stat-card overflow-hidden flex flex-col ${activeConv ? 'hidden lg:flex' : 'flex'}`}>
          {/* Search + filters */}
          <div className="p-4 space-y-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full input-glass pl-9 pr-4 py-2.5 rounded-xl text-sm"
              />
            </div>
            <div className="flex gap-1">
              {(['all', 'open', 'closed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all capitalize"
                  style={filter === f ? {
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                    color: 'var(--color-primary)',
                  } : {
                    color: 'var(--text-muted)',
                  }}
                >
                  {f} {f === 'all' ? `(${conversations.length})` : f === 'open' ? `(${conversations.filter(c => c.isOpen).length})` : `(${conversations.filter(c => !c.isOpen).length})`}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 size={24} className="animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <motion.button
                  key={conv.id}
                  whileHover={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, transparent)' }}
                  onClick={() => openConversation(conv)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${activeConv?.id === conv.id ? '' : ''}`}
                  style={activeConv?.id === conv.id ? { backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' } : undefined}
                >
                  {/* User avatar */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: conv.isOpen
                        ? 'linear-gradient(135deg, color-mix(in srgb, #f59e0b 20%, transparent), color-mix(in srgb, #f59e0b 8%, transparent))'
                        : 'linear-gradient(135deg, rgba(100,100,100,0.15), rgba(100,100,100,0.05))',
                      border: `1px solid ${conv.isOpen ? 'color-mix(in srgb, #f59e0b 25%, transparent)' : 'var(--border-subtle)'}`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
                    }}
                  >
                    <User size={14} style={{ color: conv.isOpen ? '#f59e0b' : 'var(--text-muted)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>{conv.user?.name || 'User'}</p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 text-[9px] font-bold rounded-full text-white flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium truncate" style={{ color: 'var(--text-secondary)' }}>{conv.subject}</p>
                    <p className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {conv.messages[0]?.content || 'No messages'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={9} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{formatTime(conv.updatedAt)}</span>
                      {!conv.isOpen && (
                        <span className="text-[9px] px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-muted)' }}>Closed</span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`lg:col-span-8 admin-stat-card overflow-hidden flex flex-col ${!activeConv ? 'hidden lg:flex' : 'flex'}`}>
          {!activeConv ? (
            /* No conversation selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b20, #f59e0b08)',
                    border: '1px solid #f59e0b20',
                    boxShadow: '0 8px 30px rgba(245,158,11,0.1), 0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <Headphones size={36} style={{ color: '#f59e0b' }} />
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Select a conversation</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose from the list to start responding</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setActiveConv(null); fetchConversations(); }}
                    className="lg:hidden p-1.5 rounded-lg"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, color-mix(in srgb, #f59e0b 20%, transparent), color-mix(in srgb, #f59e0b 8%, transparent))',
                      border: '1px solid color-mix(in srgb, #f59e0b 25%, transparent)',
                      boxShadow: '0 4px 12px rgba(245,158,11,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <User size={14} style={{ color: '#f59e0b' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{activeConv.user?.name || 'User'}</p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{activeConv.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeConv.isOpen ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleConversationStatus(activeConv.id, false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ color: '#ef4444', backgroundColor: 'color-mix(in srgb, #ef4444 10%, transparent)', border: '1px solid color-mix(in srgb, #ef4444 20%, transparent)' }}
                    >
                      <XCircle size={12} />
                      Close
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleConversationStatus(activeConv.id, true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ color: '#10b981', backgroundColor: 'color-mix(in srgb, #10b981 10%, transparent)', border: '1px solid color-mix(in srgb, #10b981 20%, transparent)' }}
                    >
                      <CircleDot size={12} />
                      Reopen
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {loadingMsgs ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                  </div>
                ) : (
                  <>
                    {/* System message */}
                    <div className="text-center mb-4">
                      <span className="text-[10px] px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-muted)' }}>
                        Conversation started {new Date(activeConv.createdAt).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    {messages.map((msg) => {
                      const isAdmin = msg.isAdmin;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%]`}>
                            <div
                              className="px-4 py-2.5 rounded-2xl text-sm"
                              style={isAdmin ? {
                                background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 85%, #000))',
                                color: '#fff',
                                borderBottomRightRadius: '6px',
                              } : {
                                backgroundColor: 'var(--bg-elevated, var(--bg-secondary))',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-primary)',
                                borderBottomLeftRadius: '6px',
                              }}
                            >
                              {!isAdmin && (
                                <p className="text-[10px] font-bold mb-1" style={{ color: '#f59e0b' }}>
                                  {msg.sender?.name || 'Customer'}
                                </p>
                              )}
                              {isAdmin && (
                                <p className="text-[10px] font-bold mb-1 opacity-70">
                                  {msg.sender?.name || 'Admin'} (Support)
                                </p>
                              )}
                              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isAdmin ? 'justify-end' : ''}`}>
                              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatTime(msg.createdAt)}</span>
                              {isAdmin && (
                                msg.isRead
                                  ? <CheckCheck size={10} style={{ color: 'var(--color-primary)' }} />
                                  : <Check size={10} style={{ color: 'var(--text-muted)' }} />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              {activeConv.isOpen ? (
                <div className="p-3 sm:p-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex gap-2">
                    <input
                      value={newMsg}
                      onChange={(e) => setNewMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Type your reply..."
                      className="flex-1 input-glass px-4 py-3 rounded-xl text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      disabled={sending || !newMsg.trim()}
                      className="btn-primary p-3 rounded-xl text-white disabled:opacity-50"
                    >
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="flex items-center justify-center gap-2">
                    <Archive size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>This conversation is closed</span>
                    <button
                      onClick={() => toggleConversationStatus(activeConv.id, true)}
                      className="text-xs font-bold ml-2"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Reopen
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
