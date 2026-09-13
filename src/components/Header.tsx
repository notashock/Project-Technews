'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { Radio, Sparkles, Globe, ShieldCheck, Flame } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand */}
        <Link href="/" className="brand-group">
          <div className="brand-logo-badge">
            <Flame size={22} />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-title">
              Prasad Tech Pulse
            </span>
            <span className="brand-tribute">
              Dedicated to Prasad Tech In Telugu
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            {t('Latest Digests', 'తాజా డైజెస్ట్‌లు')}
          </Link>
          <Link
            href="/episodes"
            className={`nav-link ${pathname.startsWith('/episodes') ? 'active' : ''}`}
          >
            {t('Episode Archive', 'ఎపిసోడ్ ఆర్కైవ్')}
          </Link>
          <Link
            href="/admin"
            className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ShieldCheck size={16} />
            {t('Curator Wizard', 'క్యురేటర్ విజార్డ్')}
          </Link>
        </nav>

        {/* Language Switcher Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={toggleLanguage}
            className="lang-switcher-btn"
            title="Switch Language / భాషను మార్చుకోండి"
            aria-label="Toggle language between English and Telugu"
          >
            <Globe size={15} />
            <span className={language === 'en' ? 'lang-pill-active' : ''}>EN</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span className={language === 'te' ? 'lang-pill-active' : ''}>తెలుగు</span>
          </button>
        </div>
      </div>
    </header>
  );
}
