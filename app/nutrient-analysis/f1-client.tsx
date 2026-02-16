"use client"

import { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { functions } from "@/lib/functions-config"
import type { SpeciesEntry } from "@/lib/species-config"
import { StepSpecies } from "@/components/landing-v3/f2-tool/step-species"
import { StepIngredients, type Ingredient } from "@/components/landing-v3/f1-tool/step-ingredients"
import { StepAnalyze, type F1Result } from "@/components/landing-v3/f1-tool/step-analyze"
import { StepResult } from "@/components/landing-v3/f1-tool/step-result"

/**
 * F1: Nutrient Analysis — standalone SEO page.
 * Full F1 wizard inline (not in a Sheet).
 */
export default function NutrientAnalysisClient() {
    const { t } = useLanguage()
    const func = functions.f1

    const [species, setSpecies] = useState<SpeciesEntry | null>(null)
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [result, setResult] = useState<F1Result | null>(null)
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
                            <StepIngredients
                                species={species}
                                onSubmit={(ings) => { setIngredients(ings); setStep(2) }}
                            />
                        </div>
                    )}
                    {step === 2 && species && ingredients.length > 0 && (
                        <div className="space-y-4">
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← {t('back')}
                            </button>
                            <StepAnalyze
                                species={species}
                                ingredients={ingredients}
                                onResult={(r) => { setResult(r); setStep(3) }}
                            />
                        </div>
                    )}
                    {step === 3 && result && (
                        <div className="space-y-4">
                            <button
                                onClick={() => { setResult(null); setStep(2) }}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                ← {t('back')}
                            </button>
                            <StepResult result={result} ingredients={ingredients} />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
