'use client';

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function WaitlistCTA() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email');
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
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
                        {t('thank_you_waitlist')}
                    </h3>
                    <p className="text-green-600 dark:text-green-300">
                        Check your inbox for confirmation.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Join Early Access Waitlist
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Get 50% off when we launch. No spam, just one email.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold 
                             rounded-lg transition-colors disabled:opacity-50"
                >
                    {loading ? 'Joining...' : 'Join Waitlist'}
                </button>
            </form>

            {error && (
                <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
        </div>
    );
}
