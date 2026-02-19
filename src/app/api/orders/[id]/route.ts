import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { name: true, images: true, price: true } } } },
      },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Users can only view their own orders; admins can view any
    if (authUser.role !== 'ADMIN' && order.userId !== authUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const order = await prisma.order.update({ where: { id }, data: { status } });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
