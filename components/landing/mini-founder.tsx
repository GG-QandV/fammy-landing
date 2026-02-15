"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "../../context/LanguageContext"

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSubmit: (email: string, giftEmail?: string) => void;
  t: (key: string) => string;
}

function EmailModal({ isOpen, onClose, onSkip, onSubmit, t }: EmailModalProps) {
  const [email, setEmail] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftEmail, setGiftEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t('invalid_email'));
      return;
    }
    if (isGift && (!giftEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(giftEmail))) {
      setError(t('invalid_email'));
      return;
    }
    onSubmit(email, isGift ? giftEmail : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <h3 className="text-xl font-bold text-navy mb-4">
          {t('lifetime_modal_title')}
        </h3>
        <p className="text-grey mb-6">
          {t('lifetime_modal_desc')}
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          placeholder={t('email_placeholder')}
          className="w-full px-4 py-3 border border-light-grey rounded-lg mb-2 bg-white text-navy"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
            className="w-4 h-4 rounded border-light-grey"
          />
          <span className="text-navy">{t('lifetime_gift_checkbox')}</span>
        </label>

        {isGift && (
          <div className="mt-3">
            <label className="block text-sm text-grey mb-1">
              {t('lifetime_gift_label')}
            </label>
            <input
              type="email"
              value={giftEmail}
              onChange={(e) => { setGiftEmail(e.target.value); setError(''); }}
              placeholder={t('lifetime_gift_placeholder')}
              className="w-full px-4 py-3 border border-light-grey rounded-lg bg-white text-navy"
            />
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-4 bg-navy hover:opacity-90 text-white rounded-lg font-semibold text-lg"
          >
            {t('lifetime_button_get')}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-grey hover:text-navy"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function useCountdown(targetDate: Date) {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setMounted(true)
    function calc() {
      const diff = Math.max(0, targetDate.getTime() - Date.now())
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return { ...timeLeft, mounted }
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-3xl font-bold tabular-nums text-cream lg:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-white/60">
        {label}
      </span>
    </div>
  )
}

export function MiniFounder() {
  const { t } = useLanguage()
  const [targetDate] = useState(() => new Date("2026-03-22T00:00:00"))
  const { days, hours, minutes, seconds, mounted } = useCountdown(targetDate)

  const features = t('lifetime_features').split('|')
  const remaining = 87 // TODO: from DB

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSupport = () => {
    setShowEmailModal(true);
  };

  const createCheckout = async (email?: string, giftEmail?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/founders-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productCode: 'founder',
          email: email || undefined,
          giftEmail: giftEmail || undefined,
          successUrl: `${window.location.origin}/support/success`,
          cancelUrl: `${window.location.origin}/support/cancel`,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        console.error('Checkout error:', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null as any);
    }
  };

  const handleSkipEmail = () => {
    setShowEmailModal(false);
    createCheckout();
  };

  const handleSubmitEmail = (email: string, giftEmail?: string) => {
    setShowEmailModal(false);
    createCheckout(email, giftEmail);
  };

  return (
    <section className="bg-dark-navy px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-6xl">

        {/* Top row: text + timer */}
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-16 mb-12">
          {/* Text */}
          <div className="flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream">
              {t("founders_program")}
            </p>
            <h2 className="font-display text-2xl font-bold text-white lg:text-3xl mb-1">
              {t("lifetime_modal_title")} — {t("lifetime_price")}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-white/70">
              {t("founders_desc")}
            </p>
          </div>

          {/* Timer + slots */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <TimerBlock value={days} label="days" />
              <span className="text-2xl font-light text-white/30">:</span>
              <TimerBlock value={hours} label="hrs" />
              <span className="text-2xl font-light text-white/30">:</span>
              <TimerBlock value={minutes} label="min" />
              <span className="text-2xl font-light text-white/30">:</span>
              <TimerBlock value={seconds} label="sec" />
            </div>
            <div className="flex gap-6 text-xs text-white/50">
              <span>{t('lifetime_slots_label')} <strong className="text-cream">{remaining}/100</strong></span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-2xl">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-white/80">
              <span className="text-cream mt-0.5">{'\u2713'}</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <p className="text-xs text-white/40 mb-10 max-w-xl">
          {t('lifetime_comparison')}
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSupport}
            disabled={loading}
            className="h-14 rounded-xl bg-cream px-10 text-base font-semibold text-dark-navy transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? t('loading') : t('lifetime_button')}
          </button>
          <p className="text-xs text-white/50">
            {t('lifetime_button_sub')}
          </p>
          {/* <p className="text-xs text-cream/60">
            {t('lifetime_guarantee')}
          </p> */}
        </div>

        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSkip={handleSkipEmail}
          onSubmit={handleSubmitEmail}
          t={t as any}
        />

      </div>
    </section>
  )
}
