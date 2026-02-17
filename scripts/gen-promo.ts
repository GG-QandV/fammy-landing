import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(url, key, {
    db: { schema: 'app' }
});

async function generatePromo(tier: string = 'gold', durationMonths: number = 1) {
    const code = 'TEST-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3); // 3 months validity for redemption

    const { data, error } = await supabase
        .from('promo_codes')
        .insert({
            code,
            tier,
            duration_months: durationMonths,
            expires_at: expiresAt.toISOString(),
            max_uses: 1,
            is_active: true,
            used_count: 0
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating promo:', error);
        return;
    }

    console.log('✅ Promo code created successfully!');
    console.log('Code:', data.code);
    console.log('Tier:', data.tier);
    console.log('Expires At:', data.expires_at);
}

const tier = process.argv[2] || 'gold';
generatePromo(tier);
