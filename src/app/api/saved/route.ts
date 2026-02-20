import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

/* ── GET: list saved products for current user ─────────────── */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const saved = await prisma.savedProduct.findMany({
      where: { userId: authUser.userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      products: saved.map((s) => s.product),
      ids: saved.map((s) => s.productId),
    });
  } catch (error) {
    console.error('Saved GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/* ── POST: toggle save/unsave a product ────────────────────── */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    // Check if already saved
    const existing = await prisma.savedProduct.findUnique({
      where: { userId_productId: { userId: authUser.userId, productId } },
    });

    if (existing) {
      // Unsave
      await prisma.savedProduct.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false, message: 'Removed from saved items' });
    } else {
      // Save
      await prisma.savedProduct.create({
        data: { userId: authUser.userId, productId },
      });
      return NextResponse.json({ saved: true, message: 'Added to saved items' });
    }
  } catch (error) {
    console.error('Saved POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
