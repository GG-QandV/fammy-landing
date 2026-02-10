'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function SupportCard() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSupport = async (tier: 'coffee' | 'mini' | 'core') => {
        setLoading(tier);
        try {
            const res = await fetch('/api/support/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    const tiers = [
        { id: 'coffee', name: t('support_coffee'), price: 5, desc: t('support_coffee_desc') },
        { id: 'mini', name: t('support_mini'), price: 25, desc: t('support_mini_desc') },
        { id: 'core', name: t('support_core'), price: 100, desc: t('support_core_desc') },
    ];

    return (
        <div className="max-w-5xl mx-auto text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {t('support_title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                {t('support_subtitle')}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className="bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 transition-colors"
                    >
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {tier.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            {tier.desc}
                        </p>
                        <div className="text-3xl font-bold text-purple-600 mb-4">
                            ${tier.price}
                        </div>
                        <button
                            onClick={() => handleSupport(tier.id as any)}
                            disabled={loading === tier.id}
                            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading === tier.id ? t('loading') : t('support_button')}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
