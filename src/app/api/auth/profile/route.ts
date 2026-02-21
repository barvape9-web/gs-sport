import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest, signJWT } from '@/lib/auth';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  email: z.string().email('Invalid email').optional(),
  avatar: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    let name: string | undefined;
    let email: string | undefined;
    let avatar: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      // Handle avatar upload via form data
      const formData = await request.formData();
      name = formData.get('name') as string | undefined || undefined;
      email = formData.get('email') as string | undefined || undefined;
      const file = formData.get('avatar') as File | null;

      if (file && file.size > 0) {
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        if (!ALLOWED_TYPES.includes(file.type)) {
          return NextResponse.json(
            { error: 'Invalid file type. Allowed: JPG, PNG, WebP.' },
            { status: 400 }
          );
        }
        if (file.size > MAX_SIZE) {
          return NextResponse.json(
            { error: 'File too large. Maximum size is 5 MB.' },
            { status: 400 }
          );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const hasCloudinary =
          process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET;

        if (hasCloudinary) {
          const { cloudinary } = await import('@/lib/cloudinary');
          const result = await cloudinary.uploader.upload(base64, {
            folder: 'gs-sport/avatars',
            resource_type: 'image',
            transformation: [
              { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'auto' },
            ],
          });
          avatar = result.secure_url;
        } else {
          avatar = base64;
        }
      }
    } else {
      // Handle JSON body
      const body = await request.json();
      const parsed = updateSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0].message },
          { status: 400 }
        );
      }
      name = parsed.data.name;
      email = parsed.data.email;
      avatar = parsed.data.avatar;
    }

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
        ...(avatar !== undefined && { avatar }),
      },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true, updatedAt: true },
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
