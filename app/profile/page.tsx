'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfilePage() {
    const { user, isLoading, logout } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        {t('profile')}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {user.email}
                    </p>
                </div>

                <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">ID</span>
                        <span className="font-mono text-gray-900">{user.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tier</span>
                        <span className="font-medium text-navy">{user.tier}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Role</span>
                        <span className="font-medium text-gray-900">{user.role}</span>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={logout}
                        className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        {t('logout')}
                    </button>
                </div>
            </div>
        </div>
    );
}
