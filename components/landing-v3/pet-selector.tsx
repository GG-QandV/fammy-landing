'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { useIsMobile } from '@/components/ui/use-mobile';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    type SpeciesEntry,
    type SpeciesGroup,
    speciesGroups,
    getPopularSpecies,
    getSpeciesByGroup,
    isSpeciesSupported,
} from '@/lib/species-config';

interface PetSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (species: SpeciesEntry) => void;
    className?: string;
}

function PetSelectorContent({
    onSelect,
    onOpenChange,
}: Pick<PetSelectorProps, 'onSelect' | 'onOpenChange'>) {
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
        onOpenChange(false);
    };

    const toggleGroup = (groupId: string) => {
        setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
    };

    return (
        <ScrollArea className="h-full max-h-[70vh] pr-2">
            {/* Top-4 popular species — large buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                {popularSpecies.map((species) => (
                    <Button
                        key={species.id}
                        variant="outline"
                        className={cn(
                            'h-20 flex flex-col items-center justify-center gap-1 text-base',
                            'hover:bg-accent hover:border-primary/50 transition-all',
                            !isSpeciesSupported(species) && 'opacity-60',
                        )}
                        onClick={() => handleSpeciesClick(species)}
                    >
                        <span className="text-3xl">{species.emoji}</span>
                        <span className="text-sm font-medium">
                            {t(species.i18nKey as Parameters<typeof t>[0])}
                        </span>
                        {!isSpeciesSupported(species) && (
                            <span className="text-[10px] text-muted-foreground">
                                {t('coming_soon')}
                            </span>
                        )}
                    </Button>
                ))}
            </div>

            {/* Other species — expandable groups */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                    {t('other_species')}
                </p>
                {expandableGroups.map((group) => {
                    const groupSpecies = getSpeciesByGroup(group.id);
                    if (groupSpecies.length === 0) return null;

                    return (
                        <Collapsible
                            key={group.id}
                            open={openGroups[group.id]}
                            onOpenChange={() => toggleGroup(group.id)}
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between h-10 px-3"
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{group.emoji}</span>
                                        <span>
                                            {t(group.i18nKey as Parameters<typeof t>[0])}
                                        </span>
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            'h-4 w-4 transition-transform duration-200',
                                            openGroups[group.id] && 'rotate-180',
                                        )}
                                    />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="grid grid-cols-2 gap-2 p-2">
                                    {groupSpecies.map((species) => (
                                        <SpeciesButton
                                            key={species.id}
                                            species={species}
                                            onClick={() => handleSpeciesClick(species)}
                                        />
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </div>
        </ScrollArea>
    );
}

function SpeciesButton({
    species,
    onClick,
}: {
    species: SpeciesEntry;
    onClick: () => void;
}) {
    const { t } = useLanguage();
    const supported = isSpeciesSupported(species);

    return (
        <Button
            variant="outline"
            size="sm"
            className={cn(
                'justify-start gap-2 h-9',
                !supported && 'opacity-60',
            )}
            onClick={onClick}
        >
            <span>{species.emoji}</span>
            <span className="truncate text-xs">
                {t(species.i18nKey as Parameters<typeof t>[0])}
            </span>
            {!supported && (
                <span className="ml-auto text-[9px] text-muted-foreground whitespace-nowrap">
                    {t('coming_soon')}
                </span>
            )}
        </Button>
    );
}

export function PetSelector({
    open,
    onOpenChange,
    onSelect,
    className,
}: PetSelectorProps) {
    const isMobile = useIsMobile();
    const { t } = useLanguage();

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="bottom" className={cn('h-[85vh]', className)}>
                    <SheetHeader>
                        <SheetTitle>{t('select_species')}</SheetTitle>
                        <SheetDescription>{t('select_pet_type')}</SheetDescription>
                    </SheetHeader>
                    <div className="mt-4">
                        <PetSelectorContent
                            onSelect={onSelect}
                            onOpenChange={onOpenChange}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('sm:max-w-md', className)}>
                <DialogHeader>
                    <DialogTitle>{t('select_species')}</DialogTitle>
                    <DialogDescription>{t('select_pet_type')}</DialogDescription>
                </DialogHeader>
                <PetSelectorContent
                    onSelect={onSelect}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    );
}
