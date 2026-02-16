"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { functions } from "@/lib/functions-config"
import type { SpeciesEntry } from "@/lib/species-config"
import { StepSpecies } from "@/components/landing-v3/f2-tool/step-species"
import { StepSearch, type F2Result } from "@/components/landing-v3/f2-tool/step-search"
import { StepResult } from "@/components/landing-v3/f2-tool/step-result"

/**
 * F2: Food Safety Check — standalone SEO page.
 * Full F2 wizard inline (not in a Sheet).
 */
export default function FoodSafetyCheckPage() {
    const { t } = useLanguage()
    const func = functions.f2

    const [species, setSpecies] = useState<SpeciesEntry | null>(null)
    const [result, setResult] = useState<F2Result | null>(null)
    const [step, setStep] = useState(0)

    return (
        <>
            <Nav />
            <main className="mx-auto max-w-2xl px-4 py-16">
                <h1 className="text-3xl font-bold">
                    <span className="mr-2">{func.emoji}</span>
                    {t(func.i18nKey as Parameters<typeof t>[0])}
                </h1>
                <p className="mt-2 text-muted-foreground">
                    {t(func.i18nDescKey as Parameters<typeof t>[0])}
                </p>

                <div className="mt-8">
                    {step === 0 && (
                        <StepSpecies
                            onSelect={(sp) => { setSpecies(sp); setStep(1) }}
                        />
                    )}
                    {step === 1 && species && (
                        <div className="space-y-4">
                            <button
                                onClick={() => setStep(0)}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← {t('back')}
                            </button>
                            <StepSearch
                                species={species}
                                onResult={(r) => { setResult(r); setStep(2) }}
                            />
                        </div>
                    )}
                    {step === 2 && result && (
                        <div className="space-y-4">
                            <button
                                onClick={() => { setResult(null); setStep(1) }}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← {t('back')}
                            </button>
                            <StepResult result={result} />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
