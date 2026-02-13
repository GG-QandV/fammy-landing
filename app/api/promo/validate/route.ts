import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { getAnonIdFromCookieHeader } from '../../../../lib/anonId';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || '';
const SECRET = new TextEncoder().encode(JWT_SECRET);

/**
 * POST /api/promo/validate
 * Validates promo code and issues JWT token with extended limits
 * 
 * Flow:
 * 1. Check code exists in app.promo_codes (is_active, not expired, not max_uses)
 * 2. Check if anon_id already redeemed this code
 * 3. Create landing_promo_redemptions record
 * 4. Increment used_count in promo_codes
 * 5. Return JWT token with { userId, limit, promoId, expiresAt }
 */
export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json();

        if (!code || typeof code !== 'string' || code.trim().length < 3) {
            return NextResponse.json({ success: false, error: 'invalid' }, { status: 400 });
        }

        const cookieHeader = request.headers.get('cookie');
        const anonId = getAnonIdFromCookieHeader(cookieHeader);
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

        if (!anonId) {
            return NextResponse.json({ success: false, error: 'invalid' }, { status: 400 });
        }

        // 1. Look up promo code
        const { data: promo, error: promoError } = await (supabaseAdmin
            .from('promo_codes' as any)
            .select('id, code, tier, duration_months, expires_at, max_uses, used_count, is_active')
            .eq('code', code.toUpperCase().trim())
            .single() as any);

        if (promoError || !promo) {
            console.log('[PROMO] Code not found:', code);
            return NextResponse.json({ success: false, error: 'invalid' });
        }

        // 2. Check is_active
        if (!promo.is_active) {
            console.log('[PROMO] Code inactive:', code);
            return NextResponse.json({ success: false, error: 'invalid' });
        }

        // 3. Check expiration
        if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
            console.log('[PROMO] Code expired:', code);
            return NextResponse.json({ success: false, error: 'expired' });
        }

        // 4. Check max uses
        if (promo.max_uses && (promo.used_count || 0) >= promo.max_uses) {
            console.log('[PROMO] Code max uses reached:', code);
            return NextResponse.json({ success: false, error: 'expired' });
        }

        // 5. Check if already redeemed by this anon_id
        const { data: existing } = await (supabaseAdmin
            .from('landing_promo_redemptions' as any)
            .select('id, is_active, expires_at')
            .eq('promo_code_id', promo.id)
            .eq('anon_id', anonId)
            .single() as any);

        if (existing && existing.is_active) {
            // Already redeemed and active — check if not expired
            if (new Date(existing.expires_at) > new Date()) {
                console.log('[PROMO] Already active for anon:', anonId);
                // Return token again (re-issue)
                const limit = tierToLimit(promo.tier);
                const token = await generatePromoToken(anonId, promo.id, promo.tier, limit, existing.expires_at);
                return NextResponse.json({ success: true, token, tier: promo.tier, limit });
            }
            // Expired redemption — deactivate
            await (supabaseAdmin
                .from('landing_promo_redemptions' as any)
                .update({ is_active: false })
                .eq('id', existing.id) as any);
        }

        // 6. Calculate expiration based on duration_months
        const expiresAt = new Date();
        if (promo.duration_months && promo.duration_months > 0) {
            expiresAt.setMonth(expiresAt.getMonth() + promo.duration_months);
        } else {
            expiresAt.setHours(expiresAt.getHours() + 24); // default 24h
        }

        const limit = tierToLimit(promo.tier);

        // 7. Create redemption record
        const { error: insertError } = await (supabaseAdmin
            .from('landing_promo_redemptions' as any)
            .upsert({
                promo_code_id: promo.id,
                anon_id: anonId,
                ip_address: ip,
                expires_at: expiresAt.toISOString(),
                daily_limit: limit,
                is_active: true,
            }, { onConflict: 'promo_code_id,anon_id' }) as any);

        if (insertError) {
            console.error('[PROMO] Insert error:', insertError);
            return NextResponse.json({ success: false, error: 'invalid' }, { status: 500 });
        }

        // 8. Increment used_count
        await (supabaseAdmin
            .from('promo_codes' as any)
            .update({ used_count: (promo.used_count || 0) + 1 })
            .eq('id', promo.id) as any);

        // 9. Generate JWT token
        const token = await generatePromoToken(anonId, promo.id, promo.tier, limit, expiresAt.toISOString());

        console.log(`[PROMO] Activated: code=${code}, anon=${anonId}, tier=${promo.tier}, limit=${limit}, expires=${expiresAt.toISOString()}`);

        return NextResponse.json({
            success: true,
            token,
            tier: promo.tier,
            limit,
        });

    } catch (error) {
        console.error('[PROMO] Validate error:', error);
        return NextResponse.json({ success: false, error: 'invalid' }, { status: 500 });
    }
}

function tierToLimit(tier: string): number {
    switch (tier) {
        case 'basic':    return 10;
        case 'standard': return 20;
        case 'gold':     return 50;
        case 'vip':      return 100;
        default:         return 10;
    }
}

async function generatePromoToken(
    anonId: string, 
    promoId: string, 
    tier: string, 
    limit: number, 
    expiresAt: string
): Promise<string> {
    return await new SignJWT({
        userId: anonId,
        promoId,
        tier,
        limit,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(new Date(expiresAt).getTime() / 1000)
        .sign(SECRET);
}
