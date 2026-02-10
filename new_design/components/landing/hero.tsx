"use client"

import { useState, useCallback, useEffect } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { getOrCreateAnonId } from "../../lib/anonId"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import FoodAutocomplete from "../ui/food-autocomplete"
import { Button } from "../ui/button"
import { Loader2, Search, XCircle, ShieldCheck, Plus } from "lucide-react"

interface FoodResult {
  toxicityLevel: string
  toxicityName: string
  explanation?: string
  notes?: string
  severity: number
  foodName?: string
}

interface Ingredient {
  foodId: string
  foodName: string
  grams: number
}

interface HeroProps {
  activeFeature: "f1" | "f2"
  onFeatureChange: (feature: "f1" | "f2") => void
}

export function Hero({ activeFeature, onFeatureChange }: HeroProps) {
  const { t, language } = useLanguage()
  const router = useRouter()

  const [species, setSpecies] = useState<"dog" | "cat" | "human">("dog")
  const [query, setQuery] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [selectedFood, setSelectedFood] = useState<{id: string, name: string} | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FoodResult | null>(null)
  const [f1Result, setF1Result] = useState<any | null>(null)

  useEffect(() => {
    getOrCreateAnonId()
  }, [])

  const handleF2Check = useCallback(async () => {
    if (!query.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const anonId = await getOrCreateAnonId()
      const res = await fetch("/api/f2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `anon_id=${anonId}`,
        },
        body: JSON.stringify({ target: species, foodId: selectedFood?.id || "", lang: language }),
      })

      const data = await res.json()

      console.log("[F2 UI] Response data:", JSON.stringify(data, null, 2))
      if (data.result) {
        setResult(data.result)
      } else if (data.code === "LIMIT_REACHED") {
        setResult({
          toxicityLevel: "caution",
          toxicityName: t("attention"),
          explanation: t("f2_limit_reached"),
          severity: 2,
        })
      } else {
        setResult({
          toxicityLevel: "caution",
          toxicityName: t("caution"),
          explanation: data.message || t("f2_error_generic"),
          severity: 3,
        })
      }
    } catch (error) {
      setResult({
        toxicityLevel: "critical",
        toxicityName: t("critical"),
        explanation: t("f2_error_network"),
        severity: 5,
      })
    } finally {
      setLoading(false)
    }
  }, [query, species, language, t])

  const handleF1Submit = useCallback(async () => {
    if (ingredients.length === 0) return

    setLoading(true)
    setF1Result(null)

    try {
      const anonId = await getOrCreateAnonId()
      const res = await fetch("/api/f1/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `anon_id=${anonId}`,
        },
        body: JSON.stringify({ target: species, ingredients, lang: language }),
      })

      const data = await res.json()

      if (data.success) {
        setF1Result(data.data)
      } else {
        setF1Result({
          error: data.error?.message || t("f1_error_generic"),
        })
      }
    } catch (error) {
      setF1Result({
        error: t("f1_error_network"),
      })
    } finally {
      setLoading(false)
    }
  }, [ingredients, species, language, t])

  const addIngredient = () => {
    if (!query.trim()) return
    setIngredients(prev => [...prev, { foodId: query, foodName: query, grams: 100 }])
    setQuery("")
  }

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <section id="hero" className="relative w-full overflow-visible py-16 text-center lg:py-24">
      <div className="relative z-10 mx-auto max-w-2xl px-4">
        {/* Feature Tabs */}
        <div className="mb-8 inline-flex space-x-2 rounded-full bg-card p-1 shadow-sm">
          <Button
            variant={activeFeature === "f2" ? "default" : "outline"}
            onClick={() => onFeatureChange("f2")}
            size="xl" className={` ${activeFeature === "f2" ? "bg-teal hover:bg-teal/90" : ""}`}
          >
            👍👎 {t("f2_title")}
          </Button>
          <Button
            variant={activeFeature === "f1" ? "default" : "outline"}
            onClick={() => onFeatureChange("f1")}
            size="xl" className={` ${activeFeature === "f1" ? "bg-purple-600 hover:bg-purple-700" : ""}`}
          >
            <span className="text-3xl">🔬</span><span className="text-xl">🧪</span> {t("f1_title")}
          </Button>
        </div>

        {/* Hero Content */}
        <h1 className="font-display text-4xl font-bold text-foreground lg:text-5xl">
          {activeFeature === "f2" ? t("food_safety_title") : t("nutrient_analysis_title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
          {activeFeature === "f2" ? t("food_safety_desc") : t("nutrient_analysis_desc")}
        </p>

        {activeFeature === "f2" && (
        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant={species === "dog" ? "default" : "outline"}
            onClick={() => setSpecies("dog")}
            className={`flex-1 h-16 rounded-xl text-2xl ${species === "dog" ? "bg-teal hover:bg-teal/90" : ""}`}
          >
            🐶 <span className="text-2xl">{t("species_dog")}</span>
          </Button>
          <Button
            variant={species === "cat" ? "default" : "outline"}
            onClick={() => setSpecies("cat")}
            className={`flex-1 h-16 rounded-xl text-2xl ${species === "cat" ? "bg-teal hover:bg-teal/90" : ""}`}
          >
            🐱 <span className="text-2xl">{t("species_cat")}</span>
          </Button>
        </div>
        )}

        {activeFeature === "f2" ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <FoodAutocomplete
                onSelect={(food) => { setSelectedFood(food); setQuery(food.name); }}
                placeholder={t("search_placeholder")}
                
              />
              <Button
                onClick={handleF2Check}
                disabled={loading || !query}
                className="h-14 px-8 rounded-xl bg-coral hover:bg-coral/90 text-white"
              >
                {loading ? <Loader2 className="animate-spin" /> : t("check_button").split(" ")[0]}
              </Button>
            </div>

            {/* F2 Results */}
            {result && (
              <div className={`mt-4 p-6 rounded-xl border-2 animate-in fade-in slide-in-from-top-2 ${result.severity >= 3 ? "bg-red-50 border-red-200 text-red-900" : result.severity === 2 ? "bg-yellow-50 border-yellow-200 text-yellow-900" : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}>
                <div className="flex items-center gap-2 font-bold uppercase text-xl mb-2">
                  {result.severity >= 3 ? <XCircle className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                  {result.toxicityName}
                </div>
                <p className="text-lg opacity-90">{result.notes || result.explanation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-6 rounded-xl border border-border bg-background p-4 overflow-visible">
            <p className="text-sm text-muted-foreground mb-2">{t("f1_hint")}</p>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={ingredient.grams}
                    onChange={(e) => {
                      const newIngredients = [...ingredients]
                      newIngredients[index].grams = parseInt(e.target.value) || 0
                      setIngredients(newIngredients)
                    }}
                    className="h-10 w-20 rounded-lg border-border bg-secondary text-center"
                  />
                  <p className="flex-1 text-sm text-foreground">
                    {ingredient.foodName}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <FoodAutocomplete
                  onSelect={(food) => {
                    setIngredients(prev => [...prev, { foodId: food.id, foodName: food.name, grams: 100 }]);
                  }}
                  placeholder={t("recipe_search_placeholder")}
                />
              </div>
            </div>

            <Button
              onClick={handleF1Submit}
              disabled={loading || ingredients.length === 0}
              className="h-14 w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? <Loader2 className="animate-spin" /> : t("analyze_button")}
            </Button>

            {/* F1 Results */}
            {f1Result && (
              <div className="mt-4 p-6 rounded-xl border-2 bg-emerald-50 border-emerald-200 text-emerald-900 animate-in fade-in slide-in-from-top-2">
                <h3 className="font-bold text-lg mb-2">Nutrient Analysis Result</h3>
                {f1Result.nutrients?.map((nutrient: any) => (
                  <p key={nutrient.code} className="text-sm">
                    {nutrient.name}: {nutrient.total_amount}{nutrient.unit}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
