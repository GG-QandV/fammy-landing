'use client';

import { useMemo } from 'react';

export interface FeatureLimits {
    dailyLimit: number | null;   // null = безлимитно / нет promo
    usageLimit: number | null;   // null = безлимитно / нет promo
}

/**
 * Reads the promo_token cookie, decodes the JWT payload (no verification —
 * client-side only, for display purposes), and returns limits for a given
 * feature code (e.g. 'diet_validator', 'human_foods_checker').
 *
 * Returns null if there is no active promo token or the feature is not found.
 */
export function useFeatureLimits(featureCode: string): FeatureLimits | null {
    return useMemo(() => {
        if (typeof document === 'undefined') return null;

        // Read promo_token cookie
        const match = document.cookie.match(/(?:^|;\s*)promo_token=([^;]+)/);
        if (!match) return null;

        try {
            // Decode JWT payload (second segment, base64url)
            const payload = JSON.parse(
                atob(match[1].split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
            );

            const features: Array<{ code: string; usageLimit: number | null; dailyLimit: number | null }> =
                payload.features || [];

            const feature = features.find((f) => f.code === featureCode);
            if (!feature) return null;

            return {
                dailyLimit: feature.dailyLimit ?? null,
                usageLimit: feature.usageLimit ?? null,
            };
        } catch {
            return null;
        }
    }, [featureCode]);
}
