import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { verifyAdminPasscode, getSessionCookieHeader } from '@/lib/auth';

describe('Auth Utilities Tests', () => {
  const originalSecret = process.env.ADMIN_SECRET;

  beforeEach(() => {
    process.env.ADMIN_SECRET = 'prasadtech2026';
  });

  afterEach(() => {
    process.env.ADMIN_SECRET = originalSecret;
  });

  it('validates correct admin passcode successfully', () => {
    expect(verifyAdminPasscode('prasadtech2026')).toBe(true);
    expect(verifyAdminPasscode('  prasadtech2026  ')).toBe(true);
  });

  it('rejects incorrect admin passcode', () => {
    expect(verifyAdminPasscode('wrongpassword')).toBe(false);
    expect(verifyAdminPasscode('')).toBe(false);
    expect(verifyAdminPasscode('123456')).toBe(false);
  });

  it('provides secure session cookie attributes', () => {
    const cookie = getSessionCookieHeader();
    expect(cookie.name).toBe('prasad_curator_session');
    expect(cookie.value).toBe('authorized_curator');
    expect(cookie.options.httpOnly).toBe(true);
    expect(cookie.options.sameSite).toBe('lax');
    expect(cookie.options.path).toBe('/');
    expect(cookie.options.maxAge).toBeGreaterThan(0);
  });
});
