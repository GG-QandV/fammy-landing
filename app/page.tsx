'use client';

import { useState, useEffect } from 'react';
import F2Form from '../components/F2Form';
import ResultCard from '../components/ResultCard';
import GateModal from '../components/GateModal';
import { getSupabaseBrowserClient } from '../lib/supabaseClient';
import CountdownTimer from '../components/CountdownTimer';
import { getOrCreateAnonId } from '../lib/anonId';
import FeatureSelector from '../components/FeatureSelector';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../context/LanguageContext';

interface CheckResult {
    toxicityLevel: 'safe' | 'caution' | 'moderate' | 'high' | 'critical' | 'deadly';
    toxicityName: string;
    explanation: string;
    severity: number;
}

export default function HomePage() {
    const [result, setResult] = useState<CheckResult | null>(null);
    const [foodName, setFoodName] = useState<string>('');
    const [showGate, setShowGate] = useState(false);
    const [anonId, setAnonId] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancel' | null>(null);
    const [selectedFeature, setSelectedFeature] = useState<'f1' | 'f2' | null>(null);

    const { t, language } = useLanguage();

    // Launch date: 45 days from now (March 22, 2026)
    const launchDate = new Date('2026-03-22T12:00:00Z');

    useEffect(() => {
        // Initialize anon_id cookie on mount
        const id = getOrCreateAnonId();
        setAnonId(id);

        // Check for authenticated user
        const supabase = getSupabaseBrowserClient();
        supabase.auth.getSession().then(({ data }: any) => {
            setUserId(data.session?.user.id || null);
        });

        // Check for payment status in URL
        const params = new URLSearchParams(window.location.search);
        if (params.get('payment') === 'success') {
            setPaymentStatus('success');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (params.get('payment') === 'cancel') {
            setPaymentStatus('cancel');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSubmit = async (data: { target: string; foodId: string; foodName: string }) => {
        try {
            // Get promo token from localStorage if exists
            const promoToken = typeof window !== 'undefined' ? localStorage.getItem(`promo_token_${anonId}`) : null;

            const response = await fetch('/api/f2/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(promoToken ? { 'x-promo-token': promoToken } : {})
                },
                body: JSON.stringify({ target: data.target, foodId: data.foodId, lang: language }),
            });

            if (response.status === 403) {
                const error = await response.json();
                if (error.code === 'LIMIT_REACHED') {
                    setShowGate(true);
                    return;
                }
            }

            if (!response.ok) {
                throw new Error('Failed to check food');
            }

            const responseData = await response.json();
            setResult(responseData.result);
            setFoodName(data.foodName);
        } catch (error) {
            console.error('Check error:', error);
            alert('Failed to check food safety. Please try again.');
        }
    };

    const handleEmailSubmit = async (email: string) => {
        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, provider: 'email' }),
            });

            if (!response.ok) {
                throw new Error('Failed to join waitlist');
            }

            alert('Thanks for joining! We\'ll notify you when unlimited access is ready.');
            setShowGate(false);
        } catch (error) {
            console.error('Waitlist error:', error);
            alert('Failed to join waitlist. Please try again.');
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-b from-gray-50 to-white">
            {!selectedFeature ? (
                <FeatureSelector
                    onSelect={setSelectedFeature}
                    onPromoClick={() => setShowGate(true)}
                />
            ) : (
                <>
                    {/* Header for switching */}
                    <header className="w-full max-w-4xl flex justify-between items-center mb-8 animate-fade-in">
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-black text-gray-900">fammy<span className="text-primary-600">.pet</span></span>
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                {selectedFeature === 'f1' ? `🧪 ${t('f1_title')}` : `🚫 ${t('f2_title')}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSelector />
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 underline underline-offset-4 transition-colors"
                            >
                                {t('switch_function')}
                            </button>
                        </div>
                    </header>

                    {/* Payment Notifications */}
                    {paymentStatus === 'success' && (
                        <div className="fixed top-8 z-50 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
                            <span className="mr-2">✅</span>
                            <span>Payment successful! You now have **unlimited access** to {selectedFeature?.toUpperCase()} checks.</span>
                            <button onClick={() => setPaymentStatus(null)} className="ml-4 font-bold">×</button>
                        </div>
                    )}
                    {paymentStatus === 'cancel' && (
                        <div className="fixed top-8 z-50 bg-amber-100 border border-amber-400 text-amber-700 px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
                            <span className="mr-2">⚠️</span>
                            <span>Payment cancelled. You can still use your daily free checks.</span>
                            <button onClick={() => setPaymentStatus(null)} className="ml-4 font-bold">×</button>
                        </div>
                    )}

                    <div className="max-w-4xl w-full space-y-8 animate-slide-up">
                        {/* Countdown Timer */}
                        <CountdownTimer targetDate={launchDate} title="🚀 Product Launch In" />

                        {selectedFeature === 'f2' ? (
                            <>
                                {/* Hero section F2 */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                                        {t('food_safety_title')}
                                    </h1>
                                    <p className="text-xl text-gray-600 dark:text-gray-300">
                                        {t('food_safety_desc')}
                                    </p>
                                </div>

                                {/* F2 Form */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                                    <F2Form onSubmit={handleSubmit} />
                                </div>

                                {/* Result Card */}
                                {result && (
                                    <ResultCard result={result} foodName={foodName} />
                                )}
                            </>
                        ) : (
                            <>
                                {/* Hero section F1 (Placeholder) */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white uppercase tracking-tight text-primary-600">
                                        {t('nutrient_analysis_title')}
                                    </h1>
                                    <p className="text-xl text-gray-600 dark:text-gray-300">
                                        {t('nutrient_analysis_desc')}
                                    </p>
                                    <div className="p-12 bg-primary-50 rounded-3xl border-2 border-dashed border-primary-200 text-primary-600 flex flex-col items-center">
                                        <span className="text-6xl mb-4">🔬</span>
                                        <p className="font-bold">We are calibrating our nutrition labs...</p>
                                        <p className="text-sm mt-2 opacity-70 italic">Expected launch: Q2 2026</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Gate Modal */}
                        <GateModal
                            isOpen={showGate}
                            onClose={() => setShowGate(false)}
                            onEmailSubmit={handleEmailSubmit}
                            anonId={anonId}
                            userId={userId}
                        />
                    </div>
                </>
            )}
        </main>
    );
}
