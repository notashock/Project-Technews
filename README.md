# Prasad Tech Pulse ⚡

> **Dedicated to Prasad Tech In Telugu** — India's premier Telugu tech channel.
> Daily tech news synthesized into structured bilingual (English & Telugu) episode digests and deep-dive articles powered by OpenRouter Gen AI.

---

## Key Features

- **Daily Episode Digests**: Comprehensive coverage of every tech story mentioned in Prasad's daily video, organized with timestamps, category tags, and key takeaways.
- **Bilingual Dual-Language (EN / తెలుగు)**: Seamless reader toggle between English tech reporting and authentic Telugu script (తెలుగు లిపి).
- **Interactive YouTube Sync**: Click any chapter timestamp to instantly jump the video player to that exact moment.
- **Standalone Deep-Dive Articles**: Expanded long-form journalism for the top 2-3 biggest stories of each episode, complete with technical specification tables and Prasad's candid value-for-money verdict.
- **Curator Admin Newsroom Wizard**:
  1. **Ingest**: Paste any YouTube video URL or select from Prasad's recent episodes.
  2. **Digest Generation**: Automated extraction of chapter markers and OpenRouter prompt generation.
  3. **Topic Selection**: Hand-pick which stories warrant full-length deep-dive articles.
  4. **Publish**: Review drafts and publish live with one click.
- **Review-First Draft Queue**: Quality control ensuring only verified and curator-approved content goes public.
- **Minimalist Sleek Aesthetic**: Studio-inspired cyber-slate dark mode with electric cyan and warm Prasad amber accents.

---

## Architecture & Technology Stack

- **Framework**: Next.js 14 (App Router, Server-Side Rendering for SEO, TypeScript)
- **Database**: SQLite with Prisma ORM (ready for Turso / Supabase in production)
- **Styling**: Vanilla CSS design system (Inter + Noto Sans Telugu typography)
- **AI Synthesis**: OpenRouter API (`google/gemini-2.0-flash-001` default, configurable via `.env`)
- **Security**: Passcode PIN authentication for the Curator Wizard

See [docs/adr/](docs/adr/) for detailed Architectural Decision Records:
- `0001-metadata-and-chapter-extraction.md`
- `0002-bilingual-content-delivery.md`
- `0003-review-first-publishing-queue.md`
- `0004-nextjs-fullstack-architecture.md`
- `0005-interactive-generation-wizard.md`
- `0006-minimalist-creator-design.md`
- `0007-passcode-curator-auth.md`
- `0008-vercel-serverless-deployment.md`

---

## Quickstart

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
OPENROUTER_API_KEY="your_openrouter_api_key_here"
OPENROUTER_MODEL="google/gemini-2.0-flash-001"
ADMIN_SECRET="prasadtech2026"
DATABASE_URL="file:./dev.db"
```

### 2. Install & Seed Database
```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the live news portal, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the Curator Wizard (default PIN: `prasadtech2026`).
