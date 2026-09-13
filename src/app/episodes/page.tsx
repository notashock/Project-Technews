import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/db';
import EpisodesClientView from '@/components/EpisodesClientView';

export const revalidate = 60;

export const metadata = {
  title: 'Episode Archive | Prasad Tech Pulse',
  description: 'Complete archive of Prasad Tech In Telugu daily tech news digests and episode summaries.',
};

export default async function EpisodesPage() {
  let episodes: any[] = [];
  try {
    episodes = await prisma.episode.findMany({
      where: {
        digest: {
          publicationState: 'Published',
        },
      },
      include: {
        digest: true,
        topics: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  } catch (err) {
    console.warn('Error fetching episodes archive:', err);
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <EpisodesClientView episodes={episodes} />
    </div>
  );
}
