'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    type SpeciesEntry,
    type SpeciesGroup,
    speciesGroups,
    getPopularSpecies,
    getSpeciesByGroup,
    isSpeciesSupported,
} from '@/lib/species-config';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface StepSpeciesProps {
    onSelect: (species: SpeciesEntry) => void;
    className?: string;
}

export function StepSpecies({ onSelect, className }: StepSpeciesProps) {
    const { t } = useLanguage();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const popularSpecies = getPopularSpecies();
    const expandableGroups = speciesGroups.filter((g) => g.id !== 'popular');

    const handleSpeciesClick = (species: SpeciesEntry) => {
        if (!isSpeciesSupported(species)) {
            toast(t('species_not_supported'), {
                description: `${species.emoji} ${t(species.i18nKey as Parameters<typeof t>[0])}`,
            });
            return;
        }
        onSelect(species);
    };

    const toggleGroup = (groupId: string) => {
        setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    return (
        <ScrollArea className={cn('h-full max-h-[50vh]', className)}>
            <div className="pr-2">
                {/* Top-4 popular species */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {popularSpecies.map((species) => (
                        <Button
                            key={species.id}
                            variant="outline"
                            className={cn(
                                'h-24 flex flex-col items-center justify-center rounded-2xl border-slate-200',
                                (species.id === 'bird' || species.id === 'hamster') ? 'gap-0' : 'gap-2',
                                'hover:bg-slate-50 hover:border-[#546a8c] transition-all group',
                                !isSpeciesSupported(species) && 'cursor-default',
                            )}
                            onClick={() => handleSpeciesClick(species)}
                        >
                            <div className={cn("relative", !isSpeciesSupported(species) && "opacity-60 grayscale")}>
                                <img
                                    src={`/icons/pet-${species.id}.svg`}
                                    alt=""
                                    className={cn(
                                        "w-8 h-8 opacity-70 group-hover:opacity-100 transition-opacity",
                                        (species.id === 'bird' || species.id === 'hamster') && "mb-0.5"
                                    )}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-sm font-semibold text-slate-700 text-center leading-tight",
                                    !isSpeciesSupported(species) && "opacity-60 grayscale"
                                )}>
                                    {t(species.i18nKey as Parameters<typeof t>[0])}
                                </span>
                                {!isSpeciesSupported(species) && (
                                    <img
                                        src="/icons/under-construction.png"
                                        alt=""
                                        className="w-8 h-8 object-contain shrink-0 grayscale-0 opacity-100"
                                    />
                                )}
                            </div>
                            {!isSpeciesSupported(species) && (
                                <span className={cn(
                                    "text-[10px] text-muted-foreground font-normal",
                                    (species.id === 'bird' || species.id === 'hamster') && "-mt-0.5"
                                )}>
                                    {t('coming_soon' as any)}
                                </span>
                            )}
                        </Button>
                    ))}
                </div>

                {/* Simple placeholder for other species */}
                <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground pt-4 border-t border-slate-100">
                        {t('other_species')}
                    </p>
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-8 text-center relative group flex items-center justify-center gap-4">
                        <p className="text-slate-400 text-sm italic">
                            {t('coming_soon' as any)}: {t('species_group_rodents' as any)}, {t('species_group_birds' as any)}, {t('species_group_reptiles' as any)}...
                        </p>
                        <img
                            src="/icons/under-construction.png"
                            alt=""
                            className="w-8 h-8 object-contain shrink-0"
                        />
                    </div>
                </div>
            </div>
        </ScrollArea >
    );
}
