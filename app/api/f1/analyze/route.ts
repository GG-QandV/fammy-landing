import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { getAnonIdFromCookieHeader } from '../../../../lib/anonId';
import { SignJWT } from 'jose';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || '';
const SECRET = new TextEncoder().encode(JWT_SECRET);
const GUEST_USER_ID = '00000000-0000-0000-0000-000000000001';
const DAILY_LIMIT = 5;

async function generateGuestToken(anonId: string): Promise<string> {
    if (!JWT_SECRET) return '';
    return await new SignJWT({ userId: anonId, role: 'guest' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET);
}

interface AnalyzeRequest {
    target: string;
    ingredients: { foodId: string; grams: number }[];
}

/**
 * POST /api/f1/analyze
 * F1 diet analysis with guest limits (5/day)
 */
export async function POST(request: NextRequest) {
    try {
        const body: AnalyzeRequest = await request.json();
        const { target, ingredients } = body;

        if (!target || !ingredients || ingredients.length === 0) {
            return NextResponse.json(
                { error: 'Missing target or ingredients' },
                { status: 400 }
            );
        }

        if (ingredients.length > 20) {
            return NextResponse.json(
                { error: 'Maximum 20 ingredients allowed' },
                { status: 400 }
            );
        }

        const cookieHeader = request.headers.get('cookie');
        const anonId = getAnonIdFromCookieHeader(cookieHeader);
        const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

        if (!anonId) {
            return NextResponse.json(
                { error: 'Missing anon_id cookie' },
                { status: 400 }
            );
        }

        // Check entitlement
        const { data: entitlement } = await (supabaseAdmin
            .from('landing_f1_entitlements' as any)
            .select('is_unlimited')
            .or(`auth_user_id.eq.${anonId},email.eq.${anonId}`)
            .eq('is_unlimited', true)
            .single() as any);

        // Check usage limit
        if (!entitlement) {
            const twentyFourHoursAgo = new Date();
            twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

            const { count } = await (supabaseAdmin
                .from('landing_f1_usage_events' as any)
                .select('*', { count: 'exact', head: true })
                .or(`anon_id.eq.${anonId},ip_address.eq.${ip}`)
                .gte('created_at', twentyFourHoursAgo.toISOString()) as any);

            if (count !== null && count >= DAILY_LIMIT) {
                return NextResponse.json(
                    {
                        code: 'LIMIT_REACHED',
                        message: `You have reached the limit of ${DAILY_LIMIT} analyses per 24 hours`
                    },
                    { status: 403 }
                );
            }
        }

        // Create guest recipe
        const recipeName = `Guest Recipe ${new Date().toISOString().slice(0, 16)}`;
        
        const { data: recipe, error: recipeError } = await supabaseAdmin
            .from('recipes')
            .insert({
                user_id: GUEST_USER_ID,
                name: recipeName,
                target_code: target,
                is_guest: true,
                session_id: anonId,
                is_public: false
            })
            .select('id')
            .single();

        if (recipeError || !recipe) {
            console.error('[F1] Failed to create recipe:', recipeError);
            return NextResponse.json(
                { error: 'Failed to create recipe' },
                { status: 500 }
            );
        }

        // Add ingredients
        const ingredientRows = ingredients.map((ing, idx) => ({
            recipe_id: recipe.id,
            food_id: ing.foodId,
            amount_g: ing.grams,
            sort_order: idx
        }));

        const { error: ingredientsError } = await supabaseAdmin
            .from('recipe_ingredients')
            .insert(ingredientRows);

        if (ingredientsError) {
            console.error('[F1] Failed to add ingredients:', ingredientsError);
            // Cleanup recipe
            await supabaseAdmin.from('recipes').delete().eq('id', recipe.id);
            return NextResponse.json(
                { error: 'Failed to add ingredients' },
                { status: 500 }
            );
        }

        // Call backend diet-analysis
        const token = await generateGuestToken(GUEST_USER_ID);
        const url = `${BACKEND_BASE_URL}/api/v1/diet-analysis`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-id': anonId,
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ recipe_id: recipe.id }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[F1] Backend error:', response.status, errorText);
            
            if (response.status === 429 || response.status === 403) {
                return NextResponse.json(
                    { code: 'LIMIT_REACHED', message: 'Limit reached' },
                    { status: 403 }
                );
            }
            return NextResponse.json(
                { error: 'Analysis failed' },
                { status: 500 }
            );
        }

        const data = await response.json();
        const result = data.data;

        // Log usage
        await supabaseAdmin
            .from('landing_f1_usage_events' as any)
            .insert({
                anon_id: anonId,
                ip_address: ip,
                recipe_id: recipe.id,
                recipe_name: recipeName,
                nutrients_count: result?.nutrients?.length || 0,
            });

        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error('[F1] Analyze error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze diet' },
            { status: 500 }
        );
    }
}
