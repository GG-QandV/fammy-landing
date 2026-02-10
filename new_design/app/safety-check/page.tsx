"use client"

import React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"

type ResultStatus = "safe" | "caution" | "danger"
interface CheckResult {
  name: string
  status: ResultStatus
  note: string
}

const toxicityDb: Record<
  string,
  Record<string, { status: ResultStatus; note: string }>
> = {
  dog: {
    "chocolate": { status: "danger", note: "Toxic! Contains theobromine. Lethal dose from 100 mg/kg body weight." },
    "onion": { status: "danger", note: "Destroys red blood cells, causes anemia even in small doses." },
    "avocado": { status: "danger", note: "Persin is toxic to dogs. Pit is a choking hazard." },
    "grapes": { status: "danger", note: "Can cause acute kidney failure. Even one grape is dangerous." },
    "xylitol": { status: "danger", note: "Extremely toxic. Causes rapid insulin release and liver failure." },
    "garlic": { status: "danger", note: "Contains thiosulfate. Toxic in all forms -- raw, cooked, powder." },
    "rice": { status: "safe", note: "Non-toxic. Safe in normal quantities." },
    "chicken": { status: "safe", note: "Non-toxic. Cooked chicken is completely safe." },
    "carrot": { status: "safe", note: "Non-toxic. Can be given raw or cooked." },
    "banana": { status: "safe", note: "Non-toxic in moderate amounts." },
    "apple": { status: "caution", note: "Flesh is safe. Seeds contain amygdalin (cyanide) -- always remove." },
    "milk": { status: "caution", note: "Not toxic, but many dogs are lactose intolerant." },
  },
  cat: {
    "chocolate": { status: "danger", note: "Extremely toxic! Cats are even more sensitive to theobromine than dogs." },
    "onion": { status: "danger", note: "Very toxic. Even onion powder is dangerous to cats." },
    "avocado": { status: "danger", note: "Persin is dangerous for cats. Avoid completely." },
    "grapes": { status: "danger", note: "Kidney failure -- even from a single grape or raisin." },
    "lily": { status: "danger", note: "All parts of lily plants are extremely toxic to cats. Can be fatal." },
    "garlic": { status: "danger", note: "Five times more toxic to cats than to dogs." },
    "rice": { status: "safe", note: "Non-toxic, but has no nutritional value for cats." },
    "chicken": { status: "safe", note: "Non-toxic and beneficial." },
    "tuna": { status: "caution", note: "In large quantities -- risk of mercury poisoning." },
    "milk": { status: "caution", note: "Not toxic per se, but most adult cats are lactose intolerant." },
    "apple": { status: "caution", note: "Small pieces are safe, seeds are toxic." },
    "banana": { status: "safe", note: "Non-toxic. Most cats won't eat it though." },
  },
}

function getResult(animal: "dog" | "cat", query: string): CheckResult | null {
  const db = toxicityDb[animal]
  const key = query.toLowerCase().trim()
  if (!key) return null
  const found = db[key]
  if (found) return { name: query, ...found }
  return { name: query, status: "caution", note: "No data in our database for this item. Exercise caution." }
}

