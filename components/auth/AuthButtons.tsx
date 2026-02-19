'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function AuthButtons() {
    const { user, isLoading, logout } = useAuth();
    const { t } = useLanguage();

    if (isLoading) {
        return <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200"></div>;
    }

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/profile"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white ring-2 ring-white hover:bg-navy/90"
                    title={user.email}
                >
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </Link>
                <button
                    onClick={logout}
                    className="hidden text-xs font-medium text-gray-600 hover:text-navy md:block"
                >
                    {t('logout')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-navy transition-colors hover:bg-navy/5"
            >
                {t('login_button')}
            </Link>
            <Link
                href="/register"
                className="rounded-full bg-navy px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-navy/90"
            >
                {t('register_button')}
            </Link>
        </div>
    );
}
