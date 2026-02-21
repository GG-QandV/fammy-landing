import { supabaseAdmin } from './supabaseAdmin';

export interface PromoDOTResult {
    dailyLimit: number;
    isActive: boolean;
}

export const PromoDOT = {
    /**
     * Gets the active promo limit for an anonymous user from Supabase.
     */
    async getActiveLimit(anonId: string, defaultLimit: number): Promise<PromoDOTResult> {
        try {
            const { data, error } = await ((supabaseAdmin
                .from('landing_promo_redemptions' as any) as any)
                .select('daily_limit')
                .eq('anon_id', anonId)
                .eq('is_active', true)
                .gt('expires_at', new Date().toISOString())
                .order('daily_limit', { ascending: false })
                .limit(1) as any);

            if (error) {
                console.error('[PromoDOT] Database error:', error);
                return { dailyLimit: defaultLimit, isActive: false };
            }

            if (data && data.length > 0) {
                return {
                    dailyLimit: data[0].daily_limit,
                    isActive: true
                };
            }

            return { dailyLimit: defaultLimit, isActive: false };
        } catch (error) {
            console.error('[PromoDOT] Unexpected error:', error);
            return { dailyLimit: defaultLimit, isActive: false };
        }
    },

    /**
     * Records an F1 usage event for a user.
     */
    async trackF1Usage(anonId: string, ip: string, metadata?: any): Promise<void> {
        await (supabaseAdmin as any).from('landing_f1_usage_events').insert({
            anon_id: anonId,
            ip_address: ip,
            ...metadata
        });
    },

    /**
     * Records an F2 usage event for a user.
     */
    async trackF2Usage(anonId: string, ip: string, metadata?: any): Promise<void> {
        await (supabaseAdmin as any).from('landing_f2_usage_events').insert({
            anon_id: anonId,
            ip_address: ip,
            ...metadata
        });
    }
};
