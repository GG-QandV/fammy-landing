/**
 * Weight converter utility
 * 1 ounce (oz) = 28.3495 grams (g)
 */

export type WeightUnit = 'g' | 'oz';

const GRAMS_PER_OUNCE = 28.3495;

/**
 * Convert value to grams
 */
export function toGrams(value: number, unit: WeightUnit): number {
    if (unit === 'g') return value;
    return value * GRAMS_PER_OUNCE;
}

/**
 * Convert value from grams to target unit
 */
export function fromGrams(value: number, unit: WeightUnit): number {
    if (unit === 'g') return value;
    return value / GRAMS_PER_OUNCE;
}

/**
 * Formats weight with unit label
 */
export function formatWeight(value: number, unit: WeightUnit, precision: number = 2): string {
    const rounded = Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
    return `${rounded}${unit}`;
}
