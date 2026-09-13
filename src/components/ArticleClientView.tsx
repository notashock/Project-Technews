'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Tv,
  Cpu,
  BookmarkCheck,
  Check,
} from 'lucide-react';

interface ArticleClientViewProps {
  article: any;
}

// Simple markdown renderer for clean editorial presentation
function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`}>
          {listItems.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index}>{trimmed.replace('## ', '')}</h2>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={index}>{trimmed.replace('# ', '')}</h2>
      );
    } else if (trimmed.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={index}>{trimmed.replace('> ', '')}</blockquote>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ''));
    } else if (trimmed.length > 0) {
      flushList();
      elements.push(
        <p key={index} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList();
  return elements;
}

export default function ArticleClientView({ article }: ArticleClientViewProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const title = language === 'te' ? article.titleTe : article.titleEn;
  const content = language === 'te' ? article.contentTe : article.contentEn;

  let specs: Record<string, string> = {};
  if (article.specsJson) {
    try {
      specs = JSON.parse(article.specsJson);
    } catch {
      specs = {};
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header & Breadcrumb */}
      <div className="article-header">
        <div className="article-breadcrumb">
          <Link href="/" style={{ color: 'var(--accent-cyan)' }}>Home</Link>
          <span>/</span>
          {article.episode?.digest ? (
            <Link href={`/digest/${article.episode.digest.slug}`} style={{ color: 'var(--accent-cyan)' }}>
              Episode #{article.episode.episodeNumber || 'Digest'}
            </Link>
          ) : (
            <span>Deep Dive</span>
          )}
          <span>/</span>
          <span>{article.category}</span>
        </div>

        <h1 className="article-title">{title}</h1>

        <div className="article-meta-row">
          <div className="article-meta-left">
            <span className="category-badge">{article.category}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              {article.readTimeMinutes} {t('min read', 'నిమిషాల రీడ్')}
            </span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} />
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Recent'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button onClick={handleShare} className="secondary-btn" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              {copied ? <Check size={14} color="var(--accent-green)" /> : <Share2 size={14} />}
              <span>{copied ? t('Copied', 'కాపీ చేయబడింది') : t('Share', 'షేర్')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cover Image if present */}
      {article.coverImage && (
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto 2.5rem',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            aspectRatio: '21 / 9',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <img
            src={article.coverImage}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Main Editorial Body */}
      <div className="article-content-body">
        {renderMarkdown(content)}

        {/* Specifications Breakdown Table */}
        {Object.keys(specs).length > 0 && (
          <div className="specs-table-card">
            <div className="specs-table-title">
              <Cpu size={18} color="var(--accent-cyan)" />
              <span>{t('Key Technical Specifications', 'ప్రధాన సాంకేతిక వివరాలు')}</span>
            </div>
            <table className="specs-table">
              <tbody>
                {Object.entries(specs).map(([key, val]) => (
                  <tr key={key}>
                    <td className="specs-table-key">{key}</td>
                    <td className="specs-table-val">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Creator Attribution & Parent Episode Card */}
        {article.episode?.digest && (
          <div
            style={{
              marginTop: '3.5rem',
              padding: '1.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>
                {t('Source Episode', 'మూల ఎపిసోడ్')}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {article.episode.videoTitle}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t('Reported in Prasad Tech In Telugu daily tech news', 'ప్రసాద్ టెక్ ఇన్ తెలుగు డైలీ టెక్ న్యూస్ లో ప్రసారం చేయబడింది')}
              </p>
            </div>

            <Link
              href={`/digest/${article.episode.digest.slug}`}
              className="primary-btn"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <Tv size={15} />
              <span>{t('View Full Episode Digest', 'పూర్తి డైజెస్ట్ చూడండి')}</span>
            </Link>
          </div>
        )}

        {/* Back link */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <Link href="/" className="read-more-btn" style={{ fontSize: '0.95rem' }}>
            <ArrowLeft size={16} />
            <span>{t('Back to All News', 'అన్ని వార్తలకు తిరిగి వెళ్లండి')}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
