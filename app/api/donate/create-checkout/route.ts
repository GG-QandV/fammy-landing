import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20' as any,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { anonId, userId, email, priceId } = body;

        if (!anonId) {
            return NextResponse.json(
                { error: 'Missing anonId' },
                { status: 400 }
            );
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Unlimited F2 Food Safety Checks',
                            description: 'Permanent unlimited access to F2 Food Safety Checker for fammy.pet',
                        },
                        unit_amount: 500, // $5.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${BASE_URL}/?payment=success`,
            cancel_url: `${BASE_URL}/?payment=cancel`,
            customer_email: email || undefined,
            metadata: {
                anonId,
                userId: userId || '',
                email: email || '',
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
