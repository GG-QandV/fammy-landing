'use client';

import { useLanguage } from '../context/LanguageContext';
import { Language } from '../lib/i18n';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ua', label: 'Українська', flag: '🇺🇦' },
];

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full p-1 shadow-sm">
            {LANGUAGES.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === lang.code
                        ? 'bg-gray-900 text-white shadow-md scale-105'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                    title={lang.label}
                >
                    <span className="mr-1">{lang.flag}</span>
                    <span className="hidden sm:inline">{lang.code.toUpperCase()}</span>
                </button>
            ))}
        </div>
    );
}
