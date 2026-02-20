'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@gs-sport.com', color: 'var(--color-primary)' },
  { icon: Phone, label: 'Phone', value: '+1 (800) GS-SPORT', color: '#3b82f6' },
  { icon: MapPin, label: 'Address', value: '123 Athletic Ave, New York, NY 10001', color: '#10b981' },
  { icon: Clock, label: 'Support Hours', value: '24/7 Online Support', color: '#8b5cf6' },
];

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] pt-24">
        {/* Header */}
        <div className="relative py-16 overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(600px,90vw)] h-[min(300px,50vw)] rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)' }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-primary)' }}>
                Get In Touch
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Contact <span className="gradient-text">Us</span>
              </h1>
              <p className="text-white/40 text-lg">We&apos;re here to help. Reach out anytime.</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Let&apos;s connect</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  Have a question about an order, sizing, or just want to say hello? We&apos;d love to hear
                  from you.
                </p>
              </div>

              {contactInfo.map(({ icon: Icon, label, value, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-4 flex items-start gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm text-white/80 mt-0.5">{value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Chat CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-5"
                style={{ border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }}>
                    <MessageCircle size={18} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Live Chat</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/40">Average response time: under 2 minutes</p>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        placeholder="Your name"
                        className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Email</label>
                      <input
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      placeholder="Order inquiry, product question, etc."
                      className="w-full input-glass px-4 py-3 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      rows={6}
                      placeholder="Tell us how we can help..."
                      className="w-full input-glass px-4 py-3 rounded-xl text-sm resize-none"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
