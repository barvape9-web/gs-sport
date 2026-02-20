'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, MessageCircle, Loader2,
  Headphones, Plus, ArrowLeft, Check, CheckCheck,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { ChatConversation, ChatMessage } from '@/types';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/useTranslation';

export default function ContactPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();


  const [conversations, setConversations] = useState<(ChatConversation & { unreadCount: number })[]>([]);
  const [activeConv, setActiveConv] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newFirstMsg, setNewFirstMsg] = useState('');
  const [creating, setCreating] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get('/api/chat');
      setConversations(res.data);
    } catch { /* silent */ }
  }, [user]);

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await axios.get(`/api/chat/${convId}`);
      setMessages(res.data.messages);
      setActiveConv(res.data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (user) {
      setLoadingConvs(true);
      fetchConversations().finally(() => setLoadingConvs(false));
    }
  }, [user, fetchConversations]);

  // Poll for new messages in active conversation
  useEffect(() => {
    if (activeConv) {
      pollRef.current = setInterval(() => fetchMessages(activeConv.id), 4000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeConv, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateConversation = async () => {
    if (!newSubject.trim() || !newFirstMsg.trim()) {
      toast.error('Fill in both subject and message');
      return;
    }
    setCreating(true);
    try {
      const res = await axios.post('/api/chat', { subject: newSubject, message: newFirstMsg });
      setConversations((prev) => [{ ...res.data, unreadCount: 0 }, ...prev]);
      setActiveConv(res.data);
      setMessages(res.data.messages);
      setShowNewChat(false);
      setNewSubject('');
      setNewFirstMsg('');
      toast.success('Chat started!');
    } catch {
      toast.error('Failed to create chat');
    } finally {
      setCreating(false);
    }
  };

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

  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Header */}
        <div className="relative py-12 sm:py-16 overflow-hidden border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,90vw)] h-[min(300px,50vw)] rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                {t('contact.getInTouch')}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4" style={{ color: 'var(--text-primary)' }}>
                {t('contact.contactUs')} <span className="gradient-text">{t('contact.contactUsAccent')}</span>
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>{t('contact.subtitle')}</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('contact.letsConnect')}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {t('contact.connectDesc')}
                </p>
              </div>

              {/* Live Chat Status Card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-5"
                style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 25%, transparent), color-mix(in srgb, var(--color-primary) 10%, transparent))',
                      border: '1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)',
                      boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 15%, transparent), 0 8px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
                    }}
                  >
                    <Headphones size={22} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t('contact.liveChatSupport')}</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {t('contact.onlineNow')}
                    </p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {user ? t('contact.startChat') : t('contact.loginForChat')}
                </p>
              </motion.div>
            </motion.div>

            {/* Live Chat Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              {!user ? (
                /* Not logged in */
                <div className="glass-card p-8 sm:p-12 text-center">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))',
                      border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                      boxShadow: '0 8px 30px color-mix(in srgb, var(--color-primary) 15%, transparent), 0 12px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                    }}
                  >
                    <MessageCircle size={36} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{t('contact.startLiveChat')}</h3>
                  <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                    {t('contact.loginPrompt')}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/login')}
                    className="btn-primary px-8 py-3 rounded-xl font-bold text-white"
                  >
                    {t('contact.logInToChat')}
                  </motion.button>
                </div>
              ) : !activeConv ? (
                /* Conversation list view */
                <div className="glass-card overflow-hidden" style={{ minHeight: '500px' }}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 sm:p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent), color-mix(in srgb, var(--color-primary) 8%, transparent))',
                          border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                          boxShadow: '0 4px 15px color-mix(in srgb, var(--color-primary) 12%, transparent), inset 0 1px 0 rgba(255,255,255,0.1)',
                        }}
                      >
                        <MessageCircle size={18} style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t('contact.liveChat')}</h3>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t('contact.yourConversations')}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNewChat(true)}
                      className="btn-primary px-3 py-2 rounded-lg text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      <Plus size={14} />
                      {t('contact.newChat')}
                    </motion.button>
                  </div>

                  {/* New chat form */}
                  <AnimatePresence>
                    {showNewChat && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      >
                        <div className="p-4 sm:p-5 space-y-3">
                          <input
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder={t('contact.subject')}
                            className="w-full input-glass px-4 py-2.5 rounded-xl text-sm"
                          />
                          <textarea
                            value={newFirstMsg}
                            onChange={(e) => setNewFirstMsg(e.target.value)}
                            placeholder={t('contact.howCanWeHelp')}
                            rows={3}
                            className="w-full input-glass px-4 py-2.5 rounded-xl text-sm resize-none"
                          />
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleCreateConversation}
                              disabled={creating}
                              className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                            >
                              {creating ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                              {t('contact.startChatBtn')}
                            </motion.button>
                            <button
                              onClick={() => setShowNewChat(false)}
                              className="px-4 py-2.5 rounded-xl text-sm glass"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {t('contact.cancel')}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Conversation list */}
                  <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    {loadingConvs ? (
                      <div className="p-12 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('contact.loadingChats')}</p>
                      </div>
                    ) : conversations.length === 0 ? (
                      <div className="p-12 text-center">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                          style={{
                            background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))',
                            border: '1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                          }}
                        >
                          <Headphones size={28} style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{t('contact.noConversations')}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {t('contact.clickNewChat')}
                        </p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <motion.button
                          key={conv.id}
                          whileHover={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, transparent)' }}
                          onClick={() => openConversation(conv)}
                          className="w-full text-left p-4 sm:p-5 flex items-start gap-3 transition-colors"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              background: conv.isOpen
                                ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 18%, transparent), color-mix(in srgb, var(--color-primary) 8%, transparent))'
                                : 'linear-gradient(135deg, rgba(100,100,100,0.15), rgba(100,100,100,0.05))',
                              border: `1px solid ${conv.isOpen ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)' : 'var(--border-subtle)'}`,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
                            }}
                          >
                            <MessageCircle size={15} style={{ color: conv.isOpen ? 'var(--color-primary)' : 'var(--text-muted)' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{conv.subject}</p>
                              {conv.unreadCount > 0 && (
                                <span
                                  className="px-1.5 py-0.5 text-[10px] font-bold rounded-full text-white flex-shrink-0"
                                  style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              {conv.messages[0]?.content || t('contact.noMessages')}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatTime(conv.updatedAt)}</span>
                              {!conv.isOpen && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-muted)' }}>{t('contact.closed')}</span>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* Active conversation / Chat view */
                <div className="glass-card overflow-hidden flex flex-col" style={{ height: '560px' }}>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 p-4 sm:p-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setActiveConv(null); fetchConversations(); }}
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ArrowLeft size={18} />
                    </motion.button>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, color-mix(in srgb, #10b981 20%, transparent), color-mix(in srgb, #10b981 8%, transparent))',
                        border: '1px solid color-mix(in srgb, #10b981 20%, transparent)',
                        boxShadow: '0 4px 12px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
                      }}
                    >
                      <Headphones size={15} style={{ color: '#10b981' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{activeConv.subject}</p>
                      <p className="text-[10px] text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        {t('contact.supportOnline')}
                      </p>
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
                        {messages.map((msg) => {
                          const isMine = msg.senderId === user?.id;
                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[80%] ${isMine ? 'order-1' : ''}`}>
                                <div
                                  className="px-4 py-2.5 rounded-2xl text-sm"
                                  style={isMine ? {
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
                                  {!isMine && (
                                    <p className="text-[10px] font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                                      {msg.sender?.name || 'Support'}
                                    </p>
                                  )}
                                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatTime(msg.createdAt)}</span>
                                  {isMine && (
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
                          placeholder={t('contact.typeMessage')}
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
                    <div className="p-4 text-center text-xs" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      {t('contact.conversationClosed')}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
