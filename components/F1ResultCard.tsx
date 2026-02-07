import { useLanguage } from '../context/LanguageContext';

interface Nutrient {
    nutrient_id: string;
    code: string;
    name: string;
    unit: string;
    category: string;
    total_amount: number;
    per_100g: number;
}

interface ToxicityWarning {
    food_id: string;
    food_name: string;
    level: string;
    substance: string | null;
    symptoms: string | null;
    notes: string | null;
}

interface Props {
    result: {
        recipe_id: string;
        recipe_name: string;
        target: string;
        total_weight_g: number;
        nutrients: Nutrient[];
        toxicity: {
            safe: ToxicityWarning[];
            warnings: ToxicityWarning[];
        };
        overall_safe: boolean;
        analyzed_at: string;
    };
}

const CATEGORY_ICONS: Record<string, string> = {
    macronutrient: '🥩',
    vitamin: '💊',
    mineral: '�ite',
    energy: '⚡',
    other: '📊',
};

const CATEGORY_COLORS: Record<string, string> = {
    macronutrient: 'bg-blue-50 border-blue-200 text-blue-800',
    vitamin: 'bg-purple-50 border-purple-200 text-purple-800',
    mineral: 'bg-green-50 border-green-200 text-green-800',
    energy: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    other: 'bg-gray-50 border-gray-200 text-gray-800',
};

export default function F1ResultCard({ result }: Props) {
    const { t } = useLanguage();

    // Group nutrients by category
    const grouped = result.nutrients.reduce((acc, nutrient) => {
        const cat = nutrient.category || 'other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(nutrient);
        return acc;
    }, {} as Record<string, Nutrient[]>);

    const hasWarnings = result.toxicity.warnings.length > 0;

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div className={`border-2 rounded-lg p-6 ${result.overall_safe ? 'bg-success-50 border-success-200' : 'bg-warning-50 border-warning-200'}`}>
                <div className="flex items-start gap-4">
                    <div className="text-4xl">{result.overall_safe ? '✅' : '⚠️'}</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {result.recipe_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {result.total_weight_g}g total • {result.nutrients.length} nutrients analyzed
                        </p>
                    </div>
                </div>
            </div>

            {/* Toxicity Warnings */}
            {hasWarnings && (
                <div className="border-2 border-danger-300 bg-danger-50 rounded-lg p-4">
                    <h4 className="font-bold text-danger-800 mb-2 flex items-center gap-2">
                        <span>⚠️</span> Toxicity Warnings
                    </h4>
                    <ul className="space-y-2">
                        {result.toxicity.warnings.map((w, i) => (
                            <li key={i} className="text-sm text-danger-700">
                                <strong>{w.food_name}</strong>: {w.level}
                                {w.substance && ` (${w.substance})`}
                                {w.notes && ` — ${w.notes}`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Nutrients by Category */}
            {Object.entries(grouped).map(([category, nutrients]) => (
                <div key={category} className="border rounded-lg overflow-hidden">
                    <div className={`px-4 py-2 border-b font-bold flex items-center gap-2 ${CATEGORY_COLORS[category] || CATEGORY_COLORS.other}`}>
                        <span>{CATEGORY_ICONS[category] || '📊'}</span>
                        <span className="capitalize">{category}</span>
                        <span className="text-xs font-normal">({nutrients.length})</span>
                    </div>
                    <div className="divide-y">
                        {nutrients.slice(0, 10).map((nutrient) => (
                            <div key={nutrient.nutrient_id} className="px-4 py-2 flex justify-between items-center hover:bg-gray-50">
                                <span className="text-sm text-gray-700">{nutrient.name}</span>
                                <div className="text-right">
                                    <span className="font-mono text-sm font-bold">
                                        {nutrient.total_amount.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">{nutrient.unit}</span>
                                </div>
                            </div>
                        ))}
                        {nutrients.length > 10 && (
                            <div className="px-4 py-2 text-center text-xs text-gray-500">
                                +{nutrients.length - 10} more
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
