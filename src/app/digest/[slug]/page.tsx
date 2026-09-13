import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import DigestClientView from '@/components/DigestClientView';

interface PageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const digest = await prisma.episodeDigest.findUnique({
    where: { slug: params.slug },
    include: { episode: true },
  });

  if (!digest) {
    return { title: 'Episode Not Found | Prasad Tech Pulse' };
  }

  return {
    title: `${digest.titleEn} | Prasad Tech Pulse`,
    description: digest.summaryEn,
    openGraph: {
      title: digest.titleEn,
      description: digest.summaryEn,
      images: [digest.episode.thumbnailUrl],
    },
  };
}

export default async function DigestPage({ params }: PageProps) {
  const digest = await prisma.episodeDigest.findUnique({
    where: { slug: params.slug },
    include: {
      episode: {
        include: {
          topics: {
            orderBy: { seconds: 'asc' },
          },
          deepDives: {
            where: { publicationState: 'Published' },
          },
        },
      },
    },
  });

  if (!digest) {
    notFound();
  }

  return (
    <div className="container">
      <DigestClientView digest={digest} />
    </div>
  );
}
