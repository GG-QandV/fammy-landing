"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { functions } from "@/lib/functions-config"
import type { SpeciesEntry } from "@/lib/species-config"
import { StepSpecies } from "@/components/landing-v3/f2-tool/step-species"
import { StepIngredients, type Ingredient } from "@/components/landing-v3/f1-tool/step-ingredients"
import { StepAnalyze, type F1Result } from "@/components/landing-v3/f1-tool/step-analyze"
import { StepResult } from "@/components/landing-v3/f1-tool/step-result"
import { UsageCounter } from "@/components/ui/usage-counter"

/**
 * F1: Nutrient Analysis — standalone SEO page.
 * Full F1 wizard inline (not in a Sheet).
 */
export default function NutrientAnalysisClient() {
    const { t } = useLanguage()
    const func = functions.f1

    const [species] = useState<SpeciesEntry | null>({ id: 'dog', emoji: '🐕', i18nKey: 'species_dog', backendTarget: 'dog', group: 'popular' })
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [result, setResult] = useState<F1Result | null>(null)
    const [step, setStep] = useState(1) // Start with ingredients

    return (
        <>
            <Nav />
            <main className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center text-center">
                <div className="w-full max-w-lg mx-auto flex flex-col items-start">
                    <Link
                        href="/draft"
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-500 border border-slate-200 rounded-full hover:text-[#4A5A7A] hover:border-[#4A5A7A]/30 hover:bg-slate-50 transition-all mb-8 shadow-sm bg-white/50 backdrop-blur-sm group active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        {t('back_to_home' as any)}
                    </Link>
                </div>

                <h1 className="text-3xl font-bold flex flex-col items-center gap-3">
                    <img
                        src={`/icons/tool-${func.id}.svg`}
                        alt=""
                        className="w-12 h-12 opacity-80"
                    />
                    {t(func.i18nKey as any)}
                </h1>

                <div className="w-full max-w-lg mx-auto text-left">
                    <p className="mt-4 text-muted-foreground">
                        {t(func.i18nDescKey as any)}
                    </p>
                    {/* Usage counter — shows remaining checks on page load */}
                    <div className="mt-3">
                        <UsageCounter feature="f1" />
                    </div>
                </div>

                <div className="mt-8 w-full max-w-xl">
                    {step === 1 && species && (
                        <div className="text-left mx-auto max-w-lg">
                            <StepIngredients
                                species={species}
                                hideSpeciesIndicator
                                onSubmit={(ings: any) => { setIngredients(ings); setStep(2) }}
                            />
                        </div>
                    )}
                    {step === 2 && species && ingredients.length > 0 && (
                        <div className="text-left mx-auto max-w-lg">
                            <StepAnalyze
                                species={species}
                                ingredients={ingredients}
                                onResult={(r: any) => {
                                    setResult(r);
                                    setStep(3);
                                }}
                            />
                        </div>
                    )}
                    {step === 3 && result && (
                        <div className="space-y-6 mx-auto max-w-lg">
                            <div className="flex">
                                <button
                                    onClick={() => { setResult(null); setStep(1) }}
                                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 transition-all active:scale-95 shadow-sm bg-white/50 backdrop-blur-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    {t('back' as any)}
                                </button>
                            </div>
                            <div className="text-left">
                                <StepResult result={result} ingredients={ingredients} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}
