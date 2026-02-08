'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onEmailSubmit: (email: string) => Promise<void>;
    anonId: string;
    userId: string | null;
}

export default function GateModal({ isOpen, onClose, onEmailSubmit, anonId, userId }: Props) {
    const [email, setEmail] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDonating, setIsDonating] = useState(false);
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);
    const [showPromo, setShowPromo] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const { t } = useLanguage();

    if (!isOpen) return null;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setIsSubmitting(true);
        try {
            await onEmailSubmit(email);
            setSubmitted(true);
            setEmail('');
        } catch (error) {
            console.error('Waitlist error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFoundersPack = async () => {
        setIsDonating(true);
        try {
            const response = await fetch('/api/donate/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ anonId, userId, email: email || undefined }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout error:', error);
        } finally {
            setIsDonating(false);
        }
    };

    const handlePromoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!promoCode) return;

        setIsValidatingPromo(true);
        try {
            const response = await fetch('/api/promo/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ promoCode, anonId }),
            });
            const data = await response.json();
            if (data.success && data.token) {
                localStorage.setItem(`promo_token_${anonId}`, data.token);
                onClose();
                window.location.reload();
            }
        } catch (error) {
            console.error('Promo error:', error);
        } finally {
            setIsValidatingPromo(false);
        }
    };

    // Thank You State (after waitlist submit)
    if (submitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
                <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md mx-auto p-6 sm:p-8 animate-slide-up">
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-3">✉️</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('thank_you_waitlist')}</h2>
                        <p className="text-gray-600 text-sm">{t('thank_you_upsell')}</p>
                    </div>
                    
                    <button
                        onClick={handleFoundersPack}
                        disabled={isDonating}
                        className="w-full mb-3 px-5 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        {isDonating ? '...' : t('founders_button')}
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="w-full px-5 py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                    >
                        {t('close') || 'Close'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg mx-auto p-6 sm:p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{t('limit_reached_title')}</h2>
                    <button 
                        onClick={onClose} 
                        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600 text-2xl rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-6">{t('limit_reached_desc')}</p>

                {/* Two Options - Stacked on Mobile */}
                <div className="space-y-4 mb-6">
                    
                    {/* Option A: Waitlist (Free) */}
                    <div className="border border-gray-200 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📬</span>
                            <h3 className="font-semibold text-gray-900">{t('waitlist_header')}</h3>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">{t('waitlist_desc')}</p>
                        
                        <form onSubmit={handleEmailSubmit} className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                data-testid="gate-email-input"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                                {isSubmitting ? '...' : t('notify_me')}
                            </button>
                        </form>
                    </div>

                    {/* Option B: Founders Pack (Paid) */}
                    <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">⭐</span>
                            <h3 className="font-semibold text-gray-900">{t('founders_header')}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{t('founders_desc')}</p>
                        <p className="text-amber-700 font-semibold text-sm mb-4">{t('founders_price')}</p>
                        
                        <button
                            onClick={handleFoundersPack}
                            disabled={isDonating}
                            className="w-full px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            data-testid="founders-pack-btn"
                        >
                            {isDonating ? '...' : t('founders_button')}
                        </button>
                    </div>
                </div>

                {/* Promo Code (Collapsed) */}
                <div className="border-t border-gray-100 pt-4">
                    {!showPromo ? (
                        <button
                            onClick={() => setShowPromo(true)}
                            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            🎟️ {t('have_promo') || 'Have a promo code?'}
                        </button>
                    ) : (
                        <form onSubmit={handlePromoSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                placeholder="PROMO"
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase tracking-wider"
                            />
                            <button
                                type="submit"
                                disabled={isValidatingPromo}
                                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg disabled:opacity-50"
                            >
                                {isValidatingPromo ? '...' : 'OK'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
