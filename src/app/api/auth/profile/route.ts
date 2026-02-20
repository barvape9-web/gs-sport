import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest, signJWT } from '@/lib/auth';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  email: z.string().email('Invalid email').optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    // Check if email is already taken by another user
    if (email && email !== authUser.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== authUser.userId) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    // Re-sign JWT with updated info
    const token = await signJWT({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    });

    const response = NextResponse.json({ user: updatedUser });
    response.cookies.set('gs-sport-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
