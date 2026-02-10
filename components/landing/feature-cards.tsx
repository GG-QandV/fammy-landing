"use client"
import React from "react"
import { useLanguage } from "../../context/LanguageContext"

interface FeatureCardProps {
  title: string
  description: string
  feature: "f1" | "f2"
  icon: React.ReactNode
  accent: "teal" | "coral"
  onActivate: (feature: "f1" | "f2") => void
}

function FeatureCard({ title, description, feature, icon, accent, onActivate }: FeatureCardProps) {
  const { t } = useLanguage()
  const borderColor = accent === "teal" ? "border-teal/20" : "border-coral/20"
  const hoverBorder = accent === "teal" ? "hover:border-teal/40" : "hover:border-coral/40"
  const iconBg = accent === "teal" ? "bg-teal/8" : "bg-coral/8"
  const iconColor = accent === "teal" ? "text-teal" : "text-coral"
  const btnBg = accent === "teal" ? "bg-teal" : "bg-coral"

  const handleClick = () => {
    onActivate(feature)
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <button
      onClick={handleClick}
      className={`group flex w-full flex-col rounded-2xl border-2 ${borderColor} ${hoverBorder} bg-card p-8 shadow-deep transition-all duration-300 hover:scale-[1.02] lg:w-[45%] lg:p-10 text-left`}
    >
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold text-foreground lg:text-2xl">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground lg:text-base">
        {description}
      </p>
      <div className="mt-8">
        <span className={`inline-flex items-center gap-2 rounded-lg ${btnBg} px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform group-hover:translate-x-1`}>
          {t("open_tool")}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </button>
  )
}

interface FeatureCardsProps {
  onFeatureSelect?: (feature: "f1" | "f2") => void
}

export function FeatureCards({ onFeatureSelect }: FeatureCardsProps) {
  const { t } = useLanguage()
  
  const handleActivate = (feature: "f1" | "f2") => {
    onFeatureSelect?.(feature)
  }

  return (
    <section className="bg-alabaster px-6 py-20 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t("feature_mission")}
        </p>
        <h2 className="font-display text-3xl font-semibold text-teal lg:text-5xl">
          {t("feature_what_we_check")}
        </h2>

        <div className="mt-12 flex flex-col items-stretch gap-6 lg:mt-16 lg:flex-row lg:justify-between lg:gap-0">
          <FeatureCard
            title={t("f1_title")}
            description={t("f1_desc")}
            feature="f1"
            accent="teal"
            onActivate={handleActivate}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
                <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />

          <FeatureCard
            title={t("f2_title")}
            description={t("f2_desc")}
            feature="f2"
            accent="coral"
            onActivate={handleActivate}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  )
}
