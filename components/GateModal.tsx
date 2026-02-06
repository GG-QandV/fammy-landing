'use client';

import { useState } from 'react';
import { getSupabaseBrowserClient } from '../lib/supabaseClient';
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

    const { t } = useLanguage();

    if (!isOpen) return null;

    const supabase = getSupabaseBrowserClient();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            alert('Please enter a valid email');
            return;
        }

        setIsSubmitting(true);
        try {
            // Send magic link via Supabase Auth
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;

            // Also add to waitlist
            await onEmailSubmit(email);

            alert('Check your email for the magic link!');
            setEmail('');
        } catch (error) {
            console.error('Email auth error:', error);
            alert('Failed to send magic link. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error) {
            console.error(`${provider} OAuth error:`, error);
            alert(`Failed to login with ${provider}. Please try again.`);
        }
    };

    const handleDonate = async () => {
        setIsDonating(true);
        try {
            const response = await fetch('/api/donate/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    anonId,
                    userId,
                    email: email || undefined
                }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Donation error:', error);
            alert('Failed to start payment. Please try again.');
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
                // Store promo token
                localStorage.setItem(`promo_token_${anonId}`, data.token);
                alert(`Success! Promo code applied. You now have ${data.limit} checks.`);
                onClose();
                // Reload to refresh limits
                window.location.reload();
            } else {
                alert(data.error || 'Invalid promo code');
            }
        } catch (error) {
            console.error('Promo error:', error);
            alert('Failed to validate promo code.');
        } finally {
            setIsValidatingPromo(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-slide-up overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        {t('limit_reached_title')}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">×</button>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {t('limit_reached_desc')}
                </p>

                {/* Donation Button */}
                <button
                    onClick={handleDonate}
                    disabled={isDonating}
                    className="w-full mb-8 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black rounded-2xl shadow-xl shadow-orange-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 group"
                >
                    <span className="text-lg uppercase tracking-wide">{t('unlock_unlimited')}</span>
                    <span className="text-sm font-normal opacity-90 italic">{t('one_time_donation')}</span>
                    {isDonating && <span className="absolute right-6 animate-spin">⌛</span>}
                </button>

                <div className="space-y-6">
                    {/* Promo Code System */}
                    <div className="border-t border-gray-100 pt-6">
                        {!showPromo ? (
                            <button
                                onClick={() => setShowPromo(true)}
                                className="w-full text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                            >
                                🎟️ {t('have_promo')}
                            </button>
                        ) : (
                            <form onSubmit={handlePromoSubmit} className="flex gap-2 animate-fade-in">
                                <input
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    placeholder="PROMO"
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 uppercase font-mono tracking-widest"
                                />
                                <button
                                    type="submit"
                                    disabled={isValidatingPromo}
                                    className="px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black disabled:bg-gray-400 transition-colors shadow-lg"
                                >
                                    {isValidatingPromo ? '...' : t('apply_promo')}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Email / Waitlist Section */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-white text-gray-400 uppercase tracking-widest font-bold">{t('or_waitlist')}</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailSubmit} className="space-y-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('enter_email')}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            data-testid="gate-email-input"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:bg-gray-300 transition-all shadow-md"
                        >
                            {isSubmitting ? '...' : t('notify_me')}
                        </button>
                    </form>

                    {/* Social Login */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <button
                            onClick={() => handleOAuthLogin('google')}
                            className="flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
                            title="Google Login"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform font-bold text-gray-700">G</span>
                        </button>
                        <button
                            onClick={() => handleOAuthLogin('facebook')}
                            className="flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
                            title="Facebook Login"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform font-bold text-gray-700">F</span>
                        </button>
                        <button
                            onClick={() => handleOAuthLogin('twitter')}
                            className="flex items-center justify-center p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
                            title="X (Twitter) Login"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform font-bold text-gray-700">𝕏</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
