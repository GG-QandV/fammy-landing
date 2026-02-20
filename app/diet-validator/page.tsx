"use client"

import React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useBackInterceptor } from "@/lib/hooks/use-back-handler"

type ResultStatus = "safe" | "caution" | "danger"
interface IngredientResult {
  name: string
  status: ResultStatus
  note: string
}

const compositionDb: Record<
  string,
  Record<string, { status: ResultStatus; note: string }>
> = {
  dog: {
    "rice": { status: "safe", note: "Well absorbed. Good source of carbohydrates and B vitamins." },
    "chicken": { status: "safe", note: "Excellent source of protein, iron and zinc." },
    "carrot": { status: "safe", note: "Beta-carotene, fiber, vitamins A and K." },
    "banana": { status: "safe", note: "Potassium, vitamin B6, magnesium. Give in moderation." },
    "milk": { status: "caution", note: "Calcium and protein, but many dogs are lactose intolerant." },
    "apple": { status: "caution", note: "Vitamins A and C. Seeds contain cyanide -- remove them." },
    "salmon": { status: "safe", note: "Rich in omega-3 fatty acids. Always serve cooked." },
    "egg": { status: "safe", note: "Complete protein with all essential amino acids." },
  },
  cat: {
    "rice": { status: "caution", note: "Carbs and vitamin B, but cats are obligate carnivores." },
    "chicken": { status: "safe", note: "Ideal source of animal protein, taurine and iron." },
    "carrot": { status: "caution", note: "Vitamin A when cooked, but cats don't need vegetables." },
    "tuna": { status: "caution", note: "Omega-3 and protein. Not as main food -- mercury risk." },
    "milk": { status: "caution", note: "Calcium present, but most adult cats are lactose intolerant." },
    "apple": { status: "caution", note: "Small pieces are safe, seeds are toxic." },
    "salmon": { status: "safe", note: "Excellent omega-3 source. Must be cooked thoroughly." },
    "egg": { status: "safe", note: "Good protein source. Always serve fully cooked." },
  },
}

function getResults(animal: "dog" | "cat", ingredients: string[]): IngredientResult[] {
  const db = compositionDb[animal]
  return ingredients.map((name) => {
    const key = name.toLowerCase().trim()
    const found = db[key]
    if (found) return { name, ...found }
    return { name, status: "caution" as const, note: "No data in our database yet." }
  })
}

const statusConfig = {
  safe: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    label: "SAFE",
    dot: "bg-emerald-500",
  },
  caution: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    label: "CAUTION",
    dot: "bg-amber-500",
  },
  danger: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    label: "DANGER",
    dot: "bg-red-500",
  },
}

