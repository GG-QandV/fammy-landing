'use client';

import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface FeatureSelectorProps {
    onSelect: (feature: 'f1' | 'f2') => void;
    onPromoClick: () => void;
}

export default function FeatureSelector({ onSelect, onPromoClick }: FeatureSelectorProps) {
    const { t } = useLanguage();

    return (
        <div className="w-full flex flex-col items-center py-8 animate-fade-in">
            <div className="w-full flex justify-end mb-4">
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
                    <button
                        onClick={() => onSelect('f1')}
                        className="group relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl hover:border-primary-500 transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                            🧪
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('f1_title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{t('f1_desc')}</p>
                    </button>

                    <button
                        onClick={() => onSelect('f2')}
                        className="group relative flex flex-col items-center p-8 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-3xl shadow-xl hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                            🚫
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t('f2_title')}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{t('f2_desc')}</p>
                    </button>
                </div>

                <button
                    onClick={onPromoClick}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                    <span>💳</span>
                    <span className="uppercase tracking-wider text-sm">{t('have_promo')}</span>
                </button>

                <p className="text-gray-400 text-sm">
                    Join 50,000+ pet parents making safer choices every day.
                </p>
            </div>
        </div>
    );
}
