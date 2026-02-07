import { useState } from 'react';
import FoodAutocomplete from './FoodAutocomplete';
import { useLanguage } from '../context/LanguageContext';

interface Food {
    id: string;
    name: string;
}

interface Ingredient {
    food: Food;
    grams: number;
}

interface Props {
    onSubmit: (data: { target: string; ingredients: { foodId: string; grams: number }[] }) => Promise<void>;
}

export default function F1Form({ onSubmit }: Props) {
    const { t } = useLanguage();
    const [target, setTarget] = useState<string>('dog');
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [grams, setGrams] = useState<string>('100');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddIngredient = () => {
        if (!selectedFood) return;
        const gramsNum = parseFloat(grams);
        if (isNaN(gramsNum) || gramsNum <= 0) {
            alert(t('invalid_grams') || 'Please enter valid grams');
            return;
        }

        // Check if already added
        if (ingredients.some(i => i.food.id === selectedFood.id)) {
            alert(t('already_added') || 'This ingredient is already added');
            return;
        }

        setIngredients([...ingredients, { food: selectedFood, grams: gramsNum }]);
        setSelectedFood(null);
        setGrams('100');
    };

    const handleRemoveIngredient = (foodId: string) => {
        setIngredients(ingredients.filter(i => i.food.id !== foodId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (ingredients.length === 0) {
            alert(t('add_ingredients_alert') || 'Please add at least one ingredient');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                target,
                ingredients: ingredients.map(i => ({
                    foodId: i.food.id,
                    grams: i.grams
                }))
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalGrams = ingredients.reduce((sum, i) => sum + i.grams, 0);

    return (
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="f1-form">
            {/* Target selector */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('select_pet_type')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {['dog', 'cat'].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setTarget(option)}
                            className={`px-4 py-3 rounded-lg border-2 font-medium transition-colors flex flex-col items-center justify-center gap-1 ${
                                target === option
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                            data-testid={`target-${option}`}
                        >
                            <span className="text-2xl mb-1">
                                {option === 'dog' ? '🐶' : '🐱'}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wide">
                                {option === 'dog' ? t('species_dog') : t('species_cat')}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Add ingredient */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                    {t('add_ingredient') || 'Add ingredient'}
                </label>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <FoodAutocomplete
                            onSelect={setSelectedFood}
                            placeholder={t('search_placeholder')}
                        />
                    </div>
                    <input
                        type="number"
                        value={grams}
                        onChange={(e) => setGrams(e.target.value)}
                        placeholder="g"
                        min="1"
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-center"
                    />
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        disabled={!selectedFood}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        +
                    </button>
                </div>
                {selectedFood && (
                    <p className="text-sm text-gray-500">
                        {t('selected')}: {selectedFood.name}
                    </p>
                )}
            </div>

            {/* Ingredients list */}
            {ingredients.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                            {t('ingredients_list') || 'Ingredients'} ({ingredients.length})
                        </span>
                        <span className="text-sm text-gray-500">
                            {totalGrams}g total
                        </span>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {ingredients.map((item) => (
                            <li key={item.food.id} className="px-4 py-3 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-gray-800">{item.food.name}</span>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm text-gray-600">{item.grams}g</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIngredient(item.food.id)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Submit button */}
            <button
                type="submit"
                disabled={ingredients.length === 0 || isSubmitting}
                className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                data-testid="f1-submit"
            >
                {isSubmitting ? '...' : t('analyze_button')}
            </button>
        </form>
    );
}
