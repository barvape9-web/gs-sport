import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

// GET /api/reviews?productId=xxx — get all reviews for a product
export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Check if the current user has purchased this product (for write eligibility)
    let canReview = false;
    let hasReviewed = false;
    try {
      const authUser = await getAuthUserFromRequest(request);
      if (authUser) {
        // Check if user has a delivered order containing this product
        const purchasedOrder = await prisma.orderItem.findFirst({
          where: {
            productId,
            order: {
              userId: authUser.userId,
              status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING', 'PENDING'] },
            },
          },
        });
        canReview = !!purchasedOrder;

        // Check if user already reviewed
        const existingReview = await prisma.review.findUnique({
          where: { userId_productId: { userId: authUser.userId, productId } },
        });
        hasReviewed = !!existingReview;
      }
    } catch {
      // Not logged in — that's fine
    }

    // Calculate average rating
    const avg =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      reviews,
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: reviews.length,
      canReview,
      hasReviewed,
    });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
});

// POST /api/reviews — create a review (must have purchased the product)
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, rating, comment } = reviewSchema.parse(body);

    // Check if user purchased this product
    const purchasedOrder = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: authUser.userId,
          status: { in: ['DELIVERED', 'SHIPPED', 'PROCESSING', 'PENDING'] },
        },
      },
    });

    if (!purchasedOrder) {
      return NextResponse.json(
        { error: 'You can only review products you have purchased' },
        { status: 403 }
      );
    }

    // Check if already reviewed
    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId: authUser.userId, productId } },
    });

    if (existing) {
      // Update existing review
      const updated = await prisma.review.update({
        where: { id: existing.id },
        data: { rating, comment },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      });
      return NextResponse.json({ review: updated, message: 'Review updated' });
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        userId: authUser.userId,
        productId,
        rating,
        comment,
      },
      include: { user: { select: { id: true, name: true, avatar: true } } },
    });

    return NextResponse.json({ review, message: 'Review created' }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Validation error' }, { status: 400 });
    }
    console.error('Reviews POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
