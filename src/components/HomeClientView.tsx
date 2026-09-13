'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  Tv,
  CheckCircle2,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';

interface HomeClientViewProps {
  latestDigest: any;
  recentDeepDives: any[];
  pastDigests: any[];
}

export default function HomeClientView({
  latestDigest,
  recentDeepDives,
  pastDigests,
}: HomeClientViewProps) {
  const { language, t } = useLanguage();

  // Parse takeaways safely
  let takeaways: string[] = [];
  if (latestDigest) {
    try {
      takeaways = JSON.parse(
        language === 'te'
          ? latestDigest.keyTakeawaysTe
          : latestDigest.keyTakeawaysEn
      );
    } catch {
      takeaways = [];
    }
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* 1. FEATURED LATEST EPISODE DIGEST */}
      {latestDigest ? (
        <section style={{ marginBottom: '3.5rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <Tv size={22} color="var(--accent-cyan)" />
                {t("Latest Episode Digest", 'తాజా ఎపిసోడ్ డైజెస్ట్')}
              </h2>
              <p className="section-subtitle">
                {t(
                  'Comprehensive breakdown of today’s tech news coverage by Prasad',
                  'నేటి ఎపిసోడ్‌లో ప్రసాద్ చర్చించిన ముఖ్యమైన అంశాల సమాహారం'
                )}
              </p>
            </div>
          </div>

          <div className="digest-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0' }}>
            <div className="digest-card-thumb-wrap" style={{ minHeight: '260px' }}>
              <img
                src={latestDigest.episode.thumbnailUrl}
                alt={latestDigest.titleEn}
                className="digest-card-thumb"
              />
              <div className="digest-badge-ep">
                {latestDigest.episode.episodeNumber
                  ? `Episode #${latestDigest.episode.episodeNumber}`
                  : 'Latest'}
              </div>
            </div>

            <div className="digest-card-body" style={{ padding: '2rem' }}>
              <div className="digest-card-meta">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} />
                  {new Date(latestDigest.episode.publishedAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{latestDigest.episode.topics?.length || 0} {t('Topics Covered', 'విషయాలు')}</span>
              </div>

              <h3 className="digest-card-title" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                <Link href={`/digest/${latestDigest.slug}`}>
                  {language === 'te' ? latestDigest.titleTe : latestDigest.titleEn}
                </Link>
              </h3>

              <p className="digest-card-desc" style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {language === 'te' ? latestDigest.summaryTe : latestDigest.summaryEn}
              </p>

              {/* Key Takeaways Preview */}
              {takeaways.length > 0 && (
                <div style={{ marginBottom: '1.5rem', background: 'var(--bg-surface-elevated)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                    {t('Key Highlights', 'ప్రధానాంశాలు')}
                  </span>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {takeaways.slice(0, 3).map((item, idx) => (
                      <li key={idx} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <CheckCircle2 size={14} color="var(--accent-cyan)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="digest-card-footer" style={{ marginTop: 'auto' }}>
                <Link href={`/digest/${latestDigest.slug}`} className="primary-btn" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
                  <span>{t('Explore Full Episode Digest', 'పూర్తి డైజెస్ట్ చదవండి')}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Sparkles size={36} color="var(--accent-cyan)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            {t('No Published Digests Yet', 'ఇంకా ఎటువంటి డైజెస్ట్‌లు ప్రచురించబడలేదు')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            {t(
              'Use the Curator Wizard to ingest your first Prasad Tech In Telugu video, generate bilingual AI articles, and publish them.',
              'క్యురేటర్ విజార్డ్ ఉపయోగించి మొదటి ఎపిసోడ్‌ను ప్రాసెస్ చేయండి.'
            )}
          </p>
          <Link href="/admin" className="primary-btn">
            {t('Open Curator Wizard', 'క్యురేటర్ విజార్డ్ తెరవండి')}
          </Link>
        </div>
      )}

      {/* 2. DEEP-DIVE ARTICLES GRID */}
      {recentDeepDives.length > 0 && (
        <section style={{ marginBottom: '3.5rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <TrendingUp size={22} color="var(--accent-amber)" />
                {t('Deep-Dive Tech Articles', 'వివరణాత్మక టెక్ కథనాలు')}
              </h2>
              <p className="section-subtitle">
                {t(
                  'Expanded journalism on the biggest tech stories hand-picked from the videos',
                  'ఎపిసోడ్స్ నుండి ఎంపిక చేసిన ప్రధాన కథనాల సమగ్ర విశ్లేషణ'
                )}
              </p>
            </div>
          </div>

          <div className="article-grid">
            {recentDeepDives.map((article) => {
              const title = language === 'te' ? article.titleTe : article.titleEn;
              const content = language === 'te' ? article.contentTe : article.contentEn;
              const excerpt = content ? content.replace(/^[#\*\-\s]+/gm, '').slice(0, 140) + '...' : '';

              return (
                <div key={article.id} className="digest-card">
                  {article.coverImage && (
                    <div className="digest-card-thumb-wrap" style={{ aspectRatio: '16/9' }}>
                      <img
                        src={article.coverImage}
                        alt={title}
                        className="digest-card-thumb"
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          left: '0.75rem',
                        }}
                      >
                        <span className="category-badge">{article.category}</span>
                      </div>
                    </div>
                  )}

                  <div className="digest-card-body">
                    <div className="digest-card-meta">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={13} />
                        {article.readTimeMinutes} {t('min read', 'నిమిషాల రీడ్')}
                      </span>
                      {article.episode?.episodeNumber && (
                        <>
                          <span>•</span>
                          <span>Ep #{article.episode.episodeNumber}</span>
                        </>
                      )}
                    </div>

                    <h3 className="digest-card-title">
                      <Link href={`/article/${article.slug}`}>{title}</Link>
                    </h3>

                    <p className="digest-card-desc">{excerpt}</p>

                    <div className="digest-card-footer">
                      <Link href={`/article/${article.slug}`} className="read-more-btn">
                        <span>{t('Read Full Story', 'కథనం చదవండి')}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. PAST EPISODES ARCHIVE PREVIEW */}
      {pastDigests.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">
                <FolderOpen size={22} color="var(--accent-cyan)" />
                {t('Past Episode Digests', 'గత ఎపిసోడ్ల సమాహారం')}
              </h2>
            </div>
            <Link href="/episodes" className="read-more-btn" style={{ fontSize: '0.9rem' }}>
              <span>{t('View All Archives', 'అన్ని చూడండి')}</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="article-grid">
            {pastDigests.map((digest) => (
              <div key={digest.id} className="digest-card">
                <div className="digest-card-thumb-wrap" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={digest.episode.thumbnailUrl}
                    alt={digest.titleEn}
                    className="digest-card-thumb"
                  />
                  <div className="digest-badge-ep">
                    Ep #{digest.episode.episodeNumber || 'News'}
                  </div>
                </div>
                <div className="digest-card-body">
                  <div className="digest-card-meta">
                    <span>{new Date(digest.episode.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="digest-card-title" style={{ fontSize: '1.05rem' }}>
                    <Link href={`/digest/${digest.slug}`}>
                      {language === 'te' ? digest.titleTe : digest.titleEn}
                    </Link>
                  </h3>
                  <div className="digest-card-footer">
                    <Link href={`/digest/${digest.slug}`} className="read-more-btn">
                      <span>{t('View Digest', 'డైజెస్ట్ చూడండి')}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
