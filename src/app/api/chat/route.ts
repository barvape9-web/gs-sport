import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { getAuthUserFromRequest } from '@/lib/auth';

// GET /api/chat — Get user's conversations or all (admin)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = authUser.role === 'ADMIN';

    const conversations = await prisma.chatConversation.findMany({
      where: isAdmin ? {} : { userId: authUser.userId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Add unread count for each conversation
    const withUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await prisma.chatMessage.count({
          where: {
            conversationId: conv.id,
            isRead: false,
            isAdmin: isAdmin ? false : true, // unread messages from the other side
          },
        });
        return { ...conv, unreadCount };
      })
    );

    return NextResponse.json(withUnread);
  } catch (error) {
    console.error('Chat GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const createConversationSchema = z.object({
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
});

// POST /api/chat — Create new conversation with first message
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message } = createConversationSchema.parse(body);

    const conversation = await prisma.chatConversation.create({
      data: {
        userId: authUser.userId,
        subject,
        messages: {
          create: {
            senderId: authUser.userId,
            content: message,
            isAdmin: authUser.role === 'ADMIN',
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        messages: {
          include: { sender: { select: { id: true, name: true, role: true } } },
        },
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Chat POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
