'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import {
  Calendar,
  Clock,
  Play,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  BookOpen,
  Share2,
} from 'lucide-react';

interface DigestClientViewProps {
  digest: any;
}

export default function DigestClientView({ digest }: DigestClientViewProps) {
  const { language, t } = useLanguage();
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const title = language === 'te' ? digest.titleTe : digest.titleEn;
  const summary = language === 'te' ? digest.summaryTe : digest.summaryEn;
  const intro = language === 'te' ? digest.introTe : digest.introEn;

  let takeaways: string[] = [];
  try {
    takeaways = JSON.parse(
      language === 'te' ? digest.keyTakeawaysTe : digest.keyTakeawaysEn
    );
  } catch {
    takeaways = [];
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ paddingTop: '2rem' }}>
      {/* Header Breadcrumb & Meta */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <Link href="/" style={{ color: 'var(--accent-cyan)' }}>Home</Link>
          <span>/</span>
          <Link href="/episodes" style={{ color: 'var(--accent-cyan)' }}>Episodes</Link>
          <span>/</span>
          <span>Episode #{digest.episode.episodeNumber || 'Digest'}</span>
        </div>

        <h1 className="article-title">{title}</h1>

        <div className="article-meta-row">
          <div className="article-meta-left">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} />
              {new Date(digest.episode.publishedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span>•</span>
            <span>{digest.episode.channelTitle}</span>
            <span>•</span>
            <span className="category-badge">{digest.episode.topics?.length || 0} {t('Topics', 'అంశాలు')}</span>
          </div>

          <button onClick={handleShare} className="secondary-btn" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
            <Share2 size={14} />
            <span>{copied ? t('Link Copied!', 'కాపీ చేయబడింది!') : t('Share Digest', 'షేర్ చేయండి')}</span>
          </button>
        </div>
      </div>

      {/* Embedded Video & Chapters Section */}
      <div className="digest-video-section">
        {/* YouTube Video Player with start offset */}
        <div className="video-player-container">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${digest.episode.youtubeId}?start=${currentSeconds}&autoplay=${currentSeconds > 0 ? 1 : 0}`}
            title={digest.episode.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Interactive Chapters Jump Sidebar */}
        <div className="chapters-sidebar">
          <div className="chapters-sidebar-header">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={16} color="var(--accent-cyan)" />
              {t('Video Chapters', 'వీడియో చాప్టర్లు')}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {t('Click timestamp to jump', 'సమయం పై క్లిక్ చేయండి')}
            </span>
          </div>

          <div className="chapters-list">
            {digest.episode.topics?.map((topic: any) => {
              const topicTitle = language === 'te' ? topic.titleTe : topic.titleEn;
              const isActive = currentSeconds === topic.seconds;

              return (
                <button
                  key={topic.id}
                  onClick={() => setCurrentSeconds(topic.seconds)}
                  className="chapter-jump-btn"
                  style={{
                    border: isActive ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                    background: isActive ? 'var(--bg-surface-elevated)' : 'transparent',
                  }}
                >
                  <span className="chapter-ts-pill">{topic.timestamp}</span>
                  <span className="chapter-jump-title">{topicTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Takeaways Card */}
      {takeaways.length > 0 && (
        <div className="takeaways-card">
          <h3 className="takeaways-title">
            <CheckCircle2 size={18} />
            {t("Today's Top Highlights", 'నేటి ప్రధాన ముఖ్యాంశాలు')}
          </h3>
          <div className="takeaways-grid">
            {takeaways.map((item, idx) => (
              <div key={idx} className="takeaway-item">
                <div className="takeaway-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overview / Intro Section */}
      <div style={{ maxWidth: '820px', margin: '0 auto 3.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {t('Episode Overview', 'ఎపిసోడ్ సమీక్ష')}
        </h2>
        <blockquote style={{ borderLeft: '3px solid var(--accent-cyan)', padding: '0.85rem 1.25rem', background: 'var(--bg-surface)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', color: '#94a3b8', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          {intro}
        </blockquote>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#cbd5e1' }}>{summary}</p>
      </div>

      {/* Segment by Segment Breakdown Cards */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
          <Layers size={22} color="var(--accent-cyan)" />
          {t('All Covered Tech News Stories', 'కవర్ చేయబడిన అన్ని టెక్ వార్తలు')}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {digest.episode.topics?.map((topic: any, idx: number) => {
            const topicTitle = language === 'te' ? topic.titleTe : topic.titleEn;
            const topicSummary = language === 'te' ? topic.summaryTe : topic.summaryEn;

            return (
              <div
                key={topic.id}
                className="digest-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      setCurrentSeconds(topic.seconds);
                      window.scrollTo({ top: 150, behavior: 'smooth' });
                    }}
                    className="primary-btn"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                    title={t('Play in video player', 'వీడియోలో చూడండి')}
                  >
                    <Play size={12} fill="#090d16" />
                    <span>{topic.timestamp}</span>
                  </button>
                  <span className="category-badge" style={{ fontSize: '0.7rem' }}>
                    {topic.category}
                  </span>
                </div>

                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {topicTitle}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {topicSummary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Linked Deep-Dive Articles */}
      {digest.episode.deepDives?.length > 0 && (
        <div style={{ marginBottom: '4rem', padding: '2rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            <BookOpen size={22} color="var(--accent-amber)" />
            {t('Deep-Dive Articles Generated from this Episode', 'ఈ ఎపిసోడ్ పై ప్రత్యేక కథనాలు')}
          </h2>

          <div className="article-grid">
            {digest.episode.deepDives.map((article: any) => {
              const artTitle = language === 'te' ? article.titleTe : article.titleEn;
              return (
                <div key={article.id} className="digest-card" style={{ background: 'var(--bg-surface-elevated)' }}>
                  <div className="digest-card-body">
                    <span className="category-badge" style={{ alignSelf: 'flex-start', marginBottom: '0.75rem' }}>
                      {article.category}
                    </span>
                    <h3 className="digest-card-title">
                      <Link href={`/article/${article.slug}`}>{artTitle}</Link>
                    </h3>
                    <div className="digest-card-footer">
                      <Link href={`/article/${article.slug}`} className="read-more-btn">
                        <span>{t('Read Full Analysis', 'పూర్తి విశ్లేషణ')}</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
