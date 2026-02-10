import { NextRequest, NextResponse } from 'next/server';

const STRIPE_PRICES = {
    coffee: process.env.STRIPE_PRICE_COFFEE || 'price_coffee',
    mini: process.env.STRIPE_PRICE_MINI || 'price_mini',
    core: process.env.STRIPE_PRICE_CORE || 'price_core',
};

export async function POST(request: NextRequest) {
    try {
        const { tier } = await request.json();
        
        if (!['coffee', 'mini', 'core'].includes(tier)) {
            return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
        }

        // TODO: Implement Stripe checkout
        // For now, return placeholder
        return NextResponse.json({ 
            url: `https://buy.stripe.com/test_placeholder_${tier}`,
            message: 'Stripe integration pending'
        });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
