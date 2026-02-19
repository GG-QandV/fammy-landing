'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { authApi, InvitationPreviewDTO } from '../../../lib/authApi';
import Link from 'next/link';

export default function InvitePage() {
    const params = useParams();
    const token = params.token as string;
    const { user, isLoading } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();

    const [invitation, setInvitation] = useState<InvitationPreviewDTO | null>(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        const fetchInvitation = async () => {
            try {
                const data = await authApi.getInvitation(token);
                setInvitation(data);
            } catch (err) {
                setError(t('invitation_invalid'));
            } finally {
                setPageLoading(false);
            }
        };

        if (token) {
            fetchInvitation();
        }
    }, [token, t]);

    const handleAccept = async () => {
        setAccepting(true);
        setError('');
        try {
            await authApi.acceptInvitation(token);
            setSuccess(t('invitation_success'));
            // Redirect after short delay
            setTimeout(() => {
                router.push('/profile');
            }, 2000);
        } catch (err: any) {
            setError(err.message || t('invitation_error'));
            setAccepting(false);
        }
    };

    if (pageLoading || isLoading) {
        return <div className="flex min-h-screen items-center justify-center">{t('loading')}</div>;
    }

    if (!invitation) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center text-red-600 font-medium">
                    {error || t('invitation_invalid')}
                </div>
            </div>
        );
    }

    // Check if user is logged in with correct email
    // Check if user is logged in


    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg text-center">

                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {t('invitation_title')}
                </h2>

                <div className="my-6">
                    <p className="text-gray-600">
                        {t('invitation_desc')}:
                    </p>
                    <p className="mt-2 text-xl font-bold text-navy">
                        {invitation.householdName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        From: {invitation.inviterEmail}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Role: {invitation.role}
                    </p>
                </div>

                {success ? (
                    <div className="rounded-md bg-green-50 p-4 text-green-700">
                        {success}
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {user ? (
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Logged in as <span className="font-semibold">{user.email}</span>
                                </p>
                                <button
                                    onClick={handleAccept}
                                    disabled={accepting}
                                    className="w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-50"
                                >
                                    {accepting ? t('loading') : t('invitation_accept')}
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: implementing auth logout then redirect back here?
                                        // router.push('/login?redirect=...')
                                    }}
                                    className="text-xs text-gray-500 hover:text-navy underline"
                                >
                                    Switch account
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 mb-4">
                                    {t('login_desc')}
                                </p>
                                <Link
                                    href={`/login?redirect=/invite/${token}`}
                                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    {t('invitation_login_to_accept')}
                                </Link>
                                <Link
                                    href={`/register?redirect=/invite/${token}`}
                                    className="block w-full rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
                                >
                                    {t('invitation_register_to_accept')}
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
