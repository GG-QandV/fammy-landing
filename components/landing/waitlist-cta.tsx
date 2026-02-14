'use client';

import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function WaitlistCTA() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError(t('waitlist_invalid_email'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setSuccess(true);
                setEmail('');
            } else {
                setError(t('waitlist_error'));
            }
        } catch (err) {
            setError(t('waitlist_network_error'));
        } finally {
            setLoading(false);
        }
    };

    const benefits = t('waitlist_benefits').split('|');

    if (success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-green-50 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                        {'\u2713 '}{t('thank_you_waitlist')}
                    </h3>
                    <p className="text-green-600 mb-4">
                        {t('waitlist_confirmation')}
                    </p>
                    <p className="text-sm text-green-500">
                        {t('waitlist_success_share')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <h2 className="text-3xl font-bold text-navy mb-4">
                {t('waitlist_cta_title')}
            </h2>
            <p className="text-lg text-grey mb-6">
                {t('waitlist_cta_subtitle')}
            </p>

            <div className="flex flex-col items-center gap-2 mb-8">
                {benefits.map((b, i) => (
                    <span key={i} className="text-sm text-navy/80">
                        {'\u2713 '}{b}
                    </span>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-6 py-3 rounded-lg border border-light-grey bg-white text-navy focus:border-navy/40 focus:outline-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-navy hover:opacity-90 text-white font-semibold rounded-lg transition-opacity disabled:opacity-50"
                >
                    {loading ? t('loading') : t('waitlist_cta_button')}
                </button>
            </form>

            {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
            )}

            <p className="mt-4 text-xs text-grey/60">
                {t('waitlist_privacy')}
            </p>
        </div>
    );
}
