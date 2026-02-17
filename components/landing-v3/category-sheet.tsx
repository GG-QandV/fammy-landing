'use client';

import { useLanguage } from '@/context/LanguageContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    functions,
    categories,
    type CategoryId,
    type FunctionId,
} from '@/lib/functions-config';
import { cn } from '@/lib/utils';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CategorySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId: CategoryId | null;
    onSelectTool: (funcId: FunctionId) => void;
}

export function CategorySheet({
    open,
    onOpenChange,
    categoryId,
    onSelectTool,
}: CategorySheetProps) {
    const { t } = useLanguage();

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return null;

    const categoryFunctions = category.functions.map((id) => functions[id]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Custom overlay with lighter backdrop (bg-black/20 instead of default) is handled by custom CSS or tailwind on DialogContent/Overlay if exposed, but shadcn Dialog doesn't easily expose Overlay. We might need a global CSS fix or custom component if needed. For now, let's use standard and look for a way to override backdrop. */}
            <DialogContent className="sm:max-w-[425px] gap-6 p-6 rounded-[2rem] border-none shadow-2xl overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-zinc-950/95">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl font-display">
                        <span>{category.emoji}</span>
                        <span>{t(category.i18nKey as Parameters<typeof t>[0])}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-3 pt-2">
                    {categoryFunctions.map((func) => (
                        <div key={func.id} className="relative group">
                            <Button
                                variant="ghost"
                                className={cn(
                                    'w-full h-auto py-4 px-4 justify-between items-center rounded-2xl border bg-card hover:bg-accent/50 transition-all border-zinc-100 dark:border-zinc-800 shadow-sm',
                                    !func.available && 'opacity-60 cursor-not-allowed'
                                )}
                                onClick={() => {
                                    if (func.available) {
                                        onSelectTool(func.id);
                                        onOpenChange(false);
                                    } else {
                                        onSelectTool(func.id); // Still call it to show "Coming Soon" in common ToolSheet
                                        onOpenChange(false);
                                    }
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-2xl">
                                        {func.emoji}
                                    </div>
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="font-semibold text-base leading-tight">
                                            {t(func.i18nKey as Parameters<typeof t>[0])}
                                        </span>
                                        {!func.available && (
                                            <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[10px] font-bold uppercase tracking-wider">
                                                {t('coming_soon')}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                {func.available ? (
                                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                ) : (
                                    <div className="w-5 h-5" />
                                )}
                            </Button>

                            {/* Optional: Deep Link to standalone page if available */}
                            {func.available && (
                                <Link
                                    href={func.route}
                                    className="absolute top-2 right-2 p-1 text-muted-foreground/30 hover:text-primary transition-colors block"
                                    onClick={(e) => e.stopPropagation()}
                                    title={t('open_on_page' as any)}
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
