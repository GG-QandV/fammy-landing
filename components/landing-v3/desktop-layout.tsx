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
            {/*
             * Mobile: flex column, main first (order-1), sidebar second (order-2).
             * Desktop (≥1024px): CSS Grid two columns, sidebar left (order restored).
             */}
            <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
                {/* Sidebar — order-2 on mobile (below hero), order-1 on desktop (left column) */}
                <aside className="order-2 lg:order-1 mt-6 lg:mt-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2">
                    <div id="category-accordion">
                        {sidebar}
                    </div>
                </aside>

                {/* Main content — order-1 on mobile (first), order-2 on desktop (right) */}
                <div className="order-1 lg:order-2">
                    {main}
                </div>
            </div>
        </div>
    );
}
