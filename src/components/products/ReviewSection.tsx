'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, User, MessageSquare, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Review } from '@/types';
import { useTranslation } from '@/lib/useTranslation';

interface ReviewSectionProps {
  productId: string;
}

function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
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
      const res = await axios.post('/api/reviews', {
        productId,
        rating,
        comment: comment.trim(),
      });
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
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => r.rating === star).length / totalReviews) * 100 : 0,
  }));

  return (
    <section className="mt-12 sm:mt-16">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare size={20} style={{ color: 'var(--color-primary)' }} />
        <h2 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          {t('reviews.title')}
        </h2>
        {totalReviews > 0 && (
          <span className="text-sm font-medium px-2.5 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', color: 'var(--color-primary)' }}>
            {totalReviews}
          </span>
        )}
      </div>

      {/* Rating summary + form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Rating summary */}
        <div className="glass-card p-5 sm:p-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
              {averageRating > 0 ? averageRating.toFixed(1) : '—'}
            </div>
            <div className="flex justify-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  style={
                    star <= Math.round(averageRating)
                      ? { fill: 'var(--color-primary)', color: 'var(--color-primary)' }
                      : { color: 'var(--border-subtle)' }
                  }
                />
              ))}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {totalReviews} {t('reviews.reviewsCount')}
            </p>
          </div>

          {/* Rating distribution bars */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3 font-bold" style={{ color: 'var(--text-muted)' }}>{star}</span>
                <Star size={10} style={{ fill: 'var(--color-primary)', color: 'var(--color-primary)' }} />
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-inset)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  />
                </div>
                <span className="w-5 text-right" style={{ color: 'var(--text-muted)' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review form */}
        <div className="lg:col-span-2 glass-card p-5 sm:p-6">
          {canReview && !hasReviewed ? (
            <form onSubmit={handleSubmit}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-secondary)' }}>
                {t('reviews.writeReview')}
              </h3>

              {/* Star rating selector */}
              <div className="mb-4">
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{t('reviews.yourRating')}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        size={24}
                        style={
                          star <= (hoverRating || rating)
                            ? { fill: 'var(--color-primary)', color: 'var(--color-primary)', transition: 'all 0.15s' }
                            : { color: 'var(--border-subtle)', transition: 'all 0.15s' }
                        }
                      />
                    </motion.button>
                  ))}
                  {rating > 0 && (
                    <span className="text-xs self-center ml-2" style={{ color: 'var(--text-muted)' }}>
                      {rating}/5
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('reviews.commentPlaceholder')}
                  rows={3}
                  maxLength={1000}
                  className="w-full input-glass rounded-xl p-3 text-sm resize-none"
                  style={{ color: 'var(--input-text)', backgroundColor: 'var(--input-bg)', border: '1px solid var(--input-border)' }}
                />
                <div className="text-right text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {comment.length}/1000
                </div>
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.95 }}
                disabled={submitting}
                className="btn-primary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 text-white disabled:opacity-50"
              >
                <Send size={14} />
                {submitting ? t('reviews.submitting') : t('reviews.submit')}
              </motion.button>
            </form>
          ) : hasReviewed ? (
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
              <p>{t('reviews.alreadyReviewed')}</p>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <ShieldCheck size={18} />
              <p>{t('reviews.purchaseRequired')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 shimmer rounded-xl h-28" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <MessageSquare size={32} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{t('reviews.noReviews')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                        {review.user?.name || 'User'}
                      </span>
                      <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          style={
                            star <= review.rating
                              ? { fill: 'var(--color-primary)', color: 'var(--color-primary)' }
                              : { color: 'var(--border-subtle)' }
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {review.comment}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

export default memo(ReviewSection);