export default function DietValidatorPage() {
  const [animal, setAnimal] = useState<"dog" | "cat">("dog")
  const [input, setInput] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [results, setResults] = useState<IngredientResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleBackPress = useCallback(() => {
    if (results.length > 0) {
      setResults([])
    }
  }, [results.length])

  useBackInterceptor(handleBackPress, results.length > 0)

  const handleAddIngredient = useCallback(() => {
    const value = input.trim()
    if (value && !ingredients.includes(value)) {
      setIngredients((prev) => [...prev, value])
      setInput("")
      setResults([])
    }
  }, [input, ingredients])

  const handleRemoveIngredient = useCallback((item: string) => {
    setIngredients((prev) => prev.filter((i) => i !== item))
    setResults([])
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddIngredient()
    }
  }

  const handleAnalyze = useCallback(() => {
    if (ingredients.length === 0) return
    setLoading(true)
    setTimeout(() => {
      setResults(getResults(animal, ingredients))
      setLoading(false)
    }, 1200)
  }, [animal, ingredients])

  return (
    <div className="flex min-h-screen flex-col bg-sage lg:items-center lg:justify-center lg:p-8">
      {/* Mobile header */}
      <header className="flex items-center justify-between border-b border-sage bg-card px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2 text-teal">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium">{"Back"}</span>
        </Link>
        <span className="font-display text-sm font-bold text-teal">{"Diet Validator"}</span>
        <div className="w-12" />
      </header>

      {/* Floating card (desktop) / Full screen (mobile) */}
      <div className="flex flex-1 flex-col bg-card lg:max-h-[90vh] lg:w-full lg:max-w-[600px] lg:flex-initial lg:overflow-y-auto lg:rounded-2xl lg:shadow-deep">
        {/* Desktop header inside card */}
        <div className="hidden items-center justify-between border-b border-border px-8 py-5 lg:flex">
          <Link href="/" className="flex items-center gap-2 text-teal transition-opacity hover:opacity-70">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium">{"Home"}</span>
          </Link>
          <span className="font-display text-base font-bold text-teal">{"Diet Validator"}</span>
          <div className="w-12" />
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          {/* Animal toggle - grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setAnimal("dog"); setResults([]) }}
              className={`flex h-16 items-center justify-center gap-3 rounded-xl border-2 text-base font-semibold transition-all active:scale-[0.97] lg:h-[72px] ${animal === "dog"
                  ? "border-teal bg-teal/5 text-teal"
                  : "border-border bg-background text-muted-foreground hover:border-border hover:bg-muted"
                }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .137 1.217 1.5 2 2.5 2s2-1.5 2-1.5M14 5.172C14 3.782 15.577 2.679 17.5 3c2.823.47 4.113 6.006 4 7-.137 1.217-1.5 2-2.5 2s-2-1.5-2-1.5M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.42 11.247A8 8 0 1019.58 11.247" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              {"Dog"}
            </button>
            <button
              type="button"
              onClick={() => { setAnimal("cat"); setResults([]) }}
              className={`flex h-16 items-center justify-center gap-3 rounded-xl border-2 text-base font-semibold transition-all active:scale-[0.97] lg:h-[72px] ${animal === "cat"
                  ? "border-teal bg-teal/5 text-teal"
                  : "border-border bg-background text-muted-foreground hover:border-border hover:bg-muted"
                }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 22c4.97 0 9-2.686 9-6s-4.03-6-9-6-9 2.686-9 6 4.03 6 9 6z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.13 13.25L3.5 3.5l4.5 4M17.87 13.25L20.5 3.5l-4.5 4M9.5 17v.5M14.5 17v.5M11.25 18.75h1.5L12 19.5l-.75-.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {"Cat"}
            </button>
          </div>

          {/* Input section */}
          <div className="mt-6">
            <label htmlFor="ingredient-input" className="mb-2 block text-sm font-medium text-foreground">
              {"Ingredients"}
            </label>
            <div className="flex gap-2">
              <input
                id="ingredient-input"
                type="text"
                placeholder="e.g. chicken, rice, carrot..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-[60px] flex-1 rounded-xl border border-border bg-background px-4 text-lg font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground/40 focus:border-teal focus:ring-2 focus:ring-teal/15"
              />
              <button
                type="button"
                onClick={handleAddIngredient}
                disabled={!input.trim()}
                className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl border-2 border-teal text-teal transition-all hover:bg-teal hover:text-primary-foreground disabled:border-border disabled:text-muted-foreground disabled:hover:bg-transparent"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Ingredient chips */}
            {ingredients.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {ingredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal/8 px-3 py-1.5 text-sm font-medium text-teal"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(item)}
                      className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-teal/15"
                      aria-label={`Remove ${item}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {"Analysis Results"}
              </h3>
              {results.map((result) => {
                const config = statusConfig[result.status]
                return (
                  <div
                    key={result.name}
                    className={`rounded-xl border ${config.border} ${config.bg} p-4`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold capitalize text-foreground">
                        {result.name}
                      </span>
                      <span className={`flex items-center gap-1.5 text-xs font-bold uppercase ${config.text}`}>
                        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {result.note}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sticky Analyze Button (mobile) / Bottom of card (desktop) */}
        <div className="sticky bottom-0 border-t border-border bg-card/95 p-4 backdrop-blur-sm lg:relative lg:border-t lg:bg-card lg:p-6">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={ingredients.length === 0 || loading}
            className="flex h-14 w-full items-center justify-center rounded-xl bg-teal text-base font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              "Analyse"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
