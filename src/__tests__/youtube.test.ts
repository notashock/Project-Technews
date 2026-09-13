import { describe, it, expect } from 'vitest';
import {
  timestampToSeconds,
  extractYouTubeId,
  parseEpisodeNumber,
  parseChaptersFromText,
} from '@/lib/youtube';

describe('YouTube Utility Tests', () => {
  describe('timestampToSeconds', () => {
    it('converts MM:SS format accurately', () => {
      expect(timestampToSeconds('00:00')).toBe(0);
      expect(timestampToSeconds('00:42')).toBe(42);
      expect(timestampToSeconds('02:15')).toBe(135);
      expect(timestampToSeconds('10:05')).toBe(605);
    });

    it('converts HH:MM:SS format accurately', () => {
      expect(timestampToSeconds('01:05:20')).toBe(3920);
      expect(timestampToSeconds('02:00:00')).toBe(7200);
    });

    it('handles whitespace gracefully', () => {
      expect(timestampToSeconds('  03:30  ')).toBe(210);
    });
  });

  describe('extractYouTubeId', () => {
    it('extracts ID from standard watch URL', () => {
      expect(extractYouTubeId('https://www.youtube.com/watch?v=Wz3A9kZf4d8')).toBe('Wz3A9kZf4d8');
    });

    it('extracts ID from shortened youtu.be URL', () => {
      expect(extractYouTubeId('https://youtu.be/Wz3A9kZf4d8')).toBe('Wz3A9kZf4d8');
    });

    it('extracts ID from embed URL', () => {
      expect(extractYouTubeId('https://www.youtube.com/embed/Wz3A9kZf4d8')).toBe('Wz3A9kZf4d8');
    });

    it('extracts ID from shorts URL', () => {
      expect(extractYouTubeId('https://www.youtube.com/shorts/Wz3A9kZf4d8')).toBe('Wz3A9kZf4d8');
    });

    it('returns clean ID if plain ID passed', () => {
      expect(extractYouTubeId('Wz3A9kZf4d8')).toBe('Wz3A9kZf4d8');
    });

    it('returns null for invalid URLs', () => {
      expect(extractYouTubeId('https://example.com/not-youtube')).toBeNull();
      expect(extractYouTubeId('')).toBeNull();
    });
  });

  describe('parseEpisodeNumber', () => {
    it('extracts episode number from hashtag format', () => {
      expect(parseEpisodeNumber('Tech News # 1852 - Nothing Phone 3')).toBe(1852);
      expect(parseEpisodeNumber('Tech News #1850')).toBe(1850);
    });

    it('extracts episode number from plain text format', () => {
      expect(parseEpisodeNumber('Tech News 1851 Flagship Reviews')).toBe(1851);
    });

    it('returns undefined if no episode number is present', () => {
      expect(parseEpisodeNumber('Unboxing New Smartphone')).toBeUndefined();
    });
  });

  describe('parseChaptersFromText', () => {
    it('extracts chapters from formatted description text', () => {
      const description = `
Namaskaram friends! Today in tech news:
00:00 - Intro & Welcome
00:45 - Nothing Phone 3 Leaks
02:15 - Realme 14 Pro Launch Date
05:30 - Jio 5G Revisions
      `;

      const chapters = parseChaptersFromText(description);
      expect(chapters).toHaveLength(4);
      expect(chapters[0]).toEqual({ timestamp: '00:00', seconds: 0, title: 'Intro & Welcome' });
      expect(chapters[1]).toEqual({ timestamp: '00:45', seconds: 45, title: 'Nothing Phone 3 Leaks' });
      expect(chapters[2]).toEqual({ timestamp: '02:15', seconds: 135, title: 'Realme 14 Pro Launch Date' });
      expect(chapters[3]).toEqual({ timestamp: '05:30', seconds: 330, title: 'Jio 5G Revisions' });
    });

    it('ignores lines without timestamps', () => {
      const text = 'Just random comments\nNo time here\nSubscribe to the channel';
      expect(parseChaptersFromText(text)).toHaveLength(0);
    });
  });
});
