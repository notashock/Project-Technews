import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/db';
import PrasadHero from '@/components/PrasadHero';
import HomeClientView from '@/components/HomeClientView';

// Revalidate every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  let latestDigest = null;
  let recentDeepDives: any[] = [];
  let pastDigests: any[] = [];

  try {
    // Fetch latest published episode digest
    latestDigest = await prisma.episodeDigest.findFirst({
      where: { publicationState: 'Published' },
      include: {
        episode: {
          include: {
            topics: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch top published deep-dives
    recentDeepDives = await prisma.deepDiveArticle.findMany({
      where: { publicationState: 'Published' },
      include: {
        episode: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    // Fetch past digests
    pastDigests = await prisma.episodeDigest.findMany({
      where: { publicationState: 'Published' },
      include: {
        episode: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: 1,
      take: 4,
    });
  } catch (err) {
    console.warn('Database query during build/init, will render client fallback if empty:', err);
  }

  return (
    <div className="container">
      <PrasadHero latestEpisodeId={latestDigest?.slug} />
      <HomeClientView
        latestDigest={latestDigest}
        recentDeepDives={recentDeepDives}
        pastDigests={pastDigests}
      />
    </div>
  );
}
