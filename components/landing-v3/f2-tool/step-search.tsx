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
            const promoToken = localStorage.getItem('promo_token') || '';

            const res = await fetch('/api/f2/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(promoToken ? { 'x-promo-token': promoToken } : {}),
                },
                body: JSON.stringify({
                    target: species.backendTarget,
                    foodId: selectedFood.id,
                    lang: language,
                }),
            });

            const data = await res.json();
            console.log('[F2 TRACE] StepSearch raw response:', JSON.stringify(data));

            if (data.result) {
                const resultPayload = {
                    ...data.result,
                    foodName: selectedFood.name,
                    remainingToday: data.remainingToday ?? null,
                    dailyLimit: data.dailyLimit ?? null,
                } as any;
                console.log('[F2 TRACE] Calling onResult with:', JSON.stringify(resultPayload));
                onResult(resultPayload);
            } else if (data.code === 'LIMIT_REACHED') {
                onResult({
                    toxicityLevel: 'caution',
                    toxicityName: t('attention'),
                    explanation: t('f2_limit_reached'),
                    severity: 2,
                    foodName: selectedFood.name,
                    remainingToday: 0,
                    dailyLimit: 10,
                } as any);
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
        <div className={cn('space-y-4 w-full', className)}>
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
                <img
                    src={`/icons/pet-${species.id}.svg`}
                    alt=""
                    className="w-12 h-12 opacity-80"
                />
                <span className="text-xl font-bold text-[#4A5A7A]">
                    {t(species.i18nKey as Parameters<typeof t>[0])}
                </span>
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
