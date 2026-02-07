import { SignJWT } from 'jose';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || '';

export interface FoodSearchResult {
    id: string;
    name: string;
}

export interface F2CheckRequest {
    target: 'dog' | 'cat' | 'human';
    foodId: string;
}

export interface F2CheckResult {
    foodId: string;
    toxicityLevel: 'safe' | 'caution' | 'moderate' | 'high' | 'critical' | 'deadly';
    explanation: string;
}

async function generateGuestToken(anonId: string): Promise<string> {
    if (!JWT_SECRET) {
        console.warn('[backendApi] JWT_SECRET is not set, falling back to empty token');
        return '';
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    return await new SignJWT({
        userId: anonId,
        role: 'guest'
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
}

export async function searchFoods(query: string, lang: string = 'en'): Promise<FoodSearchResult[]> {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const url = `${BACKEND_BASE_URL}/api/v1/foods/search?q=${encodeURIComponent(query)}&lang=${lang}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': lang,
        },
    });

    if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.foods || [];
}

export async function checkFood(
    request: F2CheckRequest,
    anonId: string,
    lang: string = 'en'
): Promise<any> {
    const url = `${BACKEND_BASE_URL}/api/v1/food-check`;

    const requestBody = {
        target: request.target,
        food_ids: [request.foodId],
    };

    const token = await generateGuestToken(anonId);

    console.log('[backendApi] Sending request:', {
        url,
        headers: { 'x-session-id': anonId, hasAuth: !!token, lang },
        body: requestBody
    });

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-session-id': anonId,
        'Accept-Language': lang,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
    });

    console.log('[backendApi] Response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[backendApi] Error response:', errorText);
        throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[backendApi] Success response:', JSON.stringify(data, null, 2));
    return data.data;
}
