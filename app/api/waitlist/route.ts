import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { getSupabaseBrowserClient } from '../../../lib/supabaseClient';

interface WaitlistRequest {
    email: string;
    provider?: 'email' | 'google' | 'facebook' | 'twitter';
    utm_source?: string;
    utm_campaign?: string;
    ref_code?: string;
}

/**
 * POST /api/waitlist
 * Add user to waitlist
 */
export async function POST(request: NextRequest) {
    try {
        const body: WaitlistRequest = await request.json();
        const { email, provider = 'email', utm_source, utm_campaign, ref_code } = body;

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email' },
                { status: 400 }
            );
        }

        // Check if user is authenticated
        const authHeader = request.headers.get('authorization');
        let authUserId: string | null = null;

        if (authHeader) {
            // Extract user ID from session (if authenticated)
            // This will be set after OAuth callback
            const token = authHeader.replace('Bearer ', '');
            const { data } = await supabaseAdmin.auth.getUser(token);
            authUserId = data.user?.id || null;
        }

        // Upsert waitlist lead
        const { error } = await supabaseAdmin
            .from('landing_waitlist_leads' as any)
            .upsert({
                email: email.toLowerCase(),
                provider,
                auth_user_id: authUserId,
                utm_source,
                utm_campaign,
                ref_code,
                status: 'pending',
            }, {
                onConflict: 'email',
            });

        if (error) {
            console.error('Waitlist upsert error:', error);
            return NextResponse.json(
                { error: 'Failed to add to waitlist' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
