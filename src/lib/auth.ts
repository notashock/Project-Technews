import { cookies } from 'next/headers';

const COOKIE_NAME = 'prasad_curator_session';

export function verifyAdminPasscode(inputPasscode: string): boolean {
  const configuredPasscode = process.env.ADMIN_SECRET || 'prasadtech2026';
  return inputPasscode.trim() === configuredPasscode.trim();
}

export async function isCuratorAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie) return false;
  return sessionCookie.value === 'authorized_curator';
}

export function getSessionCookieHeader(): { name: string; value: string; options: any } {
  return {
    name: COOKIE_NAME,
    value: 'authorized_curator',
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  };
}
