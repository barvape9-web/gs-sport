import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

// GET /api/theme — public, returns the global site theme
export async function GET() {
  try {
    // Get the first (and only) site theme record, or create default
    let theme = await prisma.siteTheme.findFirst();

    if (!theme) {
      theme = await prisma.siteTheme.create({
        data: {
          primaryColor: '#f97316',
          secondaryColor: '#10b981',
          accentColor: '#8b5cf6',
          isDarkMode: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    console.error('Failed to fetch theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}

// PUT /api/theme — admin only, updates the global site theme
export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser || authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { primaryColor, secondaryColor, accentColor, isDarkMode } = body;

    // Find existing theme or create one
    let existing = await prisma.siteTheme.findFirst();

    let theme;
    if (existing) {
      theme = await prisma.siteTheme.update({
        where: { id: existing.id },
        data: {
          ...(primaryColor !== undefined && { primaryColor }),
          ...(secondaryColor !== undefined && { secondaryColor }),
          ...(accentColor !== undefined && { accentColor }),
          ...(isDarkMode !== undefined && { isDarkMode }),
        },
      });
    } else {
      theme = await prisma.siteTheme.create({
        data: {
          primaryColor: primaryColor || '#f97316',
          secondaryColor: secondaryColor || '#10b981',
          accentColor: accentColor || '#8b5cf6',
          isDarkMode: isDarkMode ?? true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: theme,
      message: 'Theme updated globally',
    });
  } catch (error) {
    console.error('Failed to update theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}
