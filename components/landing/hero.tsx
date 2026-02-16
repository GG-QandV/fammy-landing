"use client"

import { useState, useCallback, useEffect } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { getOrCreateAnonId } from "../../lib/anonId"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import FoodAutocomplete from "../ui/food-autocomplete"
import { Loader2, Search, XCircle, ShieldCheck, Plus, Scale, Copy, Check, Calculator } from "lucide-react"
import { toGrams, fromGrams, WeightUnit, formatWeight } from "../../lib/converters/weight-converter"
import { copyToClipboard } from "../../lib/utils/clipboard"
import PortionCalculator from "./portion-calculator"

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
  const [selectedFood, setSelectedFood] = useState<{ id: string, name: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FoodResult | null>(null)
  const [f1Result, setF1Result] = useState<any | null>(null)
  const [promoCode, setPromoCode] = useState("")
  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "success" | "expired" | "invalid">("idle")
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("g")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getOrCreateAnonId()
  }, [])

  const handleF2Check = useCallback(async () => {
    if (!query.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const anonId = await getOrCreateAnonId()
      const promoToken = document.cookie.match(/promo_token=([^;]+)/)?.[1] || ""
      const res = await fetch("/api/f2/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `anon_id=${anonId}`,
          ...(promoToken ? { "x-promo-token": promoToken } : {}),
        },
        body: JSON.stringify({ target: species, foodId: selectedFood?.id || "", lang: language }),
      })

      const data = await res.json()

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
      } else if (data.code === "LIMIT_REACHED") {
        setF1Result({
          error: t("f1_limit_reached"),
          isLimit: true,
        })
      } else {
        setF1Result({
          error: data.message || data.error?.message || t("f1_error_generic"),
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

  const handlePromoSubmit = async () => {
    if (!promoCode.trim()) return
    setPromoStatus("loading")
    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setPromoStatus("success")
        if (data.token) {
          document.cookie = `promo_token=${data.token}; path=/; max-age=86400`
        }
      } else if (data.error === "expired") {
        setPromoStatus("expired")
      } else {
        setPromoStatus("invalid")
      }
    } catch {
      setPromoStatus("invalid")
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index))
  }

  const toggleWeightUnit = () => {
    setWeightUnit(prev => prev === "g" ? "oz" : "g")
  }

  const handleCopyF1 = async () => {
    if (!f1Result || !f1Result.nutrients) return;

    const isMacro = (n: any) =>
      n.category === 'macronutrient' ||
      /^(protein|fat|carbs|fiber|energy|calories|203|204|205|208|291)/i.test(String(n.code)) ||
      /^(білок|вуглеводи|жири|клітковина|енергія|белки|углеводы|жиры|клетчатка|энергия)/i.test(n.name);

    const nutrients = [...f1Result.nutrients].filter((n: any) => n.totalAmount > 0);

    const major = nutrients.filter(isMacro);
    const others = nutrients
      .filter((n: any) => !isMacro(n))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    const summaryHeader = `${t("f1_result_for")}: ${ingredients.map(i => `${i.foodName} (${formatWeight(fromGrams(i.grams, weightUnit), weightUnit)})`).join(", ")}`;

    const formatN = (n: any) => `${n.name.replace(/\s*\(.*?\)/g, "")}: ${n.totalAmount}${n.unit}`;

    const majorList = major.map(formatN).join("\n");
    const othersList = others.map(formatN).join("\n");

    const fullText = `${summaryHeader}\n\n${t("f1_result_title")}:\n${majorList}${othersList ? `\n---\n${othersList}` : ''}`;

    const success = await copyToClipboard(fullText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <section id="hero" className="relative w-full overflow-visible pt-16 py-12 text-center lg:pt-20 lg:py-24">
      <div className="relative z-10 mx-auto max-w-2xl px-5">
        {/* Feature Tabs */}
        {/* Feature Tabs */}
        <div className="mb-10 flex w-full sm:max-w-[400px] mx-auto rounded-full bg-white-card p-1 shadow-soft border border-coral overflow-hidden sm:overflow-visible">
          <button
            onClick={() => onFeatureChange("f2")}
            className={`flex-1 h-11 sm:h-12 px-1 sm:px-4 rounded-full text-[13px] sm:text-base font-medium transition-colors flex items-center justify-center gap-1.5 ${activeFeature === "f2" ? "bg-navy text-white" : "bg-slate-100 text-grey hover:bg-slate-200"}`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path></svg>
            <span className="truncate">{t("f2_title")}</span>
          </button>
          <button
            onClick={() => onFeatureChange("f1")}
            className={`flex-1 h-11 sm:h-12 px-1 sm:px-4 rounded-full text-[13px] sm:text-base font-medium transition-colors flex items-center justify-center gap-1.5 ${activeFeature === "f1" ? "bg-navy text-white" : "bg-slate-100 text-grey hover:bg-slate-200"}`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M237.66,86.34l-60-60a8,8,0,0,0-11.32,0L37.11,155.57a44.77,44.77,0,0,0,63.32,63.32L212.32,107l22.21-7.4a8,8,0,0,0,3.13-13.25ZM89.11,207.57a28.77,28.77,0,0,1-40.68-40.68l28.8-28.8c8.47-2.9,21.75-4,39.07,5,10.6,5.54,20.18,8,28.56,8.73ZM205.47,92.41a8,8,0,0,0-3.13,1.93l-39.57,39.57c-8.47,2.9-21.75,4-39.07-5-10.6-5.54-20.18-8-28.56-8.73L172,43.31,217.19,88.5Z"></path></svg>
            <span className="truncate">{t("f1_title")}</span>
          </button>
          {/* F3 temporarily disabled
          <button
            onClick={() => onFeatureChange("f3" as any)}
            className={`flex-1 h-11 sm:h-12 px-2 sm:px-4 rounded-full text-sm sm:text-base font-medium transition-colors ${activeFeature === ("f3" as any) ? "bg-navy text-white" : "bg-slate-100 text-grey hover:bg-slate-200"}`}
          >
            <Calculator className="inline-block w-5 h-5 mr-2" />
            {t("f3_title")}
          </button>
          */}
        </div>

        {/* Hero Content */}
        <h1 className="font-display text-[2rem] leading-tight font-bold text-foreground sm:text-4xl lg:text-5xl">
          {activeFeature === "f2" ? t("food_safety_title") : t("nutrient_analysis_title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground lg:text-xl">
          {activeFeature === "f2" ? t("food_safety_desc") : t("nutrient_analysis_desc")}
        </p>

        {activeFeature === "f2" && (
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => setSpecies("dog")}
              className={`flex-1 h-10 rounded-xl text-base font-medium transition-colors ${species === "dog" ? "bg-navy text-white" : "bg-white text-grey border border-light-grey hover:bg-slate-50"}`}
            >
              <svg className="inline-block w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 256 256"><path d="M239.71,125l-16.42-88a16,16,0,0,0-19.61-12.58l-.31.09L150.85,40h-45.7L52.63,24.56l-.31-.09A16,16,0,0,0,32.71,37.05L16.29,125a15.77,15.77,0,0,0,9.12,17.52A16.26,16.26,0,0,0,32.12,144,15.48,15.48,0,0,0,40,141.84V184a40,40,0,0,0,40,40h96a40,40,0,0,0,40-40V141.85a15.5,15.5,0,0,0,7.87,2.16,16.31,16.31,0,0,0,6.72-1.47A15.77,15.77,0,0,0,239.71,125ZM32,128h0L48.43,40,90.5,52.37Zm144,80H136V195.31l13.66-13.65a8,8,0,0,0-11.32-11.32L128,180.69l-10.34-10.35a8,8,0,0,0-11.32,11.32L120,195.31V208H80a24,24,0,0,1-24-24V123.11L107.92,56h40.15L200,123.11V184A24,24,0,0,1,176,208Zm48-80L165.5,52.37,207.57,40,224,128ZM104,140a12,12,0,1,1-12-12A12,12,0,0,1,104,140Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,140Z"></path></svg>
              {t("species_dog")}
            </button>
            <button
              onClick={() => setSpecies("cat")}
              className={`flex-1 h-10 rounded-xl text-base font-medium transition-colors ${species === "cat" ? "bg-navy text-white" : "bg-white text-grey border border-light-grey hover:bg-slate-50"}`}
            >
              <svg className="inline-block w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 256 256"><path d="M96,140a12,12,0,1,1-12-12A12,12,0,0,1,96,140Zm76-12a12,12,0,1,0,12,12A12,12,0,0,0,172,128Zm60-80v88c0,52.93-46.65,96-104,96S24,188.93,24,136V48A16,16,0,0,1,51.31,36.69c.14.14.26.27.38.41L69,57a111.22,111.22,0,0,1,118.1,0L204.31,37.1c.12-.14.24-.27.38-.41A16,16,0,0,1,232,48Zm-16,0-21.56,24.8A8,8,0,0,1,183.63,74,88.86,88.86,0,0,0,168,64.75V88a8,8,0,1,1-16,0V59.05a97.43,97.43,0,0,0-16-2.72V88a8,8,0,1,1-16,0V56.33a97.43,97.43,0,0,0-16,2.72V88a8,8,0,1,1-16,0V64.75A88.86,88.86,0,0,0,72.37,74a8,8,0,0,1-10.81-1.17L40,48v88c0,41.66,35.21,76,80,79.67V195.31l-13.66-13.66a8,8,0,0,1,11.32-11.31L128,180.68l10.34-10.34a8,8,0,0,1,11.32,11.31L136,195.31v20.36c44.79-3.69,80-38,80-79.67Z"></path></svg>
              {t("species_cat")}
            </button>
          </div>
        )}

        {activeFeature === "f2" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 w-full">
                <FoodAutocomplete
                  onSelect={(food) => { setSelectedFood(food); setQuery(food.name); }}
                  placeholder={t("search_placeholder")}
                />
              </div>
              <button
                onClick={handleF2Check}
                disabled={loading || !query}
                className="h-12 sm:h-14 w-full sm:w-auto px-8 rounded-xl bg-navy text-white hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
              >
                {loading ? <Loader2 className="animate-spin" /> : t("check_button").split(" ")[0]}
              </button>
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
        )}

        {activeFeature === "f1" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-6 rounded-xl border border-light-grey bg-white p-4 overflow-visible">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{t("f1_hint")}</p>
                <button
                  onClick={toggleWeightUnit}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Scale className="h-3.5 w-3.5" />
                  {weightUnit === "g" ? t("unit_grams") : t("unit_ounces")}
                </button>
              </div>
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <Input
                      type="number"
                      value={Math.round(fromGrams(ingredient.grams, weightUnit) * 100) / 100}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0
                        const newIngredients = [...ingredients]
                        newIngredients[index].grams = toGrams(val, weightUnit)
                        setIngredients(newIngredients)
                      }}
                      className="h-10 w-24 rounded-lg border-border bg-secondary text-center pr-7"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase">
                      {t(`unit_${weightUnit}`)}
                    </span>
                  </div>
                  <p className="flex-1 text-sm text-foreground">
                    {ingredient.foodName}
                  </p>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="h-8 w-8 flex items-center justify-center text-grey hover:text-navy transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
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

            <button
              onClick={handleF1Submit}
              disabled={loading || ingredients.length === 0}
              className="h-14 w-full rounded-xl bg-navy text-white hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
            >
              {loading ? <Loader2 className="animate-spin" /> : t("analyze_button")}
            </button>

            {/* F1 Results */}
            {f1Result && (
              <div className={`relative mt-4 p-6 rounded-xl border-2 animate-in fade-in slide-in-from-top-2 ${f1Result.error ? (f1Result.isLimit ? "bg-yellow-50 border-yellow-200 text-yellow-900" : "bg-red-50 border-red-200 text-red-900") : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}>
                {!f1Result.error && (
                  <button
                    onClick={handleCopyF1}
                    className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-white/50 hover:bg-white/80 transition-colors border border-emerald-200 shadow-sm"
                    title={t("copy_to_clipboard")}
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-emerald-800" />}
                  </button>
                )}

                {f1Result.error ? (
                  <>
                    <h3 className="font-bold text-xl mb-2">{f1Result.isLimit ? t("attention") : t("caution")}</h3>
                    <p className="text-lg">{f1Result.error}</p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-xl mb-1">{t("f1_result_title")}</h3>
                    <p className="text-[14px] font-medium italic opacity-90 mb-6 border-b-2 border-emerald-300/40 pb-3">
                      {t("f1_result_for")}: {ingredients.map((i, idx) => (
                        <span key={idx}>
                          {i.foodName} ({formatWeight(fromGrams(i.grams, weightUnit), weightUnit)}){idx < ingredients.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>

                    {(() => {
                      const isMacro = (n: any) =>
                        n.category === 'macronutrient' ||
                        /^(protein|fat|carbs|fiber|energy|calories|203|204|205|208|291)/i.test(String(n.code)) ||
                        /^(білок|вуглеводи|жири|клітковина|енергія|белки|углеводы|жиры|клетчатка|энергия)/i.test(n.name);

                      const nutrients = f1Result.nutrients?.filter((n: any) => n.totalAmount > 0) || [];
                      const major = nutrients.filter(isMacro);
                      const others = nutrients
                        .filter((n: any) => !isMacro(n))
                        .sort((a: any, b: any) => a.name.localeCompare(b.name));

                      return (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                            {major.map((nutrient: any) => (
                              <p key={nutrient.code} className="text-sm border-b border-emerald-100/30 py-1">
                                <span className="font-medium">{nutrient.name.replace(/\s*\(.*?\)/g, "")}:</span> {nutrient.totalAmount}{nutrient.unit}
                              </p>
                            ))}
                          </div>

                          {others.length > 0 && (
                            <>
                              <div className="my-8 border-t-2 border-emerald-300/50 relative">
                                <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-50 px-3 text-[11px] text-emerald-700/60 uppercase font-black tracking-widest">
                                  Micro
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                                {others.map((nutrient: any) => (
                                  <p key={nutrient.code} className="text-[13px] text-emerald-900/80 py-0.5">
                                    <span className="font-normal">{nutrient.name.replace(/\s*\(.*?\)/g, "")}:</span> {nutrient.totalAmount}{nutrient.unit}
                                  </p>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      );
                    })()}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Temporarily disabled */}
        {(activeFeature as any) === "f3" && (
          <PortionCalculator />
        )}

        {/* Promo Code - Alway below active tabs */}
        <div className="mt-8 rounded-xl bg-cream/30 border border-cream p-4">
          <p className="text-base font-medium text-navy mb-2">{t("have_promo")}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value); setPromoStatus("idle"); }}
              placeholder={t("promo_placeholder")}
              className="flex-1 w-full h-12 px-4 rounded-lg border border-light-grey bg-white text-navy text-base focus:border-navy/40 focus:outline-none"
            />
            <button
              onClick={handlePromoSubmit}
              disabled={promoStatus === "loading" || !promoCode.trim()}
              className="h-12 w-full sm:w-auto px-5 rounded-lg bg-navy text-white text-base font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {promoStatus === "loading" ? "..." : t("apply_promo")}
            </button>
          </div>
          {promoStatus === "success" && (
            <p className="mt-2 text-sm text-emerald-600 font-medium">{t("promo_success")}</p>
          )}
          {promoStatus === "expired" && (
            <p className="mt-2 text-sm text-red-600 font-medium">{t("promo_expired")}</p>
          )}
          {promoStatus === "invalid" && (
            <p className="mt-2 text-sm text-red-600 font-medium">{t("promo_invalid")}</p>
          )}
        </div>
      </div>
    </section>
  )
}
