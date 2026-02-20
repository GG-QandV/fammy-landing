'use client';

import { useState, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getOrCreateAnonId } from '@/lib/anonId';
import FoodAutocomplete from '@/components/ui/food-autocomplete';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XCircle, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toGrams, fromGrams, type WeightUnit, formatWeight } from '@/lib/converters/weight-converter';
import type { SpeciesEntry } from '@/lib/species-config';

interface Ingredient {
    foodId: string;
    foodName: string;
    grams: number;
}

interface StepIngredientsProps {
    species: SpeciesEntry;
    onSubmit: (ingredients: Ingredient[]) => void;
    hideSpeciesIndicator?: boolean;
    className?: string;
}

export type { Ingredient };

export function StepIngredients({ species, onSubmit, hideSpeciesIndicator, className }: StepIngredientsProps) {
    const { t } = useLanguage();
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [weightUnit, setWeightUnit] = useState<WeightUnit>('g');

    const removeIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    const toggleWeightUnit = () => {
        setWeightUnit((prev) => (prev === 'g' ? 'oz' : 'g'));
    };

    const updateGrams = (index: number, displayValue: number) => {
        const newIngredients = [...ingredients];
        newIngredients[index].grams = toGrams(displayValue, weightUnit);
        setIngredients(newIngredients);
    };

    return (
        <div className={cn('space-y-4 w-full', className)}>
            {!hideSpeciesIndicator && (
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <span>{species.emoji}</span>
                    <span>{t(species.i18nKey as Parameters<typeof t>[0])}</span>
                </div>
            )}

            <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{t('f1_hint')}</p>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={toggleWeightUnit}
                    >
                        <Scale className="h-3.5 w-3.5" />
                        {weightUnit === 'g' ? t('unit_grams') : t('unit_ounces')}
                    </Button>
                </div>

                {/* Ingredient list */}
                {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-shrink-0">
                            <Input
                                type="number"
                                value={Math.round(fromGrams(ingredient.grams, weightUnit) * 100) / 100}
                                onChange={(e) => updateGrams(index, parseFloat(e.target.value) || 0)}
                                className="h-10 w-24 rounded-lg text-center pr-7"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">
                                {t(`unit_${weightUnit}` as Parameters<typeof t>[0])}
                            </span>
                        </div>
                        <p className="flex-1 text-sm truncate">{ingredient.foodName}</p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeIngredient(index)}
                        >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {/* Add ingredient */}
                <FoodAutocomplete
                    onSelect={(food) => {
                        setIngredients((prev) => [
                            ...prev,
                            { foodId: food.id, foodName: food.name, grams: 100 },
                        ]);
                    }}
                    placeholder={t('recipe_search_placeholder')}
                    clearOnSelect={true}
                />
            </div>

            <Button
                onClick={() => onSubmit(ingredients)}
                disabled={ingredients.length === 0}
                className="w-full h-12"
            >
                {t('analyze_button')}
            </Button>
        </div>
    );
}
