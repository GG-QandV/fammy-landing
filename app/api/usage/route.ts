import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { getAnonIdFromCookieHeader } from '../../../lib/anonId';

const F1_DAILY_LIMIT = 5;
const F2_DAILY_LIMIT = 10;

/**
 * GET /api/usage
 * Returns current usage counts for the anon user (last 24h).
 * Used to display remaining checks on page load.
 */
export async function GET(request: NextRequest) {
    try {
        const cookieHeader = request.headers.get('cookie');
        const anonId = getAnonIdFromCookieHeader(cookieHeader);
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        if (!anonId) {
            // No anon_id yet — return defaults (full limits)
            return NextResponse.json({
                f1: { used: 0, limit: F1_DAILY_LIMIT, remaining: F1_DAILY_LIMIT },
                f2: { used: 0, limit: F2_DAILY_LIMIT, remaining: F2_DAILY_LIMIT },
            });
        }

        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
        const since = twentyFourHoursAgo.toISOString();

        // Query F1 and F2 usage in parallel
        const [f1Result, f2Result] = await Promise.all([
            (supabaseAdmin as any)
                .from('landing_f1_usage_events')
                .select('*', { count: 'exact', head: true })
                .or(`anon_id.eq.${anonId},ip_address.eq.${ip}`)
                .gte('created_at', since),
            (supabaseAdmin as any)
                .from('landing_f2_usage_events')
                .select('*', { count: 'exact', head: true })
                .or(`anon_id.eq.${anonId},ip_address.eq.${ip}`)
                .gte('created_at', since),
        ]);

        const f1Used = f1Result.count ?? 0;
        const f2Used = f2Result.count ?? 0;

        return NextResponse.json({
            f1: {
                used: f1Used,
                limit: F1_DAILY_LIMIT,
                remaining: Math.max(0, F1_DAILY_LIMIT - f1Used),
            },
            f2: {
                used: f2Used,
                limit: F2_DAILY_LIMIT,
                remaining: Math.max(0, F2_DAILY_LIMIT - f2Used),
            },
        });
    } catch (error) {
        console.error('[usage] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get usage' },
            { status: 500 }
        );
    }
}
