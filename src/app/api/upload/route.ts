import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    /* ── Auth ──────────────────────────────────────────────── */
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    /* ── Parse multipart form data ────────────────────────── */
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file || !file.size) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    /* ── Validate type ────────────────────────────────────── */
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WebP.' },
        { status: 400 },
      );
    }

    /* ── Validate size ────────────────────────────────────── */
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB.' },
        { status: 400 },
      );
    }

    /* ── Convert to base64 data-URI ───────────────────────── */
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    /* ── Try Cloudinary if configured, otherwise use base64 ─ */
    const hasCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary) {
      const { cloudinary } = await import('@/lib/cloudinary');
      const result = await cloudinary.uploader.upload(base64, {
        folder: 'gs-sport/products',
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      });

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    }

    /* ── Fallback: return base64 data URI directly ────────── */
    return NextResponse.json({
      url: base64,
      publicId: null,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Image upload failed. Please try again.' }, { status: 500 });
  }
}
