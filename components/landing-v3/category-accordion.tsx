'use client';

import { useLanguage } from '@/context/LanguageContext';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    categories,
    functions,
    type FunctionId,
    type FunctionEntry,
} from '@/lib/functions-config';

interface CategoryAccordionProps {
    onSelectTool: (funcId: FunctionId) => void;
    className?: string;
}

export function CategoryAccordion({ onSelectTool, className }: CategoryAccordionProps) {
    const { t } = useLanguage();

    return (
        <Accordion
            type="multiple"
            defaultValue={categories.map((c) => c.id)}
            className={className}
        >
            {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-base">
                        <span className="flex items-center gap-2">
                            <span>{category.emoji}</span>
                            <span>{t(category.i18nKey as Parameters<typeof t>[0])}</span>
                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1">
                            {category.functions.map((funcId) => {
                                const func = functions[funcId];
                                if (!func) return null;

                                return (
                                    <Button
                                        key={func.id}
                                        variant="ghost"
                                        className={cn(
                                            'w-full justify-start h-10 px-3 gap-2',
                                            !func.available && 'opacity-60',
                                        )}
                                        onClick={() => onSelectTool(func.id)}
                                    >
                                        <span>{func.emoji}</span>
                                        <span className="flex-1 text-left text-sm">
                                            {t(func.i18nKey as Parameters<typeof t>[0])}
                                        </span>
                                        {!func.available && (
                                            <Badge variant="secondary" className="text-[10px] h-5">
                                                {t('coming_soon')}
                                            </Badge>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
