import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { generateDeepDiveArticle } from '@/lib/openrouter';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: Request) {
  try {
    const { episodeId, selectedTopicIds } = (await req.json()) as {
      episodeId: string;
      selectedTopicIds: string[];
    };

    if (!episodeId || !selectedTopicIds || selectedTopicIds.length === 0) {
      return NextResponse.json({ error: 'Please select at least one topic for deep-dive expansion.' }, { status: 400 });
    }

    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (!episode) {
      return NextResponse.json({ error: 'Episode not found' }, { status: 404 });
    }

    const topics = await prisma.newsTopic.findMany({
      where: {
        id: { in: selectedTopicIds },
        episodeId,
      },
    });

    const createdArticles = [];

    for (const topic of topics) {
      // Mark topic as selected
      await prisma.newsTopic.update({
        where: { id: topic.id },
        data: { isSelectedForDeepDive: true },
      });

      // Call AI generation
      const deepDiveData = await generateDeepDiveArticle(
        topic.titleEn,
        topic.summaryEn,
        episode.videoTitle,
        topic.category
      );

      const baseSlug = `${slugify(topic.titleEn).slice(0, 45)}-${episode.youtubeId.slice(0, 6).toLowerCase()}`;

      // Upsert deep dive article
      const article = await prisma.deepDiveArticle.create({
        data: {
          episodeId,
          topicId: topic.id,
          slug: baseSlug,
          titleEn: deepDiveData.titleEn,
          titleTe: deepDiveData.titleTe,
          contentEn: deepDiveData.contentEn,
          contentTe: deepDiveData.contentTe,
          specsJson: deepDiveData.specsJson ? JSON.stringify(deepDiveData.specsJson) : null,
          category: deepDiveData.category || topic.category,
          readTimeMinutes: deepDiveData.readTimeMinutes || 4,
          coverImage: episode.thumbnailUrl,
          publicationState: 'Draft',
        },
      });

      createdArticles.push(article);
    }

    // Update episode generation stage
    await prisma.episode.update({
      where: { id: episodeId },
      data: { generationStage: 'DeepDivesReady' },
    });

    return NextResponse.json({
      success: true,
      articles: createdArticles,
    });
  } catch (error: any) {
    console.error('Deep-dive generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate deep-dives' }, { status: 500 });
  }
}
