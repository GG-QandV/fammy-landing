'use client';

import { ShieldCheck, XCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import type { F2Result } from './step-search';

interface StepResultProps {
    result: F2Result;
    className?: string;
}

export function StepResult({ result, className }: StepResultProps) {
    const { t } = useLanguage();

    const getSeverityStyles = (severity: number) => {
        if (severity >= 3)
            return 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100';
        if (severity === 2)
            return 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-100';
        return 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-100';
    };

    const SeverityIcon = result.severity >= 3 ? XCircle : result.severity === 2 ? AlertTriangle : ShieldCheck;

    return (
        <div className={cn('space-y-4', className)}>
            {result.foodName && (
                <p className="text-sm text-muted-foreground">
                    {t('f1_result_for')}: <span className="font-medium">{result.foodName}</span>
                </p>
            )}

            <div
                className={cn(
                    'p-6 rounded-xl border-2 animate-in fade-in slide-in-from-top-2',
                    getSeverityStyles(result.severity),
                )}
            >
                <div className="flex items-center gap-2 font-bold uppercase text-xl mb-2">
                    <SeverityIcon className="h-6 w-6" />
                    {result.toxicityName}
                </div>
                <p className="text-lg opacity-90">
                    {result.notes || result.explanation}
                </p>
            </div>
        </div>
    );
}
