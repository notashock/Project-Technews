import { NextResponse } from 'next/server';
import { verifyAdminPasscode, getSessionCookieHeader } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();

    if (!passcode || !verifyAdminPasscode(passcode)) {
      return NextResponse.json({ error: 'Invalid passcode PIN' }, { status: 401 });
    }

    const cookieHeader = getSessionCookieHeader();
    const response = NextResponse.json({ success: true });
    response.cookies.set(cookieHeader.name, cookieHeader.value, cookieHeader.options);
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
