import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchYouTubeVideoMeta } from '@/lib/youtube';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'A valid YouTube URL or video ID is required.' }, { status: 400 });
    }

    const meta = await fetchYouTubeVideoMeta(url);

    // Upsert episode
    const episode = await prisma.episode.upsert({
      where: { youtubeId: meta.youtubeId },
      update: {
        videoTitle: meta.videoTitle,
        videoUrl: meta.videoUrl,
        thumbnailUrl: meta.thumbnailUrl,
        episodeNumber: meta.episodeNumber,
      },
      create: {
        youtubeId: meta.youtubeId,
        videoTitle: meta.videoTitle,
        videoUrl: meta.videoUrl,
        thumbnailUrl: meta.thumbnailUrl,
        publishedAt: new Date(meta.publishedAt),
        channelTitle: meta.channelTitle,
        episodeNumber: meta.episodeNumber,
        generationStage: 'Ingested',
      },
      include: {
        digest: true,
        topics: true,
      },
    });

    return NextResponse.json({
      success: true,
      episode,
      parsedMeta: meta,
    });
  } catch (error: any) {
    console.error('Ingest error:', error);
    return NextResponse.json({ error: error.message || 'Failed to ingest video' }, { status: 500 });
  }
}
