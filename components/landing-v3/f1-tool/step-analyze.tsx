'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getOrCreateAnonId } from '@/lib/anonId';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpeciesEntry } from '@/lib/species-config';
import type { Ingredient } from './step-ingredients';

export interface F1Result {
    nutrients?: {
        code: string;
        name: string;
        totalAmount: number;
        unit: string;
        category?: string;
    }[];
    error?: string;
    isLimit?: boolean;
}

interface StepAnalyzeProps {
    species: SpeciesEntry;
    ingredients: Ingredient[];
    onResult: (result: F1Result) => void;
    className?: string;
}

export function StepAnalyze({ species, ingredients, onResult, className }: StepAnalyzeProps) {
    const { t, language } = useLanguage();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleAnalyze();
    }, []);

    const handleAnalyze = async () => {
        if (ingredients.length === 0 || loading) return;

        setLoading(true);
        try {
            const anonId = getOrCreateAnonId();
            const res = await fetch('/api/f1/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `anon_id=${anonId}`,
                },
                body: JSON.stringify({
                    target: species.backendTarget,
                    ingredients,
                    lang: language,
                }),
            });

            const data = await res.json();

            if (data.success) {
                onResult({
                    ...data.data,
                    remainingToday: data.remainingToday ?? null,
                    dailyLimit: data.dailyLimit ?? null,
                } as any);
            } else if (data.code === 'LIMIT_REACHED') {
                onResult({
                    error: t('f1_limit_reached'),
                    isLimit: true,
                    remainingToday: 0,
                    dailyLimit: 5,
                } as any);
            } else {
                onResult({
                    error: data.message || data.error?.message || t('f1_error_generic'),
                });
            }
        } catch {
            onResult({
                error: t('f1_error_network'),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col items-center justify-center py-12 space-y-4', className)}>
            <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#4A5A7A]/10" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-[#4A5A7A]" />
                </div>
            </div>

            <div className="text-center space-y-1">
                <h3 className="font-semibold text-slate-900">
                    {t('analyzing' as any) || 'Аналізуємо нутрієнти...'}
                </h3>
                <p className="text-sm text-slate-500">
                    {t('please_wait' as any) || 'Це займе всього кілька секунд'}
                </p>
            </div>
        </div>
    );
}
