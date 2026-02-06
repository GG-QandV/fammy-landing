'use client';

import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface Props {
    onSelect: (feature: 'f1' | 'f2') => void;
    onPromoClick: () => void;
}

export default function FeatureSelector({ onSelect, onPromoClick }: Props) {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 animate-fade-in">
            {/* Language Selector in the top right */}
            <div className="absolute top-8 right-8">
                <LanguageSelector />
            </div>

            <div className="max-w-4xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white">
                        fammy<span className="text-primary-600">.pet</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-medium">
                        {t('feature_select_title')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* F1: Nutrient Analysis */}
                    <button
                        onClick={() => onSelect('f1')}
                        className="group relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                            🧪
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('f1_title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {t('f1_desc')}
                        </p>
                        <div className="mt-6 px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {t('select_f1')}
                        </div>
                    </button>

                    {/* F2: Food Safety Checker */}
                    <button
                        onClick={() => onSelect('f2')}
                        className="group relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl hover:border-danger-500 transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-20 h-20 bg-danger-100 dark:bg-danger-900/30 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                            🚫
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('f2_title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {t('f2_desc')}
                        </p>
                        <div className="mt-6 px-6 py-2 bg-danger-600 text-white rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {t('select_f2')}
                        </div>
                    </button>
                </div>

                <div className="flex flex-col items-center pt-8 space-y-4">
                    <button
                        onClick={onPromoClick}
                        className="px-8 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-none flex items-center gap-3"
                    >
                        <span className="text-xl">🎟️</span>
                        <span>{t('have_promo')}</span>
                    </button>
                    <p className="text-gray-400 text-xs italic">
                        Join 50,000+ pet parents making safer choices every day.
                    </p>
                </div>
            </div>
        </div>
    );
}
