import { NextRequest, NextResponse } from 'next/server';
import { PromoDOT } from '@/lib/promoDOT';
import { getAnonIdFromCookieHeader } from '@/lib/anonId';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const F1_DAILY_LIMIT_DEFAULT = 5;
const F2_DAILY_LIMIT_DEFAULT = 10;

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
                f1: { used: 0, limit: F1_DAILY_LIMIT_DEFAULT, remaining: F1_DAILY_LIMIT_DEFAULT },
                f2: { used: 0, limit: F2_DAILY_LIMIT_DEFAULT, remaining: F2_DAILY_LIMIT_DEFAULT },
            });
        }

        // Use DOT layer for promo limits
        const promoResult = await PromoDOT.getActiveLimit(anonId, F1_DAILY_LIMIT_DEFAULT);
        const f1Limit = promoResult.dailyLimit;
        const f2Limit = promoResult.isActive ? f1Limit : F2_DAILY_LIMIT_DEFAULT;

        if (promoResult.isActive) {
            console.log(`[usage] DOT Promo applied: ${f1Limit}`);
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
                limit: f1Limit,
                remaining: Math.max(0, f1Limit - f1Used),
            },
            f2: {
                used: f2Used,
                limit: f2Limit,
                remaining: Math.max(0, f2Limit - f2Used),
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
