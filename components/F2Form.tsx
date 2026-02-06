'use client';

import { useState } from 'react';
import FoodAutocomplete from './FoodAutocomplete';
import { useLanguage } from '../context/LanguageContext';

interface Food {
    id: string;
    name: string;
}

interface Props {
    onSubmit: (data: { target: string; foodId: string; foodName: string }) => Promise<void>;
}

export default function F2Form({ onSubmit }: Props) {
    const { t } = useLanguage();
    const [target, setTarget] = useState<string>('dog');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFood) {
            alert('Please select a food');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                target,
                foodId: selectedFood.id,
                foodName: selectedFood.name,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="f2-form">
            {/* Target selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('search_placeholder').includes('?') ? t('search_placeholder') : 'Who is this for?'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {['dog', 'cat', 'human'].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => option !== 'human' && setTarget(option)}
                            disabled={option === 'human'}
                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors flex flex-col items-center justify-center gap-1 ${target === option
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : option === 'human'
                                    ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-70'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                }`}
                            data-testid={`target-${option}`}
                        >
                            <span className="text-2xl mb-1">
                                {option === 'dog' && '🐶'}
                                {option === 'cat' && '🐱'}
                                {option === 'human' && '🙋‍♂️'}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wide">
                                {option === 'dog' && t('species_dog')}
                                {option === 'cat' && t('species_cat')}
                                {option === 'human' && t('species_human')}
                            </span>
                            {option === 'human' && (
                                <span className="text-[9px] leading-tight font-bold opacity-60 text-center mt-1">
                                    {t('allergen_check_soon')}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Food autocomplete */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search for a food
                </label>
                <FoodAutocomplete
                    onSelect={setSelectedFood}
                    placeholder="e.g., chicken, chocolate, grapes..."
                />
                {selectedFood && (
                    <p className="mt-2 text-sm text-gray-600">
                        Selected: <span className="font-medium">{selectedFood.name}</span>
                    </p>
                )}
            </div>

            {/* Submit button */}
            <button
                type="submit"
                disabled={!selectedFood || isSubmitting}
                className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                data-testid="f2-submit"
            >
                {isSubmitting ? '...' : t('check_button')}
            </button>
        </form>
    );
}
