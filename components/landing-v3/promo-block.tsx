"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function PromoBlock() {
    const { t } = useLanguage()
    const [promoCode, setPromoCode] = useState("")
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState("")

    const handleApply = async () => {
        if (!promoCode) return
        setStatus('loading')

        try {
            const res = await fetch('/api/promo/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode })
            })
            const data = await res.json()

            if (data.valid) {
                setStatus('success')
                setMessage(t('promo_success') || 'Промокод застосовано!')
            } else {
                setStatus('error')
                setMessage(data.error || t('promo_invalid') || 'Невідомий промокод')
            }
        } catch (err) {
            setStatus('error')
            setMessage(t('promo_error') || 'Помилка мережі')
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto mt-12 mb-16 p-6 rounded-3xl bg-[#f8f8f2] border border-[#e8e8e0] shadow-sm">
            <h3 className="text-center font-semibold text-[#5c5c54] mb-4">
                {t('have_promo') || 'Маєте промокод?'}
            </h3>

            <div className="flex gap-2">
                <Input
                    placeholder={t('enter_promo') || 'Введіть код...'}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="rounded-xl border-[#dcdcd4] bg-white focus-visible:ring-[#546a8c]"
                    disabled={status === 'loading' || status === 'success'}
                />
                <Button
                    onClick={handleApply}
                    disabled={status === 'loading' || status === 'success' || !promoCode}
                    className="rounded-xl bg-[#546a8c] hover:bg-[#435570] text-white px-6"
                >
                    {status === 'loading' ? (
                        <Clock className="w-4 h-4 animate-spin" />
                    ) : (
                        t('apply_btn') || 'Застосувати'
                    )}
                </Button>
            </div>

            {status !== 'idle' && (
                <div className={cn(
                    "mt-3 flex items-center gap-2 text-sm justify-center",
                    status === 'success' ? "text-emerald-600" : "text-rose-500"
                )}>
                    {status === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{message}</span>
                </div>
            )}
        </div>
    )
}
