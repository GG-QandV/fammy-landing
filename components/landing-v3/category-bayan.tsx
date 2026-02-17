'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { categories, type CategoryId } from '@/lib/functions-config';
import { cn } from '@/lib/utils';

interface CategoryBayanProps {
    onSelectCategory: (categoryId: CategoryId) => void;
    className?: string;
}

export function CategoryBayan({ onSelectCategory, className }: CategoryBayanProps) {
    const { t } = useLanguage();

    return (
        <div className={cn('flex flex-wrap justify-center gap-3', className)}>
            {categories.map((category) => (
                <Button
                    key={category.id}
                    variant="outline"
                    size="lg"
                    className="h-14 px-6 gap-2 rounded-2xl border-2 hover:border-primary/50 transition-all text-base font-medium shadow-sm active:scale-95"
                    onClick={() => onSelectCategory(category.id)}
                >
                    <span className="text-xl">{category.emoji}</span>
                    <span>{t(category.i18nKey as Parameters<typeof t>[0])}</span>
                </Button>
            ))}
        </div>
    );
}
