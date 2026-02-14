"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "../../context/LanguageContext"

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
              {t("founders_lifetime")} — {t("lifetime_price")}
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
            className="h-14 rounded-xl bg-cream px-10 text-base font-semibold text-dark-navy transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {t('lifetime_button')}
          </button>
          <p className="text-xs text-white/50">
            {t('lifetime_button_sub')}
          </p>
          <p className="text-xs text-cream/60">
            {t('lifetime_guarantee')}
          </p>
        </div>

      </div>
    </section>
  )
}
