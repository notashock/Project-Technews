import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const episodes = await prisma.episode.findMany({
      include: {
        digest: true,
        topics: true,
        deepDives: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      episodes,
    });
  } catch (error: any) {
    console.error('Queue error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch queue' }, { status: 500 });
  }
}
