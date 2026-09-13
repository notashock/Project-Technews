'use client';

import React from 'react';
import Link from 'next/link';
import { Youtube, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-tribute-box">
          <div>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {t(
                'Built for the fans of Prasad Tech In Telugu',
                'ప్రసాద్ టెక్ ఇన్ తెలుగు అభిమానుల కోసం రూపొందించబడింది'
              )}
            </p>
            <p style={{ fontSize: '0.8rem' }}>
              {t(
                'Automated daily AI synthesis powered by OpenRouter. Curated with love.',
                'ఓపెన్‌రౌటర్ AI సాంకేతికతతో రూపొందించబడిన డైలీ టెక్ సమ్మరీలు.'
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a
            href="https://www.youtube.com/@Prasadtechintelugu"
            target="_blank"
            rel="noopener noreferrer"
            className="creator-yt-link"
          >
            <Youtube size={18} />
            <span>Prasad Tech In Telugu on YouTube</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
