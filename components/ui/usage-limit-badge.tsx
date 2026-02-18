'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface UsageLimitBadgeProps {
    /** Checks remaining today. null = don't render. */
    remainingToday: number | null;
    /** Total daily limit. null = unlimited (don't render). */
    dailyLimit: number | null;
    className?: string;
}

/**
 * Displays remaining daily checks when a promo with a dailyLimit is active.
 * Renders nothing if remainingToday or dailyLimit is null.
 */
export function UsageLimitBadge({ remainingToday, dailyLimit, className }: UsageLimitBadgeProps) {
    const { t } = useLanguage();

    // Don't render if no limit or no data
    if (remainingToday === null || dailyLimit === null) return null;

    const ratio = remainingToday / dailyLimit;
    const colorClass =
        ratio > 0.5
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
            : ratio > 0.2
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-red-700 bg-red-50 border-red-200';

    // e.g. "Залишилось сьогодні: 7 з 10"
    const label = `${t('usage_remaining_label')} ${remainingToday} ${t('usage_remaining_of')} ${dailyLimit}`;

    return (
        <div
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium',
                colorClass,
                className,
            )}
        >

            {label}
        </div>
    );
}
