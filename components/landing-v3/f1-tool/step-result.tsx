'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils/clipboard';
import type { F1Result } from './step-analyze';
import type { Ingredient } from './step-ingredients';

interface StepResultProps {
    result: F1Result;
    ingredients: Ingredient[];
    className?: string;
}

export function StepResult({ result, ingredients, className }: StepResultProps) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const isMacro = (n: { code: string; name: string; category?: string }) =>
        n.category === 'macronutrient' ||
        /^(protein|fat|carbs|fiber|energy|calories|203|204|205|208|291)/i.test(String(n.code)) ||
        /^(білок|вуглеводи|жири|клітковина|енергія|белки|углеводы|жиры|клетчатка|энергия)/i.test(n.name);

    const handleCopy = async () => {
        if (!result.nutrients) return;

        const nutrients = result.nutrients.filter((n) => n.totalAmount > 0);
        const major = nutrients.filter(isMacro);
        const others = nutrients.filter((n) => !isMacro(n)).sort((a, b) => a.name.localeCompare(b.name));

        const summaryHeader = `${t('f1_result_for')}: ${ingredients.map((i) => `${i.foodName} (${i.grams}g)`).join(', ')}`;
        const formatN = (n: { name: string; totalAmount: number; unit: string }) =>
            `${n.name.replace(/\s*\(.*?\)/g, '')}: ${n.totalAmount}${n.unit}`;

        const majorList = major.map(formatN).join('\n');
        const othersList = others.map(formatN).join('\n');
        const fullText = `${summaryHeader}\n\n${t('f1_result_title')}:\n${majorList}${othersList ? `\n---\n${othersList}` : ''}`;

        const success = await copyToClipboard(fullText);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Error case
    if (result.error) {
        return (
            <div
                className={cn(
                    'p-6 rounded-xl border-2 animate-in fade-in slide-in-from-top-2',
                    result.isLimit
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-100'
                        : 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100',
                    className,
                )}
            >
                <h3 className="font-bold text-xl mb-2">
                    {result.isLimit ? t('attention') : t('caution')}
                </h3>
                <p className="text-lg">{result.error}</p>
            </div>
        );
    }

    // Success case
    const nutrients = result.nutrients?.filter((n) => n.totalAmount > 0) || [];
    const major = nutrients.filter(isMacro);
    const others = nutrients.filter((n) => !isMacro(n)).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div
            className={cn(
                'relative p-6 rounded-xl border-2 animate-in fade-in slide-in-from-top-2',
                'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-100',
                className,
            )}
        >
            {/* Copy button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 bg-white/50 hover:bg-white/80 border border-emerald-200 dark:bg-emerald-900/50 dark:hover:bg-emerald-900/80"
                onClick={handleCopy}
            >
                {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                    <Copy className="h-4 w-4 text-emerald-800 dark:text-emerald-200" />
                )}
            </Button>

            <h3 className="font-bold text-xl mb-1">{t('f1_result_title')}</h3>
            <p className="text-sm font-medium italic opacity-90 mb-6 border-b-2 border-emerald-300/40 pb-3">
                {t('f1_result_for')}: {ingredients.map((i, idx) => (
                    <span key={idx}>
                        {i.foodName} ({i.grams}g){idx < ingredients.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </p>

            {/* Macronutrients */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {major.map((nutrient) => (
                    <p key={nutrient.code} className="text-sm border-b border-emerald-100/30 py-1">
                        <span className="font-medium">{nutrient.name.replace(/\s*\(.*?\)/g, '')}:</span>{' '}
                        {nutrient.totalAmount}{nutrient.unit}
                    </p>
                ))}
            </div>

            {/* Micronutrients */}
            {others.length > 0 && (
                <>
                    <div className="my-8 border-t-2 border-emerald-300/50 relative">
                        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-50 dark:bg-emerald-950/50 px-3 text-[11px] text-emerald-700/60 uppercase font-black tracking-widest">
                            Micro
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                        {others.map((nutrient) => (
                            <p key={nutrient.code} className="text-[13px] opacity-80 py-0.5">
                                <span className="font-normal">{nutrient.name.replace(/\s*\(.*?\)/g, '')}:</span>{' '}
                                {nutrient.totalAmount}{nutrient.unit}
                            </p>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
