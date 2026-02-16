'use client';

import { useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { FunctionEntry } from '@/lib/functions-config';

export interface ToolSheetStep {
    id: string;
    i18nKey: string;
    content: ReactNode;
}

interface ToolSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    func: FunctionEntry;
    steps: ToolSheetStep[];
    currentStep: number;
    onStepChange: (step: number) => void;
    className?: string;
}

function ToolSheetInner({
    func,
    steps,
    currentStep,
    onStepChange,
}: Pick<ToolSheetProps, 'func' | 'steps' | 'currentStep' | 'onStepChange'>) {
    const { t } = useLanguage();
    const router = useRouter();

    const step = steps[currentStep];
    const canGoBack = currentStep > 0;

    return (
        <div className="flex flex-col h-full">
            {/* Step navigation header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {canGoBack && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onStepChange(currentStep - 1)}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    )}
                    <span className="text-sm text-muted-foreground">
                        {currentStep + 1} / {steps.length}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1"
                    onClick={() => router.push(func.route)}
                >
                    {t('open_full_page')}
                    <ExternalLink className="h-3 w-3" />
                </Button>
            </div>

            {/* Step indicators */}
            <div className="flex gap-1 mb-4">
                {steps.map((s, i) => (
                    <div
                        key={s.id}
                        className={cn(
                            'h-1 flex-1 rounded-full transition-colors duration-200',
                            i <= currentStep ? 'bg-primary' : 'bg-muted',
                        )}
                    />
                ))}
            </div>

            {/* Step content with transition */}
            <div
                className="flex-1 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-200"
                key={step.id}
            >
                {step.content}
            </div>
        </div>
    );
}

export function ToolSheet({
    open,
    onOpenChange,
    func,
    steps,
    currentStep,
    onStepChange,
    className,
}: ToolSheetProps) {
    const isMobile = useIsMobile();
    const { t } = useLanguage();

    const stepTitle = steps[currentStep]
        ? t(steps[currentStep].i18nKey as Parameters<typeof t>[0])
        : '';

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side="bottom"
                    className={cn('h-[85vh] flex flex-col', className)}
                >
                    <SheetHeader>
                        <SheetTitle>
                            <span className="mr-2">{func.emoji}</span>
                            {t(func.i18nKey as Parameters<typeof t>[0])}
                        </SheetTitle>
                        <SheetDescription>{stepTitle}</SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 mt-4 overflow-hidden">
                        <ToolSheetInner
                            func={func}
                            steps={steps}
                            currentStep={currentStep}
                            onStepChange={onStepChange}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn('sm:max-w-lg max-h-[80vh] flex flex-col', className)}>
                <DialogHeader>
                    <DialogTitle>
                        <span className="mr-2">{func.emoji}</span>
                        {t(func.i18nKey as Parameters<typeof t>[0])}
                    </DialogTitle>
                    <DialogDescription>{stepTitle}</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <ToolSheetInner
                        func={func}
                        steps={steps}
                        currentStep={currentStep}
                        onStepChange={onStepChange}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
