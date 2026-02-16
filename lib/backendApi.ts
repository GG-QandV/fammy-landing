import { SignJWT } from 'jose';

/**
 * Backend API client for PetSafe Validator
 * Proxies requests to the main backend API
 */

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3000';

// JWT secret shared with backend for signing guest tokens
const GUEST_TOKEN = process.env.BACKEND_GUEST_TOKEN || '';

export interface FoodSearchResult {
    id: string;
    name: string;
}

export interface F2CheckRequest {
    target: 'dog' | 'cat' | 'human';
    foodId: string;
    lang?: string;
}

export interface F2CheckResult {
    foodId: string;
    lang?: string;
    toxicityLevel: 'safe' | 'caution' | 'moderate' | 'high' | 'critical' | 'deadly';
    explanation: string;
}

export interface PortionCalcInput {
    target?: string;
    subject_id?: string;
    items?: { food_id: string; amount_grams: number }[];
    recipe_id?: string;
    portion_grams?: number;
    period?: 'meal' | 'day' | 'week';
    meals_per_day?: number;
    lang?: string;
}

export interface PortionCalcResult {
    subject: {
        id: string;
        name: string;
        target: string;
    } | null;
    period: 'meal' | 'day' | 'week';
    meals_per_day: number;
    portion_grams: number;
    total_grams_per_period: number;
    nutrients: {
        code: string;
        name: string;
        amount: number;
        unit: string;
    }[];
    per_100g: {
        code: string;
        name: string;
        amount: number;
        unit: string;
    }[];
    toxicity_warnings: {
        food_id: string;
        food_name: string;
        toxicity_level: string;
        notes: string | null;
    }[];
    allergen_warnings: {
        food_id: string;
        food_name: string;
        matched_allergen: string;
    }[];
}

/**
 * Search foods by query
 * GET /api/v1/foods/search?q=chicken
 */
export async function searchFoods(query: string, lang: string = 'en'): Promise<FoodSearchResult[]> {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const url = `${BACKEND_BASE_URL}/api/v1/foods/search?q=${encodeURIComponent(query)}&lang=${lang}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    // Backend returns { success: true, data: { foods: [...] } }
    return data.data?.foods || [];
}

/**
 * Check food safety for target species
 * POST /api/v1/food-check
 */
export async function checkFood(
    request: F2CheckRequest,
    anonId: string
): Promise<any> {
    const url = `${BACKEND_BASE_URL}/api/v1/food-check`;

    const requestBody = {
        target: request.target,
        food_ids: [request.foodId],
    };

    // Generate a unique token for this session
    const token = GUEST_TOKEN;

    console.log('[backendApi] Sending request:', {
        url,
        headers: {
            'x-session-id': anonId,
            'Accept-Language': request.lang || 'en', hasAuth: !!token
        },
        body: requestBody
    });

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-session-id': anonId,
        'Accept-Language': request.lang || 'en',
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
    // Backend returns { success: true, data: { results: { safe: [], warnings: [] }, overall_safe: boolean } }
    return data.data;
}

/**
 * Calculate portions and nutrients
 * POST /api/v1/functions/portion-calc
 */
export async function calculatePortion(
    request: PortionCalcInput,
    anonId: string
): Promise<PortionCalcResult> {
    const url = `${BACKEND_BASE_URL}/api/v1/functions/portion-calc`;

    const token = GUEST_TOKEN;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-session-id': anonId,
        'Accept-Language': request.lang || 'en',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.data;
}
