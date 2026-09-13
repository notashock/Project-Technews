'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { FolderOpen, Search, Calendar, Layers, ArrowRight } from 'lucide-react';

export default function EpisodesClientView({ episodes }: { episodes: any[] }) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState('');

  const filtered = episodes.filter((ep) => {
    const q = query.toLowerCase();
    const title = language === 'te' ? ep.digest?.titleTe : ep.digest?.titleEn;
    const epNum = ep.episodeNumber ? String(ep.episodeNumber) : '';
    return (
      (title && title.toLowerCase().includes(q)) ||
      ep.videoTitle.toLowerCase().includes(q) ||
      epNum.includes(q)
    );
  });

  return (
    <div>
      <div className="section-header" style={{ marginTop: 0 }}>
        <div>
          <h1 className="section-title">
            <FolderOpen size={24} color="var(--accent-cyan)" />
            {t('Tech News Episode Archive', 'టెక్ న్యూస్ ఎపిసోడ్ల సమాహారం')}
          </h1>
          <p className="section-subtitle">
            {t(
              'Browse through historical tech updates and daily briefings by Prasad Tech In Telugu',
              'ప్రసాద్ టెక్ ఇన్ తెలుగు గత ఎపిసోడ్‌ల సమగ్ర రికార్డు'
            )}
          </p>
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder={t('Search episodes or #...', 'శోధించండి...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '2.5rem', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {t('No matching episodes found.', 'ఎటువంటి ఎపిసోడ్‌లు కనిపించలేదు.')}
          </p>
        </div>
      ) : (
        <div className="article-grid">
          {filtered.map((ep) => {
            const title = language === 'te' ? ep.digest?.titleTe : ep.digest?.titleEn;
            const summary = language === 'te' ? ep.digest?.summaryTe : ep.digest?.summaryEn;

            return (
              <div key={ep.id} className="digest-card">
                <div className="digest-card-thumb-wrap">
                  <img
                    src={ep.thumbnailUrl}
                    alt={ep.videoTitle}
                    className="digest-card-thumb"
                  />
                  <div className="digest-badge-ep">
                    Ep #{ep.episodeNumber || 'Digest'}
                  </div>
                </div>

                <div className="digest-card-body">
                  <div className="digest-card-meta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={13} />
                      {new Date(ep.publishedAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{ep.topics?.length || 0} {t('Topics', 'విషయాలు')}</span>
                  </div>

                  <h3 className="digest-card-title">
                    <Link href={`/digest/${ep.digest?.slug || ep.id}`}>
                      {title || ep.videoTitle}
                    </Link>
                  </h3>

                  <p className="digest-card-desc">{summary}</p>

                  <div className="digest-card-footer">
                    <Link href={`/digest/${ep.digest?.slug || ep.id}`} className="read-more-btn">
                      <span>{t('View Digest', 'డైజెస్ట్ చూడండి')}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
