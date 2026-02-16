'use client';

import { useState } from 'react';
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

    const handleAnalyze = async () => {
        if (ingredients.length === 0) return;

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
                onResult(data.data);
            } else if (data.code === 'LIMIT_REACHED') {
                onResult({
                    error: t('f1_limit_reached'),
                    isLimit: true,
                });
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
        <div className={cn('space-y-4', className)}>
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <span>{species.emoji}</span>
                <span>{t(species.i18nKey as Parameters<typeof t>[0])}</span>
            </div>

            {/* Ingredients summary */}
            <div className="rounded-xl border bg-card p-4 space-y-1">
                <p className="text-sm font-medium mb-2">
                    {t('f1_hint')} ({ingredients.length})
                </p>
                {ingredients.map((ing, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                        {ing.foodName} — {ing.grams}g
                    </p>
                ))}
            </div>

            <Button
                onClick={handleAnalyze}
                disabled={loading || ingredients.length === 0}
                className="w-full h-12"
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t('analyze_button')}
            </Button>
        </div>
    );
}
