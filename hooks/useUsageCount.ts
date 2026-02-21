'use client';

import { useState, useEffect } from 'react';
import { getOrCreateAnonId } from '@/lib/anonId';

export interface FeatureUsage {
    used: number;
    limit: number;
    remaining: number;
}

export interface UsageData {
    f1: FeatureUsage;
    f2: FeatureUsage;
}

/**
 * Fetches current usage counts from /api/usage on mount.
 * Returns null while loading.
 */
export function useUsageCount(): UsageData | null {
    const [usage, setUsage] = useState<UsageData | null>(null);

    useEffect(() => {
        // Ensure anon_id cookie exists before fetching
        getOrCreateAnonId();

        const promoToken = localStorage.getItem('promo_token');

        fetch('/api/usage', {
            credentials: 'include',
            headers: {
                ...(promoToken ? { 'x-promo-token': promoToken } : {})
            }
        })
            .then((r) => r.json())
            .then((data) => {
                if (data.f1 && data.f2) setUsage(data);
            })
            .catch(() => {/* silently ignore */ });
    }, []);

    return usage;
}
