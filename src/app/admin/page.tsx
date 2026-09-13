'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  Youtube,
  Layers,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { PRASAD_SAMPLE_EPISODES } from '@/lib/youtube';
import { ParsedVideoMeta } from '@/lib/types';

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'wizard' | 'queue'>('wizard');

  // Wizard state: 1: Ingest, 2: Digest, 3: Deep-Dives, 4: Publish
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pipeline Data
  const [parsedMeta, setParsedMeta] = useState<ParsedVideoMeta | null>(null);
  const [currentEpisode, setCurrentEpisode] = useState<any | null>(null);
  const [generatedDigest, setGeneratedDigest] = useState<any | null>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [generatedArticles, setGeneratedArticles] = useState<any[]>([]);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Queue Data
  const [queueEpisodes, setQueueEpisodes] = useState<any[]>([]);

  // Check auth on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('curator_authenticated');
    if (saved === 'true') {
      setIsAuthenticated(true);
      fetchQueue();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('curator_authenticated', 'true');
        fetchQueue();
      } else {
        const data = await res.json();
        setAuthError(data.error || 'Invalid passcode PIN');
      }
    } catch {
      setAuthError('Failed to connect to authentication endpoint');
    }
  };

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/admin/queue');
      if (res.ok) {
        const data = await res.json();
        setQueueEpisodes(data.episodes || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // STEP 1: Ingest Video
  const handleIngest = async (urlToUse?: string) => {
    const url = urlToUse || videoUrl;
    if (!url) {
      setErrorMsg('Please enter a YouTube video URL or ID.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setParsedMeta(data.parsedMeta);
      setCurrentEpisode(data.episode);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to ingest video');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Generate Digest
  const handleGenerateDigest = async () => {
    if (!currentEpisode || !parsedMeta) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/generate-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: currentEpisode.id,
          parsedMeta,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGeneratedDigest(data.digest);
      setTopics(data.topics || []);

      // Pre-select recommended indices
      const suggested: number[] = data.suggestedIndices || [0, 1];
      const initialSelectedIds = suggested
        .map((idx) => data.topics[idx]?.id)
        .filter(Boolean);
      setSelectedTopicIds(initialSelectedIds.length > 0 ? initialSelectedIds : [data.topics[0]?.id]);

      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate digest');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Toggle Topic Selection & Generate Deep-Dives
  const toggleTopicSelection = (topicId: string) => {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const handleGenerateDeepDives = async () => {
    if (selectedTopicIds.length === 0) {
      setErrorMsg('Please select at least 1 topic to generate a deep-dive article.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/generate-deep-dives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: currentEpisode.id,
          selectedTopicIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setGeneratedArticles(data.articles || []);
      setStep(4);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate deep-dives');
    } finally {
      setLoading(false);
    }
  };

  // STEP 4: Publish to Live Site
  const handlePublish = async () => {
    if (!currentEpisode) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeId: currentEpisode.id,
          action: 'publish',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPublishSuccess(true);
      fetchQueue();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to publish episode');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (episodeId: string, currentAction: 'publish' | 'unpublish') => {
    try {
      await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episodeId, action: currentAction }),
      });
      fetchQueue();
    } catch (e) {
      console.error(e);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setVideoUrl('');
    setParsedMeta(null);
    setCurrentEpisode(null);
    setGeneratedDigest(null);
    setTopics([]);
    setSelectedTopicIds([]);
    setGeneratedArticles([]);
    setPublishSuccess(false);
    setErrorMsg('');
  };

  // PASSCODE LOGIN GATE
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ maxWidth: '440px', paddingTop: '6rem' }}>
        <div className="admin-card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Lock size={26} color="var(--accent-cyan)" />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Curator Admin Access
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Enter your secret admin passcode PIN to open the AI newsroom wizard.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <input
                type="password"
                placeholder="Enter Passcode PIN..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="input-field"
                style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.1rem' }}
                autoFocus
              />
            </div>

            {authError && (
              <p style={{ color: 'var(--accent-red)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="primary-btn"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <ShieldCheck size={16} />
              <span>Unlock Curator Wizard</span>
            </button>
          </form>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
            Default development PIN: <code>prasadtech2026</code>
          </p>
        </div>
      </div>
    );
  }

  // AUTHENTICATED CURATOR DASHBOARD
  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Top Bar */}
      <div className="admin-header">
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Editorial Workspace
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Flame size={24} color="var(--accent-cyan)" />
            Curator Newsroom Wizard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setActiveTab('wizard')}
            className={activeTab === 'wizard' ? 'primary-btn' : 'secondary-btn'}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            <Sparkles size={14} />
            <span>Generate New Episode</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('queue');
              fetchQueue();
            }}
            className={activeTab === 'queue' ? 'primary-btn' : 'secondary-btn'}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            <Layers size={14} />
            <span>Draft Queue ({queueEpisodes.length})</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--accent-red)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={18} color="var(--accent-red)" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: INTERACTIVE GENERATION WIZARD */}
      {activeTab === 'wizard' && (
        <div>
          {/* Step Progress Bar */}
          <div className="step-indicator-bar">
            <div className={`step-bubble ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-num">{step > 1 ? '✓' : '1'}</div>
              <span>1. Ingest Video</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
            <div className={`step-bubble ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-num">{step > 2 ? '✓' : '2'}</div>
              <span>2. Generate Digest</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
            <div className={`step-bubble ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-num">{step > 3 ? '✓' : '3'}</div>
              <span>3. Pick Deep-Dives</span>
            </div>
            <ChevronRight size={16} color="var(--text-muted)" />
            <div className={`step-bubble ${step >= 4 ? 'active' : ''}`}>
              <div className="step-num">{publishSuccess ? '✓' : '4'}</div>
              <span>4. Publish</span>
            </div>
          </div>

          {/* STEP 1: INGESTION */}
          {step === 1 && (
            <div className="admin-card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Step 1: Ingest Prasad Tech In Telugu Video
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Paste the URL of any daily tech news video. The system will parse chapter markers, title, and metadata.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="input-field"
                />
                <button
                  onClick={() => handleIngest()}
                  disabled={loading}
                  className="primary-btn"
                  style={{ flexShrink: 0 }}
                >
                  {loading ? <RefreshCw size={16} className="animate-spin" /> : <Youtube size={16} />}
                  <span>{loading ? 'Ingesting...' : 'Ingest & Parse'}</span>
                </button>
              </div>

              {/* Quick Sample Ingest Buttons */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem' }}>
                  Or quickly test with recent Prasad Tech In Telugu episodes:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {PRASAD_SAMPLE_EPISODES.map((ep) => (
                    <button
                      key={ep.youtubeId}
                      onClick={() => {
                        setVideoUrl(ep.videoUrl);
                        handleIngest(ep.videoUrl);
                      }}
                      className="secondary-btn"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                    >
                      <Sparkles size={13} color="var(--accent-amber)" />
                      <span>{ep.videoTitle.slice(0, 50)}...</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: METADATA PREVIEW & DIGEST GENERATION */}
          {step === 2 && parsedMeta && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Step 2: Video Metadata & Chapter Preview
                </h2>
                <button onClick={resetWizard} className="secondary-btn" style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem' }}>
                  Start Over
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
                <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '16/9' }}>
                  <img
                    src={parsedMeta.thumbnailUrl}
                    alt={parsedMeta.videoTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <span className="category-badge" style={{ marginBottom: '0.5rem' }}>
                    {parsedMeta.channelTitle}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {parsedMeta.videoTitle}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Found <strong>{parsedMeta.chapters.length}</strong> timestamped chapter topics.
                  </p>
                </div>
              </div>

              {/* Chapters List */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  Parsed Chapter Markers
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.5rem' }}>
                  {parsedMeta.chapters.map((chap, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span className="chapter-ts-pill">{chap.timestamp}</span>
                      <span style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {chap.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateDigest}
                disabled={loading}
                className="primary-btn"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                <span>{loading ? 'Synthesizing Bilingual Digest via OpenRouter...' : 'Generate Bilingual Episode Digest (EN & తెలుగు)'}</span>
              </button>
            </div>
          )}

          {/* STEP 3: PICK TOPICS FOR DEEP-DIVE EXPANSION */}
          {step === 3 && generatedDigest && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    Step 3: Hand-Pick Topics for Deep-Dive Articles
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Select 2-3 key stories from today’s episode to expand into full standalone journalism articles.
                  </p>
                </div>
                <span className="category-badge">
                  {selectedTopicIds.length} Selected
                </span>
              </div>

              {/* Topics Selection Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
                {topics.map((topic) => {
                  const isChecked = selectedTopicIds.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      onClick={() => toggleTopicSelection(topic.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '1rem',
                        background: isChecked ? 'rgba(6, 182, 212, 0.08)' : 'var(--bg-surface-elevated)',
                        border: isChecked ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ marginTop: '0.25rem', width: '18px', height: '18px', accentColor: 'var(--accent-cyan)' }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <span className="chapter-ts-pill">{topic.timestamp}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                            {topic.category}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                          {topic.titleEn}
                        </h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                          {topic.summaryEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleGenerateDeepDives}
                disabled={loading || selectedTopicIds.length === 0}
                className="primary-btn"
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <FileText size={18} />}
                <span>
                  {loading
                    ? `Generating ${selectedTopicIds.length} Deep-Dives via OpenRouter...`
                    : `Generate ${selectedTopicIds.length} Deep-Dive Articles`}
                </span>
              </button>
            </div>
          )}

          {/* STEP 4: REVIEW & PUBLISH */}
          {step === 4 && (
            <div className="admin-card">
              {publishSuccess ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <CheckCircle2 size={52} color="var(--accent-green)" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    Episode Successfully Published!
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.75rem' }}>
                    The daily episode digest and standalone deep-dive articles are now live for readers in English and Telugu.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    {generatedDigest && (
                      <Link href={`/digest/${generatedDigest.slug}`} className="primary-btn">
                        <span>View Live Episode Digest</span>
                        <ExternalLink size={16} />
                      </Link>
                    )}
                    <button onClick={resetWizard} className="secondary-btn">
                      Ingest Another Video
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        Step 4: Final Editorial Review & Publish
                      </h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Package is assembled in the Draft Queue. Review the generated stories before going live.
                      </p>
                    </div>
                    <span className="category-badge">Draft Ready</span>
                  </div>

                  {/* Summary Box */}
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {generatedDigest?.titleEn}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      {generatedDigest?.summaryEn}
                    </p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                      + {generatedArticles.length} Standalone Deep-Dive Articles Generated
                    </div>
                  </div>

                  {/* Generated Articles preview list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {generatedArticles.map((art) => (
                      <div
                        key={art.id}
                        style={{
                          padding: '0.875rem 1.25rem',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                          {art.category} • {art.readTimeMinutes} min read
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0.2rem 0' }}>
                          {art.titleEn}
                        </h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Telugu: {art.titleTe}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={handlePublish}
                      disabled={loading}
                      className="primary-btn"
                      style={{ flexGrow: 1, padding: '0.85rem', justifyContent: 'center' }}
                    >
                      {loading ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                      <span>{loading ? 'Publishing...' : 'Publish Episode & Articles to Live Website'}</span>
                    </button>
                    <button onClick={resetWizard} className="secondary-btn">
                      Keep in Draft Queue
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DRAFT QUEUE & MANAGEMENT */}
      {activeTab === 'queue' && (
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Draft Queue & Published Episodes
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Oversee all ingested episodes, edit visibility, and monitor AI generation states.
              </p>
            </div>
            <button onClick={fetchQueue} className="secondary-btn" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              <RefreshCw size={13} />
              <span>Refresh</span>
            </button>
          </div>

          {queueEpisodes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No episodes in queue. Use the wizard to generate your first episode.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {queueEpisodes.map((ep) => {
                const isPublished = ep.digest?.publicationState === 'Published';
                return (
                  <div
                    key={ep.id}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      padding: '1.25rem',
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '80px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={ep.thumbnailUrl}
                          alt={ep.videoTitle}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span
                            style={{
                              padding: '0.15rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: isPublished ? 'var(--accent-green)' : 'var(--accent-amber)',
                              border: isPublished ? '1px solid var(--accent-green)' : '1px solid var(--accent-amber)',
                            }}
                          >
                            {isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Stage: {ep.generationStage}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                          {ep.videoTitle}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {ep.topics?.length || 0} topics • {ep.deepDives?.length || 0} deep-dives
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {ep.digest && (
                        <Link
                          href={`/digest/${ep.digest.slug}`}
                          className="secondary-btn"
                          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                        >
                          <ExternalLink size={13} />
                          <span>View</span>
                        </Link>
                      )}

                      <button
                        onClick={() => handleTogglePublish(ep.id, isPublished ? 'unpublish' : 'publish')}
                        className={isPublished ? 'secondary-btn' : 'primary-btn'}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                      >
                        {isPublished ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
