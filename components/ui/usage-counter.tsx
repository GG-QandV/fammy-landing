'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useUsageCount } from '@/hooks/useUsageCount';

interface UsageCounterProps {
    /** Which feature to show: 'f1' or 'f2' */
    feature: 'f1' | 'f2';
    className?: string;
}

/**
 * Persistent usage counter — loads on page open, shows remaining checks.
 * Fetches current usage from /api/usage on mount.
 */
export function UsageCounter({ feature, className }: UsageCounterProps) {
    const { t } = useLanguage();
    const usage = useUsageCount();

    // While loading, show skeleton
    if (!usage) {
        return (
            <div className={cn('h-9 w-48 rounded-lg bg-slate-100 animate-pulse', className)} />
        );
    }

    const { remaining, limit } = usage[feature];
    const ratio = limit > 0 ? remaining / limit : 0;

    const colorClass =
        ratio > 0.5
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : ratio > 0.2
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-red-200 bg-red-50 text-red-800';

    const label = `${t('usage_remaining_label')} ${remaining} ${t('usage_remaining_of')} ${limit}`;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium',
                colorClass,
                className,
            )}
        >
            <span>{label}</span>
        </div>
    );
}
