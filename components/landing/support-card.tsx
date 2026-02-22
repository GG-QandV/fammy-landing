'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

type TierId = 'basic_support' | 'pro_support' | 'founder';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string, giftEmail?: string) => void;
    onSkip?: () => void;
    t: (key: string) => string;
    isOptional?: boolean;
}

function EmailModal({ isOpen, onClose, onSubmit, onSkip, t, isOptional }: EmailModalProps) {
    const [email, setEmail] = useState('');
    const [isGift, setIsGift] = useState(false);
    const [giftEmail, setGiftEmail] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!isOptional && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            setError(t('invalid_email'));
            return;
        }
        if (isGift && (!giftEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(giftEmail))) {
            setError(t('invalid_email'));
            return;
        }
        onSubmit(email, isGift ? giftEmail : undefined);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
                <h3 className="text-xl font-bold text-navy mb-4">
                    {t('support_email_title')}
                </h3>
                <p className="text-grey mb-6">
                    {t('support_email_desc')}
                </p>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder={isOptional ? t('email_placeholder_optional') : t('email_placeholder')}
                    className="w-full px-4 py-3 border border-light-grey rounded-lg mb-2 bg-white text-navy"
                />

                {!isOptional && (
                    <div className="mt-4 space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isGift}
                                    onChange={(e) => setIsGift(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-light-grey transition-all checked:bg-navy"
                                />
                                <svg className="pointer-events-none absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="text-navy font-medium">{t('gift_checkbox')}</span>
                        </label>

                        {isGift && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <label className="text-sm font-semibold text-grey ml-1">{t('gift_email_label')}</label>
                                <input
                                    type="email"
                                    value={giftEmail}
                                    onChange={(e) => { setGiftEmail(e.target.value); setError(''); }}
                                    placeholder={t('gift_email_placeholder')}
                                    className="w-full px-4 py-3 border border-light-grey rounded-lg bg-white text-navy focus:border-navy outline-none"
                                />
                            </div>
                        )}
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="mt-6 flex flex-col gap-3">
                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-3 bg-navy hover:opacity-90 text-white rounded-lg font-semibold shadow-sm transition-all active:scale-[0.98]"
                    >
                        {t('support_get_discount')}
                    </button>
                    {!isOptional && onSkip && (
                        <button
                            onClick={onSkip}
                            className="w-full px-4 py-3 text-grey hover:text-navy text-sm font-medium transition-colors"
                        >
                            {t('support_skip_discount')}
                        </button>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-grey hover:text-navy transition-colors h-8 w-8 flex items-center justify-center hover:bg-light-grey/20 rounded-full"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

    const createCheckout = async (tier: TierId, email?: string, giftEmail?: string) => {
        setLoading(tier);
        try {
            const res = await fetch(`/api/payments/founders-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productCode: tier,
                    email: email || undefined,
                    giftEmail: giftEmail || undefined,
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

    const handleSubmitEmail = (email: string, giftEmail?: string) => {
        setShowEmailModal(false);
        if (pendingTier) {
            createCheckout(pendingTier, email, giftEmail);
        }
    };

    const handleSkipEmail = () => {
        setShowEmailModal(false);
        if (pendingTier) {
            createCheckout(pendingTier);
        }
    };

    const tiers = [
        { id: 'basic_support' as TierId, name: t('support_coffee'), desc: t('support_coffee_desc'), price: 5, emoji: 'coffee' },
        { id: 'pro_support' as TierId, name: t('support_mini'), desc: t('support_mini_desc'), price: 25, emoji: 'rocket' },
        { id: 'founder' as TierId, name: t('support_core'), desc: t('support_core_desc'), price: 99, emoji: 'trophy' },
    ];

    return (
        <div className="max-w-5xl mx-auto text-center pt-[34px] pb-12">
            <h2 className="text-3xl font-bold text-navy mb-3 leading-tight">
                {t('support_title')}
            </h2>
            <p className="text-lg text-grey mb-[34px] leading-snug">
                {t('support_subtitle')}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                    <div
                        key={tier.id}
                        className={`bg-white rounded-xl p-6 border-2 transition-colors shadow-soft ${tier.id === 'founder'
                            ? 'border-navy/30 ring-2 ring-cream'
                            : 'border-light-grey hover:border-navy/20'
                            }`}
                    >
                        <div className="text-left">
                            <div className="flex justify-between items-center mb-4">
                                <div className="h-14 w-14 rounded-full bg-cream flex items-center justify-center text-navy shrink-0">
                                    {tier.emoji === 'coffee' && <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M80,56V24a8,8,0,0,1,16,0V56a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,120,64Zm32,0a8,8,0,0,0,8-8V24a8,8,0,0,0-16,0V56A8,8,0,0,0,152,64Zm96,56v8a40,40,0,0,1-37.51,39.91,96.59,96.59,0,0,1-27,40.09H208a8,8,0,0,1,0,16H40a8,8,0,0,1,0-16H64.54A96.3,96.3,0,0,1,32,136V88a8,8,0,0,1,8-8H208A40,40,0,0,1,248,120ZM48,136a80.27,80.27,0,0,0,80,80h0a80.27,80.27,0,0,0,80-80V96H48Zm184-16a24,24,0,0,0-24-24h-1.13A95.94,95.94,0,0,1,215,136l0,7.8A24,24,0,0,0,232,120Z"></path></svg>}
                                    {tier.emoji === 'rocket' && <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224ZM128,112a12,12,0,1,0-12-12A12,12,0,0,0,128,112Zm95.62,43.83-12.36,55.63a16,16,0,0,1-25.51,9.11L158.51,200h-61L70.25,220.57a16,16,0,0,1-25.51-9.11L32.38,155.83a16.09,16.09,0,0,1,3.32-13.71l28.56-34.26a123.07,123.07,0,0,1,8.57-36.67c12.9-32.34,36-52.63,45.37-59.85a16,16,0,0,1,19.6,0c9.34,7.22,32.47,27.51,45.37,59.85a123.07,123.07,0,0,1,8.57,36.67l28.56,34.26A16.09,16.09,0,0,1,223.62,155.83ZM99.43,184h57.14c21.12-37.54,25.07-73.48,11.74-106.88C156.55,49.7,136,31,128,24,120,31,99.45,49.7,87.69,77.12,74.36,110.52,78.31,146.46,99.43,184Zm-48,26.93L60,204.47l-8.93-10.72ZM207.14,155.83l-24.45-29.35A119.63,119.63,0,0,1,186,148.59L196,204.47l8.54-21.7Z"></path></svg>}
                                    {tier.emoji === 'trophy' && <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"></path></svg>}
                                </div>
                                <div className="flex flex-col items-end gap-2.5">
                                    {tier.id !== 'basic_support' && (
                                        <div className="flex items-center gap-1.5 bg-cream/30 py-1.5 px-3 rounded-lg border border-navy/5">
                                            <span className="text-base font-semibold text-navy/80 leading-tight">
                                                {t('support_gift_tagline')}
                                            </span>
                                            <svg width="18" height="18" viewBox="0 0 256 256" className="text-navy/80"><path d="M208,128v72a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><rect x="32" y="80" width="192" height="48" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><line x1="128" y1="80" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M176.79,31.21c9.34,9.34,9.89,25.06,0,33.82C159.88,80,128,80,128,80s0-31.88,15-48.79C151.73,21.32,167.45,21.87,176.79,31.21Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /><path d="M79.21,31.21c-9.34,9.34-9.89,25.06,0,33.82C96.12,80,128,80,128,80s0-31.88-15-48.79C104.27,21.32,88.55,21.87,79.21,31.21Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" /></svg>
                                        </div>
                                    )}
                                    {tier.id === 'founder' && (
                                        <p className="text-base text-coral line-through leading-tight">
                                            {t('support_core_compare')}
                                        </p>
                                    )}
                                    <div className="text-4xl font-bold text-dark-navy leading-tight">
                                        €{tier.price}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="text-xl font-bold text-navy">
                                    {tier.name}
                                </h3>
                            </div>
                            <p className="text-grey text-sm mb-[6px] min-h-[40px]">
                                {tier.desc}
                            </p>
                            {tier.id !== 'founder' && <div className="mb-[6px]" />}
                            <button
                                onClick={() => handleSupport(tier.id)}
                                disabled={loading === tier.id}
                                className="w-full px-6 py-3 bg-navy hover:opacity-90 text-white font-semibold rounded-lg transition-opacity disabled:opacity-50"
                            >
                                {loading === tier.id ? t('loading') : tier.id === 'founder' ? t('support_button_join') : t('support_button')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <EmailModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSubmit={handleSubmitEmail}
                onSkip={handleSkipEmail}
                t={t as any}
                isOptional={pendingTier === 'basic_support'}
            />
        </div>
    );
}
