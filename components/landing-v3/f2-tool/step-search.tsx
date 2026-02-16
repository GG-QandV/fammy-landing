'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getOrCreateAnonId } from '@/lib/anonId';
import FoodAutocomplete from '@/components/ui/food-autocomplete';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpeciesEntry } from '@/lib/species-config';

interface StepSearchProps {
    species: SpeciesEntry;
    onResult: (result: F2Result) => void;
    className?: string;
}

export interface F2Result {
    toxicityLevel: string;
    toxicityName: string;
    explanation?: string;
    notes?: string;
    severity: number;
    foodName?: string;
}

export function StepSearch({ species, onResult, className }: StepSearchProps) {
    const { t, language } = useLanguage();
    const [selectedFood, setSelectedFood] = useState<{ id: string; name: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (!selectedFood) return;

        setLoading(true);
        try {
            const anonId = getOrCreateAnonId();
            const promoToken = typeof document !== 'undefined'
                ? document.cookie.match(/promo_token=([^;]+)/)?.[1] || ''
                : '';

            const res = await fetch('/api/f2/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `anon_id=${anonId}`,
                    ...(promoToken ? { 'x-promo-token': promoToken } : {}),
                },
                body: JSON.stringify({
                    target: species.backendTarget,
                    foodId: selectedFood.id,
                    lang: language,
                }),
            });

            const data = await res.json();

            if (data.result) {
                onResult({ ...data.result, foodName: selectedFood.name });
            } else if (data.code === 'LIMIT_REACHED') {
                onResult({
                    toxicityLevel: 'caution',
                    toxicityName: t('attention'),
                    explanation: t('f2_limit_reached'),
                    severity: 2,
                    foodName: selectedFood.name,
                });
            } else {
                onResult({
                    toxicityLevel: 'caution',
                    toxicityName: t('caution'),
                    explanation: data.message || t('f2_error_generic'),
                    severity: 3,
                    foodName: selectedFood.name,
                });
            }
        } catch {
            onResult({
                toxicityLevel: 'critical',
                toxicityName: t('critical'),
                explanation: t('f2_error_network'),
                severity: 5,
                foodName: selectedFood?.name,
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

            <div className="space-y-3">
                <FoodAutocomplete
                    onSelect={(food) => setSelectedFood(food)}
                    placeholder={t('search_placeholder')}
                />

                <Button
                    onClick={handleCheck}
                    disabled={loading || !selectedFood}
                    className="w-full h-12"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <Search className="h-4 w-4 mr-2" />
                    )}
                    {t('check_button')}
                </Button>
            </div>
        </div>
    );
}
