import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: Record<string, unknown> = {};
    if (gender && gender !== 'ALL') where.gender = gender;
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Record<string, string> = {};
    if (sort === 'newest') orderBy.createdAt = 'desc';
    else if (sort === 'price-asc' || sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price-desc' || sort === 'price_desc') orderBy.price = 'desc';
    else if (sort === 'popularity') orderBy.popularity = 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().default(''),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  images: z.array(z.string()).optional().default([]),
  category: z.enum(['UPPER_WEAR', 'LOWER_WEAR', 'WINTER_WEAR', 'SUMMER_WEAR', 'ACCESSORIES']),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX']),
  sizes: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  stock: z.number().int().min(0),
  isFeatured: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const data = productSchema.parse(body);

    const product = await prisma.product.create({ data });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? 'Validation error' }, { status: 400 });
    }
    console.error('Product POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
