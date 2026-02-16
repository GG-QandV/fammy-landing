'use client';

import { Clock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FunctionEntry } from '@/lib/functions-config';

interface ComingSoonProps {
    func: FunctionEntry;
    className?: string;
}

export function ComingSoon({ func, className }: ComingSoonProps) {
    const { t } = useLanguage();

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-4 py-12 px-6 text-center',
                className,
            )}
        >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                <Clock className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                    <span className="mr-2">{func.emoji}</span>
                    {t(func.i18nKey as Parameters<typeof t>[0])}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    {t(func.i18nDescKey as Parameters<typeof t>[0])}
                </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">{t('coming_soon')}</span>
            </div>

            <p className="text-sm text-muted-foreground max-w-xs">
                {t('coming_soon_desc')}
            </p>

            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    const el = document.getElementById('waitlist-section');
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
            >
                {t('waitlist_cta_button')}
            </Button>
        </div>
    );
}
