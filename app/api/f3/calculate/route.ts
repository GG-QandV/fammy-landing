import { NextRequest, NextResponse } from 'next/server';
import { calculatePortion } from '../../../../lib/backendApi';
import { getAnonIdFromCookieHeader } from '../../../../lib/anonId';

/**
 * POST /api/f3/calculate
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Get anon_id from cookie
        const cookieHeader = request.headers.get('cookie');
        const anonId = getAnonIdFromCookieHeader(cookieHeader);

        if (!anonId) {
            return NextResponse.json(
                { error: 'Missing anon_id cookie' },
                { status: 400 }
            );
        }

        // Call backend API
        const data = await calculatePortion(body, anonId);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error: any) {
        console.error('[LANDING] F3 calculation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to calculate portion' },
            { status: 500 }
        );
    }
}
