import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { episodeId, action = 'publish' } = (await req.json()) as {
      episodeId: string;
      action?: 'publish' | 'unpublish';
    };

    if (!episodeId) {
      return NextResponse.json({ error: 'Missing episodeId' }, { status: 400 });
    }

    const state = action === 'publish' ? 'Published' : 'Draft';
    const now = action === 'publish' ? new Date() : null;

    // Update digest
    await prisma.episodeDigest.updateMany({
      where: { episodeId },
      data: {
        publicationState: state,
        publishedAt: now,
      },
    });

    // Update deep-dive articles
    await prisma.deepDiveArticle.updateMany({
      where: { episodeId },
      data: {
        publicationState: state,
        publishedAt: now,
      },
    });

    // Update episode stage
    await prisma.episode.update({
      where: { id: episodeId },
      data: {
        generationStage: action === 'publish' ? 'Published' : 'DeepDivesReady',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Episode successfully marked as ${state}`,
    });
  } catch (error: any) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update publication state' }, { status: 500 });
  }
}
