import { NextRequest, NextResponse } from 'next/server';
import { searchFoods } from '../../../../lib/backendApi';

/**
 * GET /api/f2/foods?q=chicken
 * Proxy to backend food search API
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ foods: [] });
        }

        const foods = await searchFoods(query);

        return NextResponse.json({ foods });
    } catch (error) {
        console.error('Food search error:', error);
        return NextResponse.json(
            { error: 'Failed to search foods' },
            { status: 500 }
        );
    }
}
