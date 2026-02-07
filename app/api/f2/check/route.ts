import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { checkFood } from '../../../../lib/backendApi';
import { getAnonIdFromCookieHeader } from '../../../../lib/anonId';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SECRET = new TextEncoder().encode(JWT_SECRET);

interface CheckRequest {
    lang?: string;
    target: 'dog' | 'cat' | 'human';
    foodId: string;
}

/**
 * POST /api/f2/check
 * F2 check with gate logic (3 checks per 24h for non-authenticated users)
 */
export async function POST(request: NextRequest) {
    try {
        const body: CheckRequest = await request.json();
        const { target, foodId, lang = 'en' } = body;

        if (!target || !foodId) {
            return NextResponse.json(
                { error: 'Missing target or foodId' },
                { status: 400 }
            );
        }

        // Get anon_id from cookie
        const cookieHeader = request.headers.get('cookie');
        const anonId = getAnonIdFromCookieHeader(cookieHeader);

        // Get client IP address
        const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

        if (!anonId) {
            return NextResponse.json(
                { error: 'Missing anon_id cookie' },
                { status: 400 }
            );
        }

        // Check if user has unlimited entitlement
        const { data: entitlement } = await (supabaseAdmin
            .from('landing_f2_entitlements' as any)
            .select('is_unlimited')
            .or(`auth_user_id.eq.${anonId},email.eq.${anonId}`)
            .eq('is_unlimited', true)
            .single() as any);

        // Check for promo token in headers
        const promoToken = request.headers.get('x-promo-token');
        let currentLimit = 10;
        let isPromoActive = false;

        if (promoToken) {
            try {
                const { payload } = await jwtVerify(promoToken, SECRET);
                if (payload.userId === anonId && payload.limit) {
                    currentLimit = payload.limit as number;
                    isPromoActive = true;
                    console.log(`[LANDING] Promo active for ${anonId}, limit: ${currentLimit}`);
                }
            } catch (e) {
                console.warn('[LANDING] Invalid promo token provided');
            }
        }

        // If no entitlement, check usage count by BOTH anon_id and IP
        if (!entitlement) {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            // Using .or() for dual protection: cookie OR IP
            const { count } = await (supabaseAdmin
                .from('landing_f2_usage_events' as any)
                .select('*', { count: 'exact', head: true })
                .or(`anon_id.eq.${anonId},ip_address.eq.${ip}`)
                .gte('created_at', twentyFourHoursAgo.toISOString()) as any);

            if (count !== null && count >= currentLimit) {
                return NextResponse.json(
                    {
                        code: 'LIMIT_REACHED',
                        message: `You have reached the limit of ${currentLimit} checks per 24 hours`,
                        isPromo: isPromoActive
                    },
                    { status: 403 }
                );
            }
        }

        // Call backend API
        let backendResult;
        try {
            backendResult = await checkFood(
                { target: body.target, foodId: body.foodId },
                anonId,
                lang
            );
        } catch (error: any) {
            // Handle backend limits (429 or 403) by showing the landing gate
            if (error.message.includes('429') || error.message.includes('403')) {
                console.warn('[LANDING] Backend limit reached, triggering Gate');
                return NextResponse.json(
                    { code: 'LIMIT_REACHED', message: 'Limit reached' },
                    { status: 403 }
                );
            }
            throw error; // Rethrow to be caught by the outer catch
        }

        console.log('[LANDING] Backend result:', JSON.stringify(backendResult, null, 2));

        // Transform backend response to simple format for frontend
        let toxicityLevel: 'safe' | 'caution' | 'moderate' | 'high' | 'critical' | 'deadly' = 'safe';
        let toxicityName = 'Safe';
        let explanation = 'safe_explanation';
        let severity = 0;

        if (backendResult?.results?.warnings && backendResult.results.warnings.length > 0) {
            const warning = backendResult.results.warnings[0];

            // Map backend codes to frontend types
            const backendLevel = (warning.toxicity_level || warning.level || '').toLowerCase();

            if (['caution', 'moderate', 'high', 'critical'].includes(backendLevel)) {
                toxicityLevel = backendLevel as any;
            } else if (backendLevel === 'low') {
                toxicityLevel = 'caution';
            } else {
                toxicityLevel = 'high';
            }

            toxicityName = warning.toxicity_name || 'Warning';
            severity = warning.severity || 0;

            // Check for explicit "deadly" or "fatal" in name to upgrade display
            if (toxicityLevel === 'critical' &&
                (toxicityName.toLowerCase().includes('deadly') || toxicityName.toLowerCase().includes('fatal'))) {
                toxicityLevel = 'deadly';
            }

            explanation = warning.notes || warning.message || `${toxicityName} - Severity: ${severity}`;
        }

        // Log usage event
        await supabaseAdmin
            .from('landing_f2_usage_events' as any)
            .insert({
                anon_id: anonId,
                ip_address: ip,
                target: body.target,
                food_id: body.foodId,
            });

        return NextResponse.json({
            result: {
                toxicityLevel,
                toxicityName,
                explanation,
                severity
            },
        });
    } catch (error) {
        console.error('[LANDING] F2 check error:', error);
        return NextResponse.json(
            { error: 'Failed to check food safety' },
            { status: 500 }
        );
    }
}
