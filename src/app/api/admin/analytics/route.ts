import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '30');
    const since = new Date(Date.now() - period * 24 * 60 * 60 * 1000);

    const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: since } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: since }, status: { not: 'CANCELLED' } },
        _sum: { total: true },
      }),
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      prisma.product.count(),
      prisma.order.findMany({
        where: { createdAt: { gte: since } },
        select: { total: true, createdAt: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Group orders by day for chart
    const dailyRevenue: Record<string, { revenue: number; orders: number }> = {};
    recentOrders.forEach((order: { total: number; createdAt: Date; status: string }) => {
      const day = order.createdAt.toISOString().split('T')[0];
      if (!dailyRevenue[day]) dailyRevenue[day] = { revenue: 0, orders: 0 };
      if (order.status !== 'CANCELLED') dailyRevenue[day].revenue += order.total;
      dailyRevenue[day].orders += 1;
    });

    const revenueChartData = Object.entries(dailyRevenue).map(([date, data]) => ({
      date,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders,
    }));

    // Order status breakdown
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      where: { createdAt: { gte: since } },
      _count: { status: true },
    });

    const orderStatusData = statusCounts.map((s: { status: string; _count: { status: number } }) => ({
      name: s.status,
      value: s._count.status,
    }));

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue: Math.round((totalRevenue._sum.total || 0) * 100) / 100,
        totalUsers,
        totalProducts,
      },
      revenueChartData,
      orderStatusData,
    });
  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
