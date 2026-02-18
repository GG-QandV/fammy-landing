import { NextRequest, NextResponse } from 'next/server';
import { getAnonIdFromCookieHeader } from '../../../../lib/anonId';

const BACKEND_URL = process.env.BACKEND_BASE_URL || 'https://api.fammy.pet';

/**
 * POST /api/promo/validate
 * Proxy to backend: POST /api/v1/billing/promo/validate
 */
export async function POST(request: NextRequest) {
  try {
    const { code, email } = await request.json();
    const cookieHeader = request.headers.get('cookie');
    const anonId = getAnonIdFromCookieHeader(cookieHeader);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!code || !anonId) {
      return NextResponse.json({ success: false, error: 'invalid' }, { status: 400 });
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/billing/promo/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
      },
      body: JSON.stringify({ code, anonId, email }),
    });

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('[PROMO] Proxy error:', error);
    return NextResponse.json({ success: false, error: 'invalid' }, { status: 500 });
  }
}
