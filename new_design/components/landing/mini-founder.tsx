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
      <span className="font-display text-3xl font-bold tabular-nums text-coral lg:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function MiniFounder() {
  const { t } = useLanguage()
  const [targetDate] = useState(() => new Date("2026-03-22T00:00:00"))
  const { days, hours, minutes, seconds, mounted } = useCountdown(targetDate)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="border-y border-border bg-card px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Desktop: single row  |  Mobile: stacked */}
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-0">
          {/* Text — 40% */}
          <div className="flex-shrink-0 lg:w-[40%]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-coral">
              {t("founders_program")}
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
              {t("founders_lifetime")}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {t("founders_desc")}
            </p>
          </div>

          {/* Timer — 30% */}
          <div className="flex items-center justify-center gap-4 lg:w-[30%]">
            <TimerBlock value={days} label="days" />
            <span className="text-2xl font-light text-border">:</span>
            <TimerBlock value={hours} label="hrs" />
            <span className="text-2xl font-light text-border">:</span>
            <TimerBlock value={minutes} label="min" />
            <span className="text-2xl font-light text-border">:</span>
            <TimerBlock value={seconds} label="sec" />
          </div>

          {/* Email — 30% */}
          <div className="w-full lg:w-[30%]">
            {submitted ? (
              <div className="flex h-14 items-center justify-center rounded-xl bg-sage text-sm font-medium text-sage-deep">
                {t("thank_you_waitlist")}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 flex-1 rounded-xl border border-border bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-coral focus:ring-2 focus:ring-coral/20"
                />
                <button
                  type="submit"
                  className="h-14 shrink-0 rounded-xl bg-coral px-6 text-sm font-semibold text-accent-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t("waitlist_cta_button")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
