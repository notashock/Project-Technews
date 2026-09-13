'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Youtube, ArrowRight, Zap, Award } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function PrasadHero({ latestEpisodeId }: { latestEpisodeId?: string }) {
  const { t, language } = useLanguage();

  return (
    <section className="hero-tribute-section">
      <div className="hero-tribute-card">
        {/* Creator tribute badge */}
        <div className="hero-creator-badge">
          <Award size={15} />
          <span>
            {t(
              'Honoring Prasad Tech In Telugu • Daily Tech News Digest',
              'ప్రసాద్ టెక్ ఇన్ తెలుగు ప్రత్యేక నివాళి • డైలీ టెక్ న్యూస్'
            )}
          </span>
        </div>

        {/* Signature Prasad Greeting */}
        <h1 className="hero-title">
          {language === 'te' ? (
            <>
              నమస్కారం! <span className="hero-title-highlight">తెలుగు టెక్ వీక్షకులకు</span> స్వాగతం.
            </>
          ) : (
            <>
              Namaskaram! <span className="hero-title-highlight">Daily Tech News</span> Curated & Decoded.
            </>
          )}
        </h1>

        <p className="hero-description">
          {t(
            'Every day, Prasad Tech In Telugu reviews the biggest technology news, gadget launches, and processor showdowns. We harness Gen AI to synthesize each video into structured bilingual episode digests and deep-dive articles with real Indian pricing and honest perspectives.',
            'ప్రతిరోజూ ప్రసాద్ టెక్ ఇన్ తెలుగు అందించే తాజా టెక్నాలజీ విశేషాలు, మొబైల్ లాంచ్‌లు మరియు ప్రాసెసర్ అప్‌డేట్స్‌ను Gen AI సహాయంతో సమగ్రమైన తెలుగు మరియు ఇంగ్లీష్ కథనాలుగా అందిస్తున్నాము.'
          )}
        </p>

        {/* Action Button & Channel Link */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          {latestEpisodeId && (
            <Link href={`/digest/${latestEpisodeId}`} className="primary-btn">
              <Zap size={16} />
              <span>{t("Read Today's Episode Digest", 'నేటి ఎపిసోడ్ డైజెస్ట్ చదవండి')}</span>
              <ArrowRight size={16} />
            </Link>
          )}
          <a
            href="https://www.youtube.com/@Prasadtechintelugu"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-btn"
          >
            <Youtube size={17} color="#ef4444" />
            <span>{t('Subscribe to Prasad Tech', 'యూట్యూబ్‌లో సబ్‌స్క్రైబ్ చేయండి')}</span>
          </a>
        </div>

        {/* Stats Row */}
        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <span className="hero-stat-val">4.1M+</span>
            <span className="hero-stat-lbl">{t('Telugu Tech Subscribers', 'యూట్యూబ్ సబ్‌స్క్రైబర్లు')}</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-val">1,850+</span>
            <span className="hero-stat-lbl">{t('Tech News Episodes', 'టెక్ న్యూస్ ఎపిసోడ్లు')}</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-val">Bilingual</span>
            <span className="hero-stat-lbl">{t('English & Telugu Syntheses', 'ఇంగ్లీష్ & తెలుగు కథనాలు')}</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-val">OpenRouter</span>
            <span className="hero-stat-lbl">{t('AI-Powered Newsroom', 'AI న్యూస్‌రూమ్ ఇంజిన్')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
