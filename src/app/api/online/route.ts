import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const ONLINE_THRESHOLD_MS = 60_000; // 60 seconds — sessions older than this are "offline"

const heartbeatSchema = z.object({
  sessionId: z.string().min(1).max(100),
});

// POST /api/online — Register heartbeat & return online count
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = heartbeatSchema.parse(body);

    const now = new Date();
    const cutoff = new Date(now.getTime() - ONLINE_THRESHOLD_MS);

    // Upsert this session's heartbeat
    await prisma.activeSession.upsert({
      where: { id: sessionId },
      update: { lastSeen: now },
      create: { id: sessionId, lastSeen: now },
    });

    // Clean up stale sessions (older than 5 minutes) to keep table small
    await prisma.activeSession.deleteMany({
      where: { lastSeen: { lt: new Date(now.getTime() - 5 * 60_000) } },
    });

    // Count currently online (seen within threshold)
    const count = await prisma.activeSession.count({
      where: { lastSeen: { gte: cutoff } },
    });

    return NextResponse.json({ count });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
    }
    console.error('Online POST error:', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}

// GET /api/online — Just return online count (no heartbeat)
export async function GET() {
  try {
    const cutoff = new Date(Date.now() - ONLINE_THRESHOLD_MS);
    const count = await prisma.activeSession.count({
      where: { lastSeen: { gte: cutoff } },
    });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
