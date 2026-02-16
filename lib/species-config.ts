/**
 * Species configuration for the 26-species Pet Selector.
 * 
 * backendTarget: The species ID accepted by the backend API.
 *   - 'dog' | 'cat' | 'human' → currently supported
 *   - null → not yet supported (UI shows "Coming Soon" badge)
 * 
 * When backend adds new species, update backendTarget here — UI adapts automatically.
 */

export type BackendTarget = 'dog' | 'cat' | 'human';

export interface SpeciesEntry {
    id: string;
    emoji: string;
    i18nKey: string;
    backendTarget: BackendTarget | null;
    group: SpeciesGroup;
}

export type SpeciesGroup = 'popular' | 'rodents' | 'birds' | 'reptiles' | 'exotic' | 'farm';

export interface SpeciesGroupConfig {
    id: SpeciesGroup;
    i18nKey: string;
    emoji: string;
}

export const speciesGroups: SpeciesGroupConfig[] = [
    { id: 'popular', i18nKey: 'species_group_popular', emoji: '⭐' },
    { id: 'rodents', i18nKey: 'species_group_rodents', emoji: '🐹' },
    { id: 'birds', i18nKey: 'species_group_birds', emoji: '🐦' },
    { id: 'reptiles', i18nKey: 'species_group_reptiles', emoji: '🦎' },
    { id: 'exotic', i18nKey: 'species_group_exotic', emoji: '🦔' },
    { id: 'farm', i18nKey: 'species_group_farm', emoji: '🐴' },
];

export const species: SpeciesEntry[] = [
    // Popular (shown as large buttons at the top)
    { id: 'dog', emoji: '🐕', i18nKey: 'species_dog', backendTarget: 'dog', group: 'popular' },
    { id: 'cat', emoji: '🐈', i18nKey: 'species_cat', backendTarget: 'cat', group: 'popular' },
    { id: 'bird', emoji: '🐦', i18nKey: 'species_bird', backendTarget: null, group: 'popular' },
    { id: 'hamster', emoji: '🐹', i18nKey: 'species_hamster', backendTarget: null, group: 'popular' },

    // Rodents
    { id: 'guinea_pig', emoji: '🐹', i18nKey: 'species_guinea_pig', backendTarget: null, group: 'rodents' },
    { id: 'rabbit', emoji: '🐇', i18nKey: 'species_rabbit', backendTarget: null, group: 'rodents' },
    { id: 'chinchilla', emoji: '🐭', i18nKey: 'species_chinchilla', backendTarget: null, group: 'rodents' },
    { id: 'rat', emoji: '🐀', i18nKey: 'species_rat', backendTarget: null, group: 'rodents' },
    { id: 'gerbil', emoji: '🐭', i18nKey: 'species_gerbil', backendTarget: null, group: 'rodents' },
    { id: 'ferret', emoji: '🦡', i18nKey: 'species_ferret', backendTarget: null, group: 'rodents' },

    // Birds
    { id: 'parrot', emoji: '🦜', i18nKey: 'species_parrot', backendTarget: null, group: 'birds' },
    { id: 'canary', emoji: '🐤', i18nKey: 'species_canary', backendTarget: null, group: 'birds' },
    { id: 'finch', emoji: '🐦', i18nKey: 'species_finch', backendTarget: null, group: 'birds' },
    { id: 'pigeon', emoji: '🕊️', i18nKey: 'species_pigeon', backendTarget: null, group: 'birds' },
    { id: 'chicken', emoji: '🐔', i18nKey: 'species_chicken', backendTarget: null, group: 'birds' },

    // Reptiles
    { id: 'turtle', emoji: '🐢', i18nKey: 'species_turtle', backendTarget: null, group: 'reptiles' },
    { id: 'snake', emoji: '🐍', i18nKey: 'species_snake', backendTarget: null, group: 'reptiles' },
    { id: 'lizard', emoji: '🦎', i18nKey: 'species_lizard', backendTarget: null, group: 'reptiles' },
    { id: 'gecko', emoji: '🦎', i18nKey: 'species_gecko', backendTarget: null, group: 'reptiles' },

    // Exotic
    { id: 'hedgehog', emoji: '🦔', i18nKey: 'species_hedgehog', backendTarget: null, group: 'exotic' },
    { id: 'sugar_glider', emoji: '🐿️', i18nKey: 'species_sugar_glider', backendTarget: null, group: 'exotic' },
    { id: 'fish', emoji: '🐟', i18nKey: 'species_fish', backendTarget: null, group: 'exotic' },
    { id: 'human', emoji: '👤', i18nKey: 'species_human', backendTarget: 'human', group: 'exotic' },

    // Farm
    { id: 'horse', emoji: '🐴', i18nKey: 'species_horse', backendTarget: null, group: 'farm' },
    { id: 'goat', emoji: '🐐', i18nKey: 'species_goat', backendTarget: null, group: 'farm' },
    { id: 'pig', emoji: '🐷', i18nKey: 'species_pig', backendTarget: null, group: 'farm' },
];

/** Get only the popular species (shown as large buttons) */
export function getPopularSpecies(): SpeciesEntry[] {
    return species.filter((s) => s.group === 'popular');
}

/** Get species by group (for expandable sections) */
export function getSpeciesByGroup(group: SpeciesGroup): SpeciesEntry[] {
    return species.filter((s) => s.group === group);
}

/** Check if a species is currently supported by the backend */
export function isSpeciesSupported(entry: SpeciesEntry): boolean {
    return entry.backendTarget !== null;
}
