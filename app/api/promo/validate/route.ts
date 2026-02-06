import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const SECRET = new TextEncoder().encode(JWT_SECRET);

// Simple hardcoded promo codes for now (can be moved to DB later)
const VALID_PROMOS = {
    'VIP50': 50,
    'LAUNCH2026': 100,
    'BETA50': 50
};

export async function POST(req: Request) {
    try {
        const { promoCode, anonId } = await req.json();

        if (!promoCode || !anonId) {
            return NextResponse.json({ error: 'Missing promo code or anonId' }, { status: 400 });
        }

        // Query Supabase for the promo code
        const { data: promo, error: promoError } = await (supabaseAdmin
            .from('landing_promo_codes' as any)
            .select('*')
            .eq('code', promoCode)
            .eq('is_active', true)
            .single() as any);

        if (promoError || !promo) {
            return NextResponse.json({ error: 'Invalid or inactive promo code' }, { status: 403 });
        }

        // Check expiration
        if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
            return NextResponse.json({ error: 'Promo code expired' }, { status: 403 });
        }

        // Check usage count
        if (promo.max_usages && promo.usage_count >= promo.max_usages) {
            return NextResponse.json({ error: 'Promo code usage limit reached' }, { status: 403 });
        }

        const limit = promo.custom_limit;

        // Generate a special JWT with custom limit
        const token = await new SignJWT({
            userId: anonId,
            role: 'promo_guest',
            limit: limit
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('30d') // Promo tokens last 30 days
            .sign(SECRET);

        // Increment usage count (optional/background)
        await supabaseAdmin
            .from('landing_promo_codes' as any)
            .update({ usage_count: (promo.usage_count || 0) + 1 })
            .eq('id', promo.id);

        return NextResponse.json({
            success: true,
            token,
            limit
        });
    } catch (error) {
        console.error('Promo validation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
