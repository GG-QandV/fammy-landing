/**
 * Functions configuration for the Category Accordion.
 * 
 * Each function belongs to a category. Categories are displayed as
 * accordion sections on the landing page.
 * 
 * available: false → shown with "Coming Soon" badge, click opens ComingSoon component
 * available: true  → click opens the ToolSheet with the corresponding wizard
 */

export type FunctionId = 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6';
export type CategoryId = 'safety' | 'nutrition' | 'health';

export interface FunctionEntry {
    id: FunctionId;
    i18nKey: string;
    i18nDescKey: string;
    emoji: string;
    available: boolean;
    route: string;
    category: CategoryId;
}

export interface CategoryEntry {
    id: CategoryId;
    i18nKey: string;
    emoji: string;
    functions: FunctionId[];
}

export const categories: CategoryEntry[] = [
    {
        id: 'safety',
        i18nKey: 'category_safety',
        emoji: '🛡️',
        functions: ['f2'],
    },
    {
        id: 'nutrition',
        i18nKey: 'category_nutrition',
        emoji: '🥗',
        functions: ['f1', 'f3', 'f4'],
    },
    {
        id: 'health',
        i18nKey: 'category_health',
        emoji: '💊',
        functions: ['f5', 'f6'],
    },
];

export const functions: Record<FunctionId, FunctionEntry> = {
    f2: {
        id: 'f2',
        i18nKey: 'fn_f2_title',
        i18nDescKey: 'fn_f2_desc',
        emoji: '🔍',
        available: true,
        route: '/food-safety-check',
        category: 'safety',
    },
    f1: {
        id: 'f1',
        i18nKey: 'fn_f1_title',
        i18nDescKey: 'fn_f1_desc',
        emoji: '📊',
        available: true,
        route: '/nutrient-analysis',
        category: 'nutrition',
    },
    f3: {
        id: 'f3',
        i18nKey: 'fn_f3_title',
        i18nDescKey: 'fn_f3_desc',
        emoji: '⚖️',
        available: false,
        route: '/portion-calculator',
        category: 'nutrition',
    },
    f4: {
        id: 'f4',
        i18nKey: 'fn_f4_title',
        i18nDescKey: 'fn_f4_desc',
        emoji: '📋',
        available: false,
        route: '/recipe-generator',
        category: 'nutrition',
    },
    f5: {
        id: 'f5',
        i18nKey: 'fn_f5_title',
        i18nDescKey: 'fn_f5_desc',
        emoji: '📈',
        available: false,
        route: '/bcs-tracker',
        category: 'health',
    },
    f6: {
        id: 'f6',
        i18nKey: 'fn_f6_title',
        i18nDescKey: 'fn_f6_desc',
        emoji: '📚',
        available: false,
        route: '/nutrients-guide',
        category: 'health',
    },
};

/** Get all functions for a given category */
export function getFunctionsByCategory(categoryId: CategoryId): FunctionEntry[] {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return [];
    return category.functions.map((fId) => functions[fId]);
}

/** Get only available functions */
export function getAvailableFunctions(): FunctionEntry[] {
    return Object.values(functions).filter((f) => f.available);
}
