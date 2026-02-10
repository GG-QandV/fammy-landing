'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

type TierId = 'basic_support' | 'pro_support' | 'founder';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSkip: () => void;
    onSubmit: (email: string) => void;
    t: (key: string) => string;
}

function EmailModal({ isOpen, onClose, onSkip, onSubmit, t }: EmailModalProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(t('invalid_email'));
            return;
        }
        onSubmit(email);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('support_email_title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t('support_email_desc')}
                </p>
                
                <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder={t('email_placeholder')}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={onSkip}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {t('support_skip_discount')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
                    >
                        {t('support_get_discount')}
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default function SupportCard() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState<TierId | null>(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [pendingTier, setPendingTier] = useState<TierId | null>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.fammy.pet';

    const createCheckout = async (tier: TierId, email?: string) => {
        setLoading(tier);
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/billing/founders-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productCode: tier,
                    email: email || undefined,
                    successUrl: `${window.location.origin}/support/success`,
                    cancelUrl: `${window.location.origin}/support/cancel`,
                }),
            });
            const data = await res.json();
            if (data.success && data.data?.url) {
                window.location.href = data.data.url;
            } else {
                console.error('Checkout error:', data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    const handleSupport = (tier: TierId) => {
        setPendingTier(tier);
        setShowEmailModal(true);
    };

    const handleSkipEmail = () => {
        setShowEmailModal(false);
        if (pendingTier) {
            createCheckout(pendingTier);
        }
    };

    const handleSubmitEmail = (email: string) => {
        setShowEmailModal(false);
        if (pendingTier) {
            createCheckout(pendingTier, email);
        }
    };

    const tiers = [
        { id: 'basic_support' as TierId, name: t('support_coffee'), desc: t('support_coffee_desc'), price: 5, emoji: '☕' },
        { id: 'pro_support' as TierId, name: t('support_mini'), desc: t('support_mini_desc'), price: 25, emoji: '⭐' },
        { id: 'founder' as TierId, name: t('support_core'), desc: t('support_core_desc'), price: 100, emoji: '🚀' },
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
                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-colors ${
                            tier.id === 'founder'
                                ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-500'
                        }`}
                    >
                        <div className="text-4xl mb-3">{tier.emoji}</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {tier.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            {tier.desc}
                        </p>
                        <div className="text-3xl font-bold text-purple-600 mb-4">
                            €{tier.price}
                        </div>
                        <button
                            onClick={() => handleSupport(tier.id)}
                            disabled={loading === tier.id}
                            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading === tier.id ? t('loading') : t('support_button')}
                        </button>
                    </div>
                ))}
            </div>

            <EmailModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSkip={handleSkipEmail}
                onSubmit={handleSubmitEmail}
                t={t as any}
            />
        </div>
    );
}
