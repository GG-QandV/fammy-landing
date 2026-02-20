"use client"

import { useState, useMemo, useCallback } from "react"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { ArrowDown } from "lucide-react"
import SupportCard from "@/components/landing/support-card"
import WaitlistCTA from "@/components/landing/waitlist-cta"
import { MiniFounder } from "@/components/landing/mini-founder"
import { functions, type FunctionId, type CategoryId } from "@/lib/functions-config"
import type { SpeciesEntry } from "@/lib/species-config"
import { CategoryBayan } from "@/components/landing-v3/category-bayan"
import { AuthCTA } from "@/components/landing-v3/auth-cta"
import { CategorySheet } from "@/components/landing-v3/category-sheet"
import { PromoBlock } from "@/components/landing-v3/promo-block"
import { ToolSheet, type ToolSheetStep } from "@/components/landing-v3/tool-sheet"
import { ComingSoon } from "@/components/landing-v3/shared/coming-soon"
import { StepSpecies } from "@/components/landing-v3/f2-tool/step-species"
import { StepSearch, type F2Result } from "@/components/landing-v3/f2-tool/step-search"
import { StepResult as F2StepResult } from "@/components/landing-v3/f2-tool/step-result"
import { StepIngredients, type Ingredient } from "@/components/landing-v3/f1-tool/step-ingredients"
import { StepAnalyze, type F1Result } from "@/components/landing-v3/f1-tool/step-analyze"
import { StepResult as F1StepResult } from "@/components/landing-v3/f1-tool/step-result"
import { useLanguage } from "@/context/LanguageContext"
import { useBackInterceptor } from "@/lib/hooks/use-back-handler"
import { ExitPromptDialog } from "@/components/landing-v3/shared/exit-prompt-dialog"

/**
 * Main Landing Page (V3)
 * Clean 'Bayan' layout. Slogan -> Category Buttons -> Promo -> Support.
 */
