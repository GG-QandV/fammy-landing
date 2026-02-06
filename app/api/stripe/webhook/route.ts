import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    let event: Stripe.Event;

    try {
        if (!sig || !webhookSecret) {
            throw new Error('Missing stripe-signature or webhook secret');
        }
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (metadata) {
            const { anonId, userId, email } = metadata;

            console.log('[STRIPE WEBHOOK] Payment successful for:', { anonId, userId, email });

            // Grant entitlement in Supabase
            const { error } = await supabaseAdmin
                .from('landing_f2_entitlements')
                .upsert({
                    auth_user_id: userId || null, // Priority to userId
                    email: email || anonId,       // Fallback to email or anonId
                    is_unlimited: true,
                    source: 'donation',
                    stripe_checkout_session_id: session.id,
                    stripe_payment_intent_id: session.payment_intent as string,
                }, {
                    onConflict: 'email', // Or auth_user_id if available
                });

            if (error) {
                console.error('[STRIPE WEBHOOK] Error updating entitlement:', error);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }

            console.log('[STRIPE WEBHOOK] Entitlement granted successfully');
        }
    }

    return NextResponse.json({ received: true });
}
