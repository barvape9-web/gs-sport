'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, User, MessageSquare, ShieldCheck, Sparkles, Lock, ThumbsUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Review } from '@/types';
import { useTranslation } from '@/lib/useTranslation';

interface ReviewSectionProps {
  productId: string;
}

const ratingLabels: Record<number, string> = { 1: '😞', 2: '😐', 3: '🙂', 4: '😊', 5: '🤩' };

function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { t } = useTranslation();

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`/api/reviews?productId=${productId}`);
      setReviews(res.data.reviews || []);
      setAverageRating(res.data.averageRating || 0);
      setTotalReviews(res.data.totalReviews || 0);
      setCanReview(res.data.canReview || false);
      setHasReviewed(res.data.hasReviewed || false);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error(t('reviews.selectRating'));
      return;
    }
    if (comment.trim().length < 3) {
      toast.error(t('reviews.commentTooShort'));
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post('/api/reviews', { productId, rating, comment: comment.trim() });
      toast.success(res.data.message || t('reviews.submitted'));
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err) ? err.response?.data?.error : '';
      toast.error(msg || t('reviews.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { star, count, pct: totalReviews > 0 ? (count / totalReviews) * 100 : 0 };
  });

  const activeRating = hoverRating || rating;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
      className="mt-16 sm:mt-20"
    >
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, #000))',
            boxShadow: '0 4px 20px color-mix(in srgb, var(--color-primary) 30%, transparent)',
          }}
        >
          <MessageSquare size={18} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {t('reviews.title')}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {totalReviews} {t('reviews.reviewsCount')}
          </p>
        </div>
      </div>

      {/* ── Rating Summary + Form Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-10">

        {/* ── Left: Rating Overview ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden rounded-2xl p-6"
          style={{
            background: 'linear-gradient(160deg, color-mix(in srgb, var(--color-primary) 8%, var(--card-bg)), var(--card-bg))',
            border: '1px solid color-mix(in srgb, var(--color-primary) 15%, var(--card-border))',
          }}
        >
          {/* Decorative glow circle */}
          <div
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: 'var(--color-primary)' }}
          />

          <div className="relative z-10 text-center mb-5">
            <motion.div
              key={averageRating}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl sm:text-6xl font-black leading-none"
              style={{
                background: averageRating > 0
                  ? 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #fff))'
                  : 'var(--text-muted)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
            </motion.div>

            <div className="flex justify-center gap-1 mt-3 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  style={
                    s <= Math.round(averageRating)
                      ? { fill: 'var(--color-primary)', color: 'var(--color-primary)', filter: 'drop-shadow(0 0 3px color-mix(in srgb, var(--color-primary) 50%, transparent))' }
                      : { color: 'var(--border-subtle)' }
                  }
                />
              ))}
            </div>
          </div>

          {/* Distribution */}
          <div className="relative z-10 space-y-2.5">
            {ratingDistribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 w-9 justify-end">
                  <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{star}</span>
                  <Star size={10} style={{ fill: 'var(--color-primary)', color: 'var(--color-primary)' }} />
                </div>
                <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, var(--bg-inset))' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.15 + star * 0.05, ease: 'easeOut' as const }}
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, #fff))',
                    }}
                  />
                </div>
                <span className="w-6 text-right text-[11px] font-semibold tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Review Form / Status ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 relative overflow-hidden rounded-2xl"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
          }}
        >
          {canReview && !hasReviewed ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={14} style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                  {t('reviews.writeReview')}
                </h3>
              </div>

              {/* Star selector */}
              <div className="mb-5">
                <p className="text-[11px] font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                  {t('reviews.yourRating')}
                </p>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      whileHover={{ scale: 1.25, y: -2 }}
                      whileTap={{ scale: 0.85 }}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="p-1 rounded-lg transition-colors"
                      style={{
                        backgroundColor: s <= activeRating
                          ? 'color-mix(in srgb, var(--color-primary) 12%, transparent)'
                          : 'transparent',
                      }}
                    >
                      <Star
                        size={26}
                        style={
                          s <= activeRating
                            ? {
                                fill: 'var(--color-primary)',
                                color: 'var(--color-primary)',
                                filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--color-primary) 50%, transparent))',
                                transition: 'all 0.15s',
                              }
                            : { color: 'var(--border-subtle)', transition: 'all 0.15s' }
                        }
                      />
                    </motion.button>
                  ))}
                  <AnimatePresence mode="wait">
                    {activeRating > 0 && (
                      <motion.span
                        key={activeRating}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 5 }}
                        className="text-lg ml-2"
                      >
                        {ratingLabels[activeRating]}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Textarea */}
              <div className="mb-5">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('reviews.commentPlaceholder')}
                  rows={4}
                  maxLength={1000}
                  className="w-full rounded-xl p-4 text-sm resize-none transition-all duration-200 focus:outline-none"
                  style={{
                    color: 'var(--input-text)',
                    backgroundColor: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    boxShadow: 'inset 0 2px 4px color-mix(in srgb, #000 5%, transparent)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 50%, var(--input-border))';
                    e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent), inset 0 2px 4px color-mix(in srgb, #000 5%, transparent)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--input-border)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px color-mix(in srgb, #000 5%, transparent)';
                  }}
                />
                <div className="flex justify-between items-center mt-1.5 px-1">
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {comment.length < 3 && comment.length > 0 ? `${3 - comment.length} more characters needed` : ''}
                  </span>
                  <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {comment.length}/1000
                  </span>
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                disabled={submitting || rating === 0}
                className="px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2.5 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                style={{
                  background: rating > 0
                    ? 'linear-gradient(135deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 75%, #000))'
                    : 'var(--border-subtle)',
                  boxShadow: rating > 0
                    ? '0 4px 20px color-mix(in srgb, var(--color-primary) 35%, transparent)'
                    : 'none',
                }}
              >
                <Send size={14} />
                {submitting ? t('reviews.submitting') : t('reviews.submit')}
              </motion.button>
            </form>
          ) : hasReviewed ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, transparent), color-mix(in srgb, var(--color-primary) 5%, transparent))',
                  border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                }}
              >
                <ThumbsUp size={22} style={{ color: 'var(--color-primary)' }} />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {t('reviews.alreadyReviewed')}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Thank you for your feedback!
              </p>
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: 'color-mix(in srgb, var(--border-subtle) 60%, transparent)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <Lock size={20} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
                {t('reviews.purchaseRequired')}
              </p>
              <p className="text-[11px] max-w-[260px]" style={{ color: 'var(--text-muted)' }}>
                {t('reviews.noReviews')}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Reviews List ── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl h-32 shimmer"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl py-16 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, color-mix(in srgb, var(--color-primary) 3%, var(--card-bg)), var(--card-bg))',
            border: '1px dashed color-mix(in srgb, var(--color-primary) 20%, var(--card-border))',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)',
            }}
          >
            <MessageSquare size={24} style={{ color: 'var(--color-primary)', opacity: 0.6 }} />
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            {t('reviews.noReviews')}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, ease: 'easeOut' as const }}
                className="group rounded-2xl p-5 sm:p-6 transition-all duration-300"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-primary) 20%, var(--card-border))';
                  e.currentTarget.style.boxShadow = '0 4px 24px color-mix(in srgb, var(--color-primary) 6%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--card-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 20%, transparent), color-mix(in srgb, var(--color-primary) 8%, transparent))',
                      border: '1px solid color-mix(in srgb, var(--color-primary) 15%, transparent)',
                    }}
                  >
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} style={{ color: 'var(--color-primary)' }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-sm font-bold block" style={{ color: 'var(--text-primary)' }}>
                          {review.user?.name || 'User'}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                style={
                                  s <= review.rating
                                    ? { fill: 'var(--color-primary)', color: 'var(--color-primary)' }
                                    : { color: 'var(--border-subtle)' }
                                }
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                            color: 'var(--color-primary)',
                          }}>
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-medium flex-shrink-0 px-2 py-1 rounded-lg"
                        style={{ backgroundColor: 'var(--bg-inset)', color: 'var(--text-muted)' }}
                      >
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {review.comment}
                    </p>

                    {/* Verified badge */}
                    <div className="flex items-center gap-1.5 mt-3">
                      <ShieldCheck size={12} style={{ color: 'var(--color-primary)' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
}

export default memo(ReviewSection);
