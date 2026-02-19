'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';

import { Suspense } from 'react';

function LoginContent() {
    const { login, isLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            router.push(redirect); // Redirect to original destination
        } catch (err: any) {
            setError(t('error_login_failed'));
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="mx-auto flex w-fit items-center gap-1 font-inter font-black text-dark-navy">
                        <span className="text-3xl">fammy</span>
                        <span className="text-3xl text-coral">.</span>
                        <span className="text-3xl text-seawave">pet</span>
                    </Link>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                        {t('login_title')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {t('login_desc')}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                {t('email_label')}
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-navy sm:text-sm sm:leading-6 px-3"
                                placeholder={t('email_placeholder')}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                {t('password_label')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-navy sm:text-sm sm:leading-6 px-3"
                                placeholder={t('password_label')}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="group relative flex w-full justify-center rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? t('loading') : t('login_button')}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <Link href="/forgot-password" className="font-medium text-navy hover:text-navy/80">
                            {t('forgot_password')}
                        </Link>
                        <Link
                            href={redirect !== '/' ? `/register?redirect=${redirect}` : "/register"}
                            className="font-medium text-navy hover:text-navy/80"
                        >
                            {t('no_account')} {t('register_title')}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
