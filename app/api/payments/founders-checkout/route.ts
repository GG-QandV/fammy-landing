import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || '';
const SECRET = new TextEncoder().encode(JWT_SECRET);

async function generateProxyToken(): Promise<string> {
    if (!JWT_SECRET) return '';
    // System token for proxying
    return await new SignJWT({ role: 'proxy_admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1m')
        .sign(SECRET);
}

/**
 * POST /api/payments/founders-checkout
 * Proxy to backend billing/founders-checkout
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productCode, email, giftEmail, successUrl, cancelUrl } = body;

        const token = await generateProxyToken();
        const url = `${BACKEND_BASE_URL}/api/v1/billing/founders-checkout`;

        console.log('[Proxy] Creating checkout:', { productCode, email });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                productCode,
                email,
                giftEmail,
                successUrl,
                cancelUrl
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Proxy] Backend error:', response.status, errorText);
            return NextResponse.json(
                { error: 'Failed to create checkout', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('[Proxy] Payment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
