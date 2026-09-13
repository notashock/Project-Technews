import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateBilingualDigest } from '@/lib/openrouter';
import { ParsedVideoMeta } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { episodeId, parsedMeta } = (await req.json()) as {
      episodeId: string;
      parsedMeta: ParsedVideoMeta;
    };

    if (!episodeId || !parsedMeta) {
      return NextResponse.json({ error: 'Missing episodeId or parsedMeta' }, { status: 400 });
    }

    const digestData = await generateBilingualDigest(parsedMeta);

    // Create unique slug
    const epNum = parsedMeta.episodeNumber || Math.floor(1800 + Math.random() * 60);
    const baseSlug = `tech-news-${epNum}-${parsedMeta.youtubeId.toLowerCase()}`;

    // Clean up any previous topics/digest for this episode
    await prisma.newsTopic.deleteMany({ where: { episodeId } });
    await prisma.episodeDigest.deleteMany({ where: { episodeId } });

    // Create digest
    const digest = await prisma.episodeDigest.create({
      data: {
        episodeId,
        slug: baseSlug,
        titleEn: digestData.titleEn,
        titleTe: digestData.titleTe,
        summaryEn: digestData.summaryEn,
        summaryTe: digestData.summaryTe,
        introEn: digestData.introEn,
        introTe: digestData.introTe,
        keyTakeawaysEn: JSON.stringify(digestData.keyTakeawaysEn),
        keyTakeawaysTe: JSON.stringify(digestData.keyTakeawaysTe),
        publicationState: 'Draft',
      },
    });

    // Create topics
    const createdTopics = [];
    for (const t of digestData.topics) {
      const topic = await prisma.newsTopic.create({
        data: {
          episodeId,
          timestamp: t.timestamp,
          seconds: t.seconds,
          titleEn: t.titleEn,
          titleTe: t.titleTe,
          summaryEn: t.summaryEn,
          summaryTe: t.summaryTe,
          category: t.category,
        },
      });
      createdTopics.push(topic);
    }

    // Update episode stage
    await prisma.episode.update({
      where: { id: episodeId },
      data: { generationStage: 'DigestReady' },
    });

    return NextResponse.json({
      success: true,
      digest,
      topics: createdTopics,
      suggestedIndices: digestData.suggestedDeepDiveIndices || [0, 1],
    });
  } catch (error: any) {
    console.error('Digest generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate digest' }, { status: 500 });
  }
}
