export type GenerationStage = 'Ingested' | 'DigestReady' | 'DeepDivesReady' | 'Published';
export type PublicationState = 'Draft' | 'Published';
export type LanguageMode = 'en' | 'te';

export interface ChapterItem {
  timestamp: string; // "01:23"
  seconds: number;
  title: string;
}

export interface ParsedVideoMeta {
  youtubeId: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
  channelTitle: string;
  description: string;
  chapters: ChapterItem[];
  episodeNumber?: number;
}

export interface GeneratedTopic {
  timestamp: string;
  seconds: number;
  titleEn: string;
  titleTe: string;
  summaryEn: string;
  summaryTe: string;
  category: string;
}

export interface GeneratedDigest {
  titleEn: string;
  titleTe: string;
  summaryEn: string;
  summaryTe: string;
  introEn: string;
  introTe: string;
  keyTakeawaysEn: string[];
  keyTakeawaysTe: string[];
  topics: GeneratedTopic[];
  suggestedDeepDiveIndices: number[]; // e.g. [0, 2, 5]
}

export interface GeneratedDeepDive {
  titleEn: string;
  titleTe: string;
  contentEn: string;
  contentTe: string;
  specsJson?: Record<string, string>;
  category: string;
  readTimeMinutes: number;
}
