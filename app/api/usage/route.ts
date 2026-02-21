import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { getAnonIdFromCookieHeader } from '../../../lib/anonId';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SECRET = new TextEncoder().encode(JWT_SECRET);

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

        // Check for promo token in headers
        const promoToken = request.headers.get('x-promo-token');
        let f1Limit = F1_DAILY_LIMIT_DEFAULT;
        let f2Limit = F2_DAILY_LIMIT_DEFAULT;

        if (promoToken) {
            try {
                const { payload } = await jwtVerify(promoToken, SECRET);
                if (payload.userId === anonId && payload.limit) {
                    // If promo has a global limit or features, we adjust. 
                    // For now, let's assume the promo 'limit' applies to both or use features.
                    const promoLimit = payload.limit as number;
                    f1Limit = promoLimit;
                    f2Limit = promoLimit;
                    console.log(`[usage] Promo active for ${anonId}, new limits: ${promoLimit}`);
                }
            } catch (e) {
                console.warn('[usage] Invalid promo token');
            }
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