const verdictConfig = {
  safe: {
    bg: "bg-emerald-50",
    fullBg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    label: "SAFE",
    description: "This food is safe for your pet",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-emerald-500">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
        <path d="M15 24l6 6 12-14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  caution: {
    bg: "bg-amber-50",
    fullBg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    label: "CAUTION",
    description: "Be careful with this food",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-amber-500">
        <path d="M24 6L4 42h40L24 6z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M24 20v10M24 34v2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
  danger: {
    bg: "bg-red-50",
    fullBg: "bg-red-100",
    border: "border-red-300",
    text: "text-red-800",
    label: "TOXIC",
    description: "Dangerous for your pet!",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-red-600">
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
        <path d="M16 16l16 16M32 16L16 32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
  },
}

export default function SafetyCheckPage() {
  const [animal, setAnimal] = useState<"dog" | "cat">("dog")
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<CheckResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleCheck = useCallback(() => {
    if (!query.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResult(getResult(animal, query))
      setLoading(false)
    }, 800)
  }, [animal, query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCheck()
    }
  }

  const handleReset = () => {
    setResult(null)
    setQuery("")
  }

  return (
    <div className="flex min-h-screen flex-col bg-sage lg:items-center lg:justify-center lg:p-8">
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-sage bg-card px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2 text-coral">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium">{"Back"}</span>
        </Link>
        <span className="font-display text-sm font-bold text-coral">{"Safety Check"}</span>
        <div className="w-12" />
      </header>

      {/* Floating card */}
      <div className="flex flex-1 flex-col bg-card lg:max-h-[90vh] lg:w-full lg:max-w-[600px] lg:flex-initial lg:overflow-y-auto lg:rounded-2xl lg:shadow-deep">
        {/* Desktop header */}
        <div className="hidden items-center justify-between border-b border-border px-8 py-5 lg:flex">
          <Link href="/" className="flex items-center gap-2 text-coral transition-opacity hover:opacity-70">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium">{"Home"}</span>
          </Link>
          <span className="font-display text-base font-bold text-coral">{"Safety Check"}</span>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-4 py-6 lg:px-8 lg:py-8">
          {/* Animal toggle -- LARGEST control element */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setAnimal("dog"); setResult(null) }}
              className={`flex h-16 items-center justify-center gap-3 rounded-xl border-2 text-base font-semibold transition-all active:scale-[0.97] lg:h-[80px] lg:text-lg ${
                animal === "dog"
                  ? "border-coral bg-coral/5 text-coral"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-1.5 2-1.5M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-1.5-2-1.5M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.42 11.247A8 8 0 1019.58 11.247" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {"Dog"}
            </button>
            <button
              type="button"
              onClick={() => { setAnimal("cat"); setResult(null) }}
              className={`flex h-16 items-center justify-center gap-3 rounded-xl border-2 text-base font-semibold transition-all active:scale-[0.97] lg:h-[80px] lg:text-lg ${
                animal === "cat"
                  ? "border-coral bg-coral/5 text-coral"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 22c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.13 13.25L3.5 3.5l4.5 4M17.87 13.25L20.5 3.5l-4.5 4M9.5 17v.5M14.5 17v.5M11.25 18.75h1.5L12 19.5l-.75-.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {"Cat"}
            </button>
          </div>

          {/* Search input -- directly under toggle */}
          <div className="mt-5">
            <label htmlFor="safety-input" className="sr-only">{"Check food safety"}</label>
            <div className="flex gap-2">
              <input
                id="safety-input"
                type="text"
                placeholder="Type a food item..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); if (result) setResult(null) }}
                onKeyDown={handleKeyDown}
                className="h-[60px] flex-1 rounded-xl border border-border bg-background px-4 text-lg font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-coral focus:ring-2 focus:ring-coral/15"
              />
              <button
                type="button"
                onClick={handleCheck}
                disabled={!query.trim() || loading}
                className="flex h-[60px] shrink-0 items-center justify-center gap-2 rounded-xl bg-coral px-6 text-sm font-semibold text-accent-foreground transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40"
              >
                {loading ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                    <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                ) : (
                  "Check"
                )}
              </button>
            </div>
          </div>

          {/* Result verdict -- fills all remaining space */}
          {result && (
            <div className={`mt-6 flex flex-1 flex-col items-center justify-center rounded-2xl border-2 ${verdictConfig[result.status].border} ${verdictConfig[result.status].fullBg} p-8 text-center transition-all`}>
              <div className="mb-4">
                {verdictConfig[result.status].icon}
              </div>
              <span className={`font-display text-2xl font-bold ${verdictConfig[result.status].text}`}>
                {verdictConfig[result.status].label}
              </span>
              <p className={`mt-1 text-sm font-medium ${verdictConfig[result.status].text} opacity-70`}>
                {verdictConfig[result.status].description}
              </p>
              <div className="mt-4 w-full max-w-sm rounded-xl bg-card/80 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {result.name}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {result.note}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="mt-6 text-sm font-medium text-muted-foreground underline decoration-muted-foreground/30 underline-offset-4 transition-colors hover:text-foreground"
              >
                {"Check another"}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!result && (
            <div className="mt-10 flex flex-1 flex-col items-center justify-center text-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-border" aria-hidden="true">
                <path d="M32 8l16 8v12c0 12-8 22-16 26-8-4-16-14-16-26V16l16-8z" stroke="currentColor" strokeWidth="2" />
              </svg>
              <p className="mt-4 max-w-[240px] text-sm text-muted-foreground">
                {"Type any food item above to check if it\u2019s safe for your pet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
