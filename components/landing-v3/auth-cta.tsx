'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export function AuthCTA() {
    const { user, isLoading } = useAuth();
    const { t } = useLanguage();

    if (isLoading) {
        return <div className="h-12 w-32 animate-pulse rounded-full bg-gray-200 mx-auto mt-8 mb-12"></div>;
    }

    if (user) {
        return (
            <div className="hidden md:flex justify-center mt-8 mb-12">
                <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                    {/* User Avatar Placeholder */}
                    <img src="/icons/user-circle.svg" alt="Profile" className="w-5 h-5 invert" />
                    <span>{t('profile')}</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="hidden md:flex flex-col items-center justify-center gap-3 mt-8 mb-4 px-4 w-full">
            <Link
                href="/login"
                className="flex items-center justify-center w-full max-w-[356px] min-h-[52px] rounded-[20px] bg-[#546a8c] hover:bg-[#435570] px-8 text-xl font-medium text-white transition-colors opacity-50 hover:opacity-100"
            >
                <img src="/icons/user-circle.svg" alt="" className="w-6 h-6 mr-2 invert" />
                {t('login_button')}
            </Link>
            <Link
                href="/register"
                className="flex items-center justify-center w-full max-w-[356px] min-h-[52px] rounded-[20px] border border-[#546a8c]/40 bg-transparent px-8 text-xl font-medium text-[#5c5c54] hover:bg-black/5 transition-colors"
            >
                <img src="/icons/user-circle-plus.svg" alt="" className="w-6 h-6 mr-2 opacity-70" />
                {t('register_button')}
            </Link>
        </div>
    );
}
