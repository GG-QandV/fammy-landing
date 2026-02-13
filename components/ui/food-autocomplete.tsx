'use client';
import { useLanguage } from '../../context/LanguageContext';

import { useState, useEffect, useRef } from 'react';

interface Food {
    id: string;
    name: string;
}

interface Props {
    onSelect: (food: Food) => void;
    placeholder?: string;
}

export default function FoodAutocomplete({ onSelect, placeholder = 'Search for a food...' }: Props) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Food[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { language } = useLanguage();
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/f2/foods?q=${encodeURIComponent(query)}&lang=${language}&lang=${language}`);
                const data = await response.json();
                setResults(data.foods || []);
                setIsOpen(true);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleSelect = (food: Food) => {
        setQuery(food.name);
        setIsOpen(false);
        setSelectedIndex(-1);
        onSelect(food);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full">
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="h-14 w-full px-4 py-3 border border-light-grey rounded-lg bg-white focus:border-navy/40 focus:outline-none"
                data-testid="food-autocomplete-input"
            />

            {isLoading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin h-5 w-5 border-2 border-navy border-t-transparent rounded-full" />
                </div>
            )}

            {isOpen && results.length > 0 && (
                <div
                    ref={dropdownRef}
                    className="absolute z-10 w-full mt-1 bg-white border border-light-grey rounded-lg shadow-soft max-h-80 overflow-y-auto"
                >
                    {results.map((food, index) => (
                        <button
                            key={food.id}
                            onClick={() => handleSelect(food)}
                            className={`w-full px-4 py-2 text-left hover:bg-sky ${index === selectedIndex ? 'bg-sky' : ''
                                }`}
                            data-testid={`food-option-${index}`}
                        >
                            {food.name}
                        </button>
                    ))}
                </div>
            )}

            {isOpen && results.length === 0 && !isLoading && query.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-light-grey rounded-lg shadow-soft p-4 text-grey text-center">
                    No foods found
                </div>
            )}
        </div>
    );
}
