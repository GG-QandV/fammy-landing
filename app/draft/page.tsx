"use client"
import { useState, useMemo } from "react"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import SupportCard from "@/components/landing/support-card"
import WaitlistCTA from "@/components/landing/waitlist-cta"
import { MiniFounder } from "@/components/landing/mini-founder"
import { useLanguage } from "@/context/LanguageContext"
import { functions, type FunctionId, type FunctionEntry } from "@/lib/functions-config"
import type { SpeciesEntry } from "@/lib/species-config"
import { CategoryAccordion } from "@/components/landing-v3/category-accordion"
import { ToolSheet, type ToolSheetStep } from "@/components/landing-v3/tool-sheet"
import { ComingSoon } from "@/components/landing-v3/shared/coming-soon"
import { StepSpecies } from "@/components/landing-v3/f2-tool/step-species"
import { StepSearch, type F2Result } from "@/components/landing-v3/f2-tool/step-search"
import { StepResult as F2StepResult } from "@/components/landing-v3/f2-tool/step-result"
import { StepIngredients, type Ingredient } from "@/components/landing-v3/f1-tool/step-ingredients"
import { StepAnalyze, type F1Result } from "@/components/landing-v3/f1-tool/step-analyze"
import { StepResult as F1StepResult } from "@/components/landing-v3/f1-tool/step-result"

/**
 * Draft landing page — development-only route.
 * Uses reusable components from production (Nav, Footer, Support, Waitlist, Founder)
 * and new v3 components from landing-v3/.
 * 
 * Phase 5: CategoryAccordion → ToolSheet (F1/F2) or ComingSoon (F3-F6).
 */
export default function DraftPage() {
    const { t } = useLanguage()

    // Tool selection state
    const [activeTool, setActiveTool] = useState<FunctionId | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    // F2 state
    const [f2Species, setF2Species] = useState<SpeciesEntry | null>(null)
    const [f2Result, setF2Result] = useState<F2Result | null>(null)
    const [f2Step, setF2Step] = useState(0)

    // F1 state
    const [f1Species, setF1Species] = useState<SpeciesEntry | null>(null)
    const [f1Ingredients, setF1Ingredients] = useState<Ingredient[]>([])
    const [f1Result, setF1Result] = useState<F1Result | null>(null)
    const [f1Step, setF1Step] = useState(0)

    const handleToolSelect = (funcId: FunctionId) => {
        setActiveTool(funcId)

        // Reset state for new tool
        if (funcId === 'f2') {
            setF2Species(null)
            setF2Result(null)
            setF2Step(0)
        } else if (funcId === 'f1') {
            setF1Species(null)
            setF1Ingredients([])
            setF1Result(null)
            setF1Step(0)
        }

        setSheetOpen(true)
    }

    // F2 wizard steps
    const f2Steps: ToolSheetStep[] = useMemo(() => [
        {
            id: 'species',
            i18nKey: 'step_select_species',
            content: (
                <StepSpecies
                    onSelect={(sp) => {
                        setF2Species(sp)
                        setF2Step(1)
                    }}
                />
            ),
        },
        {
            id: 'search',
            i18nKey: 'step_search_food',
            content: f2Species ? (
                <StepSearch
                    species={f2Species}
                    onResult={(r) => {
                        setF2Result(r)
                        setF2Step(2)
                    }}
                />
            ) : null,
        },
        {
            id: 'result',
            i18nKey: 'step_result',
            content: f2Result ? <F2StepResult result={f2Result} /> : null,
        },
    ], [f2Species, f2Result])

    // F1 wizard steps
    const f1Steps: ToolSheetStep[] = useMemo(() => [
        {
            id: 'species',
            i18nKey: 'step_select_species',
            content: (
                <StepSpecies
                    onSelect={(sp) => {
                        setF1Species(sp)
                        setF1Step(1)
                    }}
                />
            ),
        },
        {
            id: 'ingredients',
            i18nKey: 'step_search_food',
            content: f1Species ? (
                <StepIngredients
                    species={f1Species}
                    onSubmit={(ings) => {
                        setF1Ingredients(ings)
                        setF1Step(2)
                    }}
                />
            ) : null,
        },
        {
            id: 'analyze',
            i18nKey: 'step_result',
            content: f1Species && f1Ingredients.length > 0 ? (
                <StepAnalyze
                    species={f1Species}
                    ingredients={f1Ingredients}
                    onResult={(r) => {
                        setF1Result(r)
                        setF1Step(3)
                    }}
                />
            ) : null,
        },
        {
            id: 'result',
            i18nKey: 'step_result',
            content: f1Result ? (
                <F1StepResult result={f1Result} ingredients={f1Ingredients} />
            ) : null,
        },
    ], [f1Species, f1Ingredients, f1Result])

    const activeFunc = activeTool ? functions[activeTool] : null

    return (
        <>
            <Nav />
            <main className="min-h-screen">
                {/* Phase 6: HeroV3 will go here */}
                <section className="px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-navy">
                        🚧 Draft Landing v3
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('choose_tool')}
                    </p>
                </section>

                {/* Category Accordion */}
                <section className="max-w-md mx-auto px-4 pb-12">
                    <CategoryAccordion onSelectTool={handleToolSelect} />
                </section>

                {/* ToolSheet for F1 & F2 */}
                {activeFunc && activeFunc.available && activeTool === 'f2' && (
                    <ToolSheet
                        open={sheetOpen}
                        onOpenChange={setSheetOpen}
                        func={activeFunc}
                        steps={f2Steps}
                        currentStep={f2Step}
                        onStepChange={setF2Step}
                    />
                )}

                {activeFunc && activeFunc.available && activeTool === 'f1' && (
                    <ToolSheet
                        open={sheetOpen}
                        onOpenChange={setSheetOpen}
                        func={activeFunc}
                        steps={f1Steps}
                        currentStep={f1Step}
                        onStepChange={setF1Step}
                    />
                )}

                {/* ComingSoon for F3-F6 — rendered inside a simple Sheet */}
                {activeFunc && !activeFunc.available && (
                    <ToolSheet
                        open={sheetOpen}
                        onOpenChange={setSheetOpen}
                        func={activeFunc}
                        steps={[{
                            id: 'coming-soon',
                            i18nKey: 'coming_soon',
                            content: <ComingSoon func={activeFunc} />,
                        }]}
                        currentStep={0}
                        onStepChange={() => { }}
                    />
                )}

                <SupportCard />
                <WaitlistCTA />
                <MiniFounder />
            </main>
            <Footer />
        </>
    )
}