export default function Home() {
  const { t } = useLanguage()

  // UI state
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null)
  const [categorySheetOpen, setCategorySheetOpen] = useState(false)
  const [activeTool, setActiveTool] = useState<FunctionId | null>(null)
  const [toolSheetOpen, setToolSheetOpen] = useState(false)
  const [exitPromptOpen, setExitPromptOpen] = useState(false)

  const handleHomeBack = useCallback(() => {
    setExitPromptOpen(true)
  }, [])

  // Перехватываем "Назад" на главной, только если все модалки закрыты
  useBackInterceptor(handleHomeBack, !toolSheetOpen && !categorySheetOpen && !exitPromptOpen)

  // F2 state
  const [f2Species, setF2Species] = useState<SpeciesEntry | null>(null)
  const [f2Result, setF2Result] = useState<F2Result | null>(null)
  const [f2Step, setF2Step] = useState(0)

  // F1 state
  const [f1Species, setF1Species] = useState<SpeciesEntry | null>(null)
  const [f1Ingredients, setF1Ingredients] = useState<Ingredient[]>([])
  const [f1Result, setF1Result] = useState<F1Result | null>(null)
  const [f1Step, setF1Step] = useState(0)

  const handleCategoryClick = (catId: CategoryId) => {
    setActiveCategory(catId)
    setCategorySheetOpen(true)
  }

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
    setToolSheetOpen(true)
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
  const f1DefaultSpecies: SpeciesEntry = { id: 'dog', emoji: '🐕', i18nKey: 'species_dog', backendTarget: 'dog', group: 'popular' }
  const f1Steps: ToolSheetStep[] = useMemo(() => [
    {
      id: 'ingredients',
      i18nKey: 'step_search_food',
      content: (
        <StepIngredients
          species={f1DefaultSpecies}
          hideSpeciesIndicator
          onSubmit={(ings) => { setF1Ingredients(ings); setF1Step(1) }}
        />
      ),
    },
    {
      id: 'analyze',
      i18nKey: 'step_result',
      content: f1Ingredients.length > 0 ? (
        <StepAnalyze
          species={f1DefaultSpecies}
          ingredients={f1Ingredients}
          onResult={(r) => { setF1Result(r); setF1Step(2) }}
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
  ], [f1Ingredients, f1Result])

  const activeFunc = activeTool ? functions[activeTool] : null

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Nav />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-5 pt-32 pb-4 text-left lg:pt-32 lg:pb-6">
          <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-[#2C3650] sm:text-6xl lg:text-7xl text-center">
            {t('all_in_one_app' as any)}
          </h1>
          <p className="mt-8 text-lg text-[#2C3650]/80 sm:text-xl lg:text-2xl max-w-2xl mx-auto text-center">
            {t('app_slogan_desc' as any)}
          </p>

          <div className="w-full max-w-xl mx-auto mt-12 mb-8 p-6 rounded-3xl bg-[#f8f8f2] border border-[#e8e8e0] shadow-sm">
            <CategoryBayan
              onSelectCategory={handleCategoryClick}
              activeCategory={activeCategory || undefined}
            />
          </div>

          <AuthCTA />
        </div>

        <div className="mx-auto max-w-4xl px-5 pb-24 relative">
          <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="animate-bounce cursor-pointer flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-2.5 border border-[#e8e8e0] shadow-md text-[#2C3650] pointer-events-auto hover:bg-white scale-95 transition-transform">
                <ArrowDown className="w-6 h-6" />
              </div>
            </div>
          </div>

          <PromoBlock />

          <div className="mt-8 space-y-12">
            <SupportCard />
            <WaitlistCTA />
            <MiniFounder />
          </div>
        </div>

        {/* Overlays */}
        <CategorySheet
          open={categorySheetOpen}
          onOpenChange={setCategorySheetOpen}
          categoryId={activeCategory}
          onSelectTool={(tid) => {
            setCategorySheetOpen(false)
            handleToolSelect(tid)
          }}
        />

        {activeFunc && activeFunc.available && activeTool === 'f2' && (
          <ToolSheet
            open={toolSheetOpen}
            onOpenChange={setToolSheetOpen}
            func={activeFunc}
            steps={f2Steps}
            currentStep={f2Step}
            onStepChange={setF2Step}
          />
        )}
        {activeFunc && activeFunc.available && activeTool === 'f1' && (
          <ToolSheet
            open={toolSheetOpen}
            onOpenChange={setToolSheetOpen}
            func={activeFunc}
            steps={[
              {
                id: 'ingredients',
                i18nKey: 'step_search_food',
                content: (
                  <StepIngredients
                    species={f1DefaultSpecies}
                    hideSpeciesIndicator
                    onSubmit={(ings) => {
                      setF1Ingredients(ings);
                      // Trigger analysis immediately
                      setF1Step(1);
                    }}
                  />
                ),
              },
              {
                id: 'result',
                i18nKey: 'step_result',
                content: !f1Result ? (
                  <StepAnalyze
                    species={f1DefaultSpecies}
                    ingredients={f1Ingredients}
                    onResult={(r) => setF1Result(r)}
                  />
                ) : (
                  <F1StepResult result={f1Result} ingredients={f1Ingredients} />
                ),
              }
            ]}
            currentStep={f1Step}
            onStepChange={(s) => {
              if (s === 0) setF1Result(null); // Reset result when going back to ingredients
              setF1Step(s);
            }}
          />
        )}
        {activeFunc && !activeFunc.available && (
          <ToolSheet
            open={toolSheetOpen}
            onOpenChange={setToolSheetOpen}
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

        <ExitPromptDialog
          open={exitPromptOpen}
          onOpenChange={setExitPromptOpen}
          onConfirmExit={() => {
            setExitPromptOpen(false)
            setTimeout(() => window.history.back(), 100)
          }}
        />
      </main>

      <Footer />
    </div>
  )
}
