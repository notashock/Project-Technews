import { describe, it, expect } from 'vitest';
import { generateBilingualDigest, generateDeepDiveArticle } from '@/lib/openrouter';
import { PRASAD_SAMPLE_EPISODES } from '@/lib/youtube';

describe('OpenRouter AI Generator Tests', () => {
  const sampleMeta = PRASAD_SAMPLE_EPISODES[0];

  it('synthesizes a valid bilingual episode digest', async () => {
    const digest = await generateBilingualDigest(sampleMeta);

    expect(digest).toBeDefined();
    expect(digest.titleEn).toBeTruthy();
    expect(digest.titleTe).toBeTruthy();
    expect(digest.summaryEn).toBeTruthy();
    expect(digest.summaryTe).toBeTruthy();
    expect(digest.introEn).toBeTruthy();
    expect(digest.introTe).toBeTruthy();

    expect(Array.isArray(digest.keyTakeawaysEn)).toBe(true);
    expect(digest.keyTakeawaysEn.length).toBeGreaterThanOrEqual(3);
    expect(Array.isArray(digest.keyTakeawaysTe)).toBe(true);
    expect(digest.keyTakeawaysTe.length).toBeGreaterThanOrEqual(3);

    expect(Array.isArray(digest.topics)).toBe(true);
    expect(digest.topics.length).toBe(sampleMeta.chapters.length);

    // Verify first topic has both language versions
    const firstTopic = digest.topics[0];
    expect(firstTopic.titleEn).toBeTruthy();
    expect(firstTopic.titleTe).toBeTruthy();
    expect(firstTopic.summaryEn).toBeTruthy();
    expect(firstTopic.summaryTe).toBeTruthy();
    expect(firstTopic.category).toBeTruthy();

    expect(Array.isArray(digest.suggestedDeepDiveIndices)).toBe(true);
    expect(digest.suggestedDeepDiveIndices.length).toBeGreaterThan(0);
  });

  it('synthesizes a structured deep-dive article with specifications table', async () => {
    const deepDive = await generateDeepDiveArticle(
      'Nothing Phone 3 Leaks & Snapdragon 8s Gen 4',
      'Nothing is launching its next generation flagship with redesigned glyph lighting.',
      sampleMeta.videoTitle,
      'Smartphones'
    );

    expect(deepDive).toBeDefined();
    expect(deepDive.titleEn).toContain('Nothing Phone 3');
    expect(deepDive.titleTe).toBeTruthy();
    expect(deepDive.contentEn).toContain('##');
    expect(deepDive.contentTe).toContain('##');
    expect(deepDive.category).toBe('Smartphones');
    expect(deepDive.readTimeMinutes).toBeGreaterThan(0);

    // Verify specs breakdown
    expect(deepDive.specsJson).toBeDefined();
    expect(typeof deepDive.specsJson).toBe('object');
    expect(Object.keys(deepDive.specsJson || {}).length).toBeGreaterThan(3);
  });
});
