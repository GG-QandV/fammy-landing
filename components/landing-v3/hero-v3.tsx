'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeroV3Props {
    onChooseTool?: () => void;
    className?: string;
}

export function HeroV3({ onChooseTool, className }: HeroV3Props) {
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

    const handleChooseTool = () => {
        if (onChooseTool) {
            onChooseTool();
        } else {
            const el = document.getElementById('category-accordion');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section className={cn('relative w-full pt-8 pb-4 text-center lg:pt-20 lg:pb-12', className)}>
            <div className="mx-auto max-w-2xl px-5">
                <h1 className="font-display text-[2rem] leading-tight font-bold text-foreground sm:text-4xl lg:text-5xl">
                    {t('food_safety_title')}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
                    {t('food_safety_desc')}
                </p>

                <Button
                    size="lg"
                    className="mt-8 h-14 px-8 text-base"
                    onClick={handleChooseTool}
                >
                    {t('choose_tool')}
                </Button>

                {/* Promo code */}
                <div className="mt-8 rounded-xl bg-muted/30 border p-4 max-w-sm mx-auto">
                    <p className="text-sm font-medium mb-2">{t('have_promo')}</p>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={promoCode}
                            onChange={(e) => { setPromoCode(e.target.value); setPromoStatus('idle'); }}
                            placeholder={t('promo_placeholder')}
                            className="h-10"
                        />
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-10 px-4"
                            onClick={handlePromoSubmit}
                            disabled={promoStatus === 'loading' || !promoCode.trim()}
                        >
                            {promoStatus === 'loading' ? '...' : t('apply_promo')}
                        </Button>
                    </div>
                    {promoStatus === 'success' && (
                        <p className="mt-2 text-sm text-emerald-600 font-medium">{t('promo_success')}</p>
                    )}
                    {promoStatus === 'expired' && (
                        <p className="mt-2 text-sm text-red-600 font-medium">{t('promo_expired')}</p>
                    )}
                    {promoStatus === 'invalid' && (
                        <p className="mt-2 text-sm text-red-600 font-medium">{t('promo_invalid')}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
