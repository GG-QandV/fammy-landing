"use client"
import { useState, useMemo } from "react"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import SupportCard from "@/components/landing/support-card"
import WaitlistCTA from "@/components/landing/waitlist-cta"
import { MiniFounder } from "@/components/landing/mini-founder"
import { functions, type FunctionId } from "@/lib/functions-config"
import type { SpeciesEntry } from "@/lib/species-config"
import { HeroV3 } from "@/components/landing-v3/hero-v3"
import { DesktopLayout } from "@/components/landing-v3/desktop-layout"
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
 * Phase 6: Full assembly with HeroV3 + DesktopLayout + CategoryAccordion + ToolSheet.
 */
export default function DraftPage() {
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
                    onSelect={(sp) => { setF2Species(sp); setF2Step(1) }}
                />
            ),
        },
        {
            id: 'search',
            i18nKey: 'step_search_food',
            content: f2Species ? (
                <StepSearch
                    species={f2Species}
                    onResult={(r) => { setF2Result(r); setF2Step(2) }}
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
                    onSelect={(sp) => { setF1Species(sp); setF1Step(1) }}
                />
            ),
        },
        {
            id: 'ingredients',
            i18nKey: 'step_search_food',
            content: f1Species ? (
                <StepIngredients
                    species={f1Species}
                    onSubmit={(ings) => { setF1Ingredients(ings); setF1Step(2) }}
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
                    onResult={(r) => { setF1Result(r); setF1Step(3) }}
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

    const sidebarContent = (
        <CategoryAccordion onSelectTool={handleToolSelect} />
    )

    const mainContent = (
        <>
            <HeroV3 onChooseTool={() => handleToolSelect('f2')} />

            {/* ToolSheet modals */}
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

            <div className="mt-12 space-y-0">
                <SupportCard />
                <WaitlistCTA />
                <MiniFounder />
            </div>
        </>
    )

    return (
        <>
            <Nav />
            <main className="min-h-screen">
                <DesktopLayout
                    sidebar={sidebarContent}
                    main={mainContent}
                />
            </main>
            <Footer />
        </>
    )
}
