'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function AuthButtons() {
    const { user, isLoading, logout } = useAuth();
    const { t } = useLanguage();

    if (isLoading) {
        return <div className="h-[34px] w-20 animate-pulse rounded-full bg-gray-200"></div>;
    }

    if (user) {
        return (
            <div className="flex h-[34px] items-center gap-2 bg-white-card/80 p-1 pl-2 rounded-full backdrop-blur-sm border border-light-grey logo-shadow">
                <Link
                    href="/profile"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-navy hover:bg-navy/90 transition-colors"
                    title={user.email}
                >
                    <img src="/icons/user-circle.svg" alt="Profile" className="w-4 h-4 invert" />
                </Link>
                <button
                    onClick={logout}
                    className="hidden text-xs font-medium text-gray-600 hover:text-navy sm:block pr-2"
                >
                    {t('logout')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-[34px] items-center gap-1 bg-white-card/80 p-1 rounded-full backdrop-blur-sm border border-light-grey logo-shadow">
            <Link
                href="/login"
                className="flex items-center justify-center h-6 w-8 rounded-full hover:bg-black/5 transition-colors"
                title={t('login_button') as string}
            >
                <img src="/icons/user-circle.svg" alt="Login" className="w-[18px] h-[18px] opacity-70" />
            </Link>
            <div className="w-[1px] h-4 bg-light-grey/50"></div>
            <Link
                href="/register"
                className="flex items-center justify-center h-6 w-8 rounded-full hover:bg-black/5 transition-colors"
                title={t('register_button') as string}
            >
                <img src="/icons/user-circle-plus.svg" alt="Register" className="w-[18px] h-[18px] opacity-70" />
            </Link>
        </div>
    );
}
