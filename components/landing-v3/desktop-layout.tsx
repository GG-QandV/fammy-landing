'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DesktopLayoutProps {
    sidebar: ReactNode;
    main: ReactNode;
    className?: string;
}

export function DesktopLayout({ sidebar, main, className }: DesktopLayoutProps) {
    return (
        <div className={cn('mx-auto max-w-6xl px-4', className)}>
            {/* Desktop: two columns. Mobile: single column */}
            <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
                {/* Sidebar — sticky on desktop, normal on mobile */}
                <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
                    <div id="category-accordion">
                        {sidebar}
                    </div>
                </aside>

                {/* Main content */}
                <div className="mt-8 lg:mt-0">
                    {main}
                </div>
            </div>
        </div>
    );
}
