'use client';

import { useLanguage } from '../../../context/LanguageContext';
import Link from 'next/link';

export default function CancelPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-md w-full text-center shadow-lg">
                <div className="text-6xl mb-4">😔</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('support_cancel_title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t('support_cancel_desc')}
                </p>
                <Link 
                    href="/"
                    className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                    {t('back_home')}
                </Link>
            </div>
        </div>
    );
}
