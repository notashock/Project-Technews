import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ArticleClientView from '@/components/ArticleClientView';

interface PageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const article = await prisma.deepDiveArticle.findUnique({
    where: { slug: params.slug },
  });

  if (!article) {
    return { title: 'Article Not Found | Prasad Tech Pulse' };
  }

  return {
    title: `${article.titleEn} | Prasad Tech Pulse`,
    description: article.contentEn.slice(0, 160),
    openGraph: {
      title: article.titleEn,
      description: article.contentEn.slice(0, 160),
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await prisma.deepDiveArticle.findUnique({
    where: { slug: params.slug },
    include: {
      episode: {
        include: {
          digest: true,
        },
      },
      topic: true,
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <div className="container">
      <ArticleClientView article={article} />
    </div>
  );
}
