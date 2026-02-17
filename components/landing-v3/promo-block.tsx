'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface PromoBlockProps {
    className?: string;
}

export function PromoBlock({ className }: PromoBlockProps) {
    const { t } = useLanguage();
    const [promoCode, setPromoCode] = useState('');
    const [promoStatus, setPromoStatus] = useState<'idle' | 'loading' | 'success' | 'expired' | 'invalid'>('idle');

    const handlePromoSubmit = async () => {
        if (!promoCode.trim()) return;
        setPromoStatus('loading');
        try {
            const res = await fetch('/api/promo/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode.trim() }),
            });
            const data = await res.json();
            if (data.success) {
                setPromoStatus('success');
                if (data.token) {
                    document.cookie = `promo_token=${data.token}; path=/; max-age=86400`;
                }
            } else if (data.error === 'expired') {
                setPromoStatus('expired');
            } else {
                setPromoStatus('invalid');
            }
        } catch {
            setPromoStatus('invalid');
        }
    };

    return (
        <div className={cn('bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-inner', className)}>
            <div className="mx-auto max-w-sm">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                    {t('have_promo')}
                </p>
                <div className="flex gap-2">
                    <Input
                        placeholder={t('promo_placeholder')}
                        value={promoCode}
                        onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoStatus('idle');
                        }}
                        className="h-12 rounded-xl bg-white dark:bg-zinc-950"
                    />
                    <Button
                        onClick={handlePromoSubmit}
                        disabled={promoStatus === 'loading'}
                        className="h-12 px-6 rounded-xl"
                    >
                        {promoStatus === 'loading' ? '...' : t('apply_promo')}
                    </Button>
                </div>

                {promoStatus === 'success' && (
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-green-600 font-medium animate-in fade-in slide-in-from-top-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {t('promo_success')}
                    </p>
                )}
                {promoStatus === 'expired' && (
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-amber-600 font-medium animate-in fade-in slide-in-from-top-1">
                        <Clock className="w-4 h-4" />
                        {t('promo_expired')}
                    </p>
                )}
                {promoStatus === 'invalid' && (
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4" />
                        {t('promo_invalid')}
                    </p>
                )}
            </div>
        </div>
    );
}
