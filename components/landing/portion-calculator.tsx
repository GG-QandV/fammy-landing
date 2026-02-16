"use client"

import { useState, useCallback } from "react"
import { useLanguage } from "../../context/LanguageContext"
import { getOrCreateAnonId } from "../../lib/anonId"
import { Loader2, Search, TriangleAlert, Info, Scale } from "lucide-react"
import FoodAutocomplete from "../ui/food-autocomplete"
import { toGrams, fromGrams, WeightUnit, formatWeight } from "../../lib/converters/weight-converter"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export default function PortionCalculator() {
    const { t, language } = useLanguage()

    const [species, setSpecies] = useState<"dog" | "cat">("dog")
    const [selectedFood, setSelectedFood] = useState<{ id: string, name: string } | null>(null)
    const [portionSize, setPortionSize] = useState<string>("100")
    const [weightUnit, setWeightUnit] = useState<WeightUnit>("g")
    const [period, setPeriod] = useState<"meal" | "day" | "week">("day")
    const [mealsPerDay, setMealsPerDay] = useState<number>(2)

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleCalculate = useCallback(async () => {
        if (!selectedFood) return

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const anonId = await getOrCreateAnonId()
            const gramsValue = toGrams(parseFloat(portionSize) || 0, weightUnit)

            const res = await fetch("/api/f3/calculate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    target: species,
                    items: [{ food_id: selectedFood.id, amount_grams: gramsValue }],
                    period: period,
                    meals_per_day: mealsPerDay,
                    lang: language
                }),
            })

            const data = await res.json()

            if (data.success) {
                setResult(data.data)
            } else {
                setError(data.error || t("f3_error_generic") || "Calculation failed")
            }
        } catch (err) {
            setError(t("f1_error_network"))
        } finally {
            setLoading(false)
        }
    }, [selectedFood, portionSize, weightUnit, period, mealsPerDay, species, language, t])

    const isMacro = (n: any) =>
        n.category === 'macronutrient' ||
        /^(protein|fat|carbs|fiber|energy|calories|203|204|205|208|291)/i.test(String(n.code)) ||
        /^(білок|вуглеводи|жири|клітковина|енергія|белки|углеводы|жиры|клетчатка|энергия)/i.test(n.name);

    return (
        <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Species Toggle */}
            <div className="flex justify-center gap-3">
                <button
                    onClick={() => setSpecies("dog")}
                    className={`flex-1 h-10 rounded-xl text-base font-medium transition-all ${species === "dog" ? "bg-navy text-white shadow-md scale-105" : "bg-white text-grey border border-light-grey hover:bg-slate-50"}`}
                >
                    🐶 {language === 'ua' ? 'Собака' : 'Dog'}
                </button>
                <button
                    onClick={() => setSpecies("cat")}
                    className={`flex-1 h-10 rounded-xl text-base font-medium transition-all ${species === "cat" ? "bg-navy text-white shadow-md scale-105" : "bg-white text-grey border border-light-grey hover:bg-slate-50"}`}
                >
                    🐱 {language === 'ua' ? 'Кіт' : 'Cat'}
                </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-grey/70 ml-1">{language === 'ua' ? 'Оберіть продукт' : 'Search food'}</label>
                    <FoodAutocomplete
                        onSelect={(food) => setSelectedFood(food)}
                        placeholder={t("search_placeholder")}
                    />
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-grey/70 ml-1">{language === 'ua' ? 'Розмір порції' : 'Portion size'}</label>
                    <div className="relative flex">
                        <Input
                            type="number"
                            value={portionSize}
                            onChange={(e) => setPortionSize(e.target.value)}
                            className="pr-16"
                        />
                        <button
                            onClick={() => setWeightUnit(prev => prev === "g" ? "oz" : "g")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-100 rounded text-xs font-bold text-navy hover:bg-slate-200"
                        >
                            {weightUnit}
                        </button>
                    </div>
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-grey/70 ml-1">{t("select_period")}</label>
                    <select
                        value={period}
                        onChange={(e: any) => setPeriod(e.target.value)}
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="meal">{t("period_meal")}</option>
                        <option value="day">{t("period_day")}</option>
                        <option value="week">{t("period_week")}</option>
                    </select>
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-sm font-semibold text-grey/70 ml-1">{t("meals_per_day_label")}</label>
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        value={mealsPerDay}
                        onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
                        disabled={period === 'meal'}
                    />
                </div>
            </div>

            <Button
                onClick={handleCalculate}
                disabled={loading || !selectedFood}
                className="w-full h-12 text-lg font-bold bg-navy hover:bg-navy/90 text-white rounded-2xl shadow-lg transition-all active:scale-95"
            >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Scale className="mr-2 h-5 w-5" />}
                {t("portion_calc_button")}
            </Button>

            {/* Results Area */}
            {result && (
                <div className="bg-emerald-50/50 rounded-3xl p-6 border-2 border-emerald-100/50 text-left animate-in zoom-in-95 duration-500">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-bold text-xl text-navy">{t("portion_result_title")}</h3>
                            <p className="text-sm text-grey/70 italic">
                                {selectedFood?.name} ({formatWeight(fromGrams(result.portion_grams, weightUnit), weightUnit)})
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-black text-emerald-600">
                                {formatWeight(fromGrams(result.total_grams_per_period, weightUnit), weightUnit)}
                            </span>
                            <span className="text-[10px] uppercase tracking-tighter font-bold text-emerald-800/40">
                                {t("total_for_period")} {t(`period_${period}`)}
                            </span>
                        </div>
                    </div>

                    {/* Warnings */}
                    {(result.toxicity_warnings?.length > 0 || result.allergen_warnings?.length > 0) && (
                        <div className="mb-6 space-y-2">
                            {result.toxicity_warnings?.map((w: any, i: number) => (
                                <div key={i} className="flex gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-800 text-sm">
                                    <TriangleAlert className="w-5 h-5 shrink-0" />
                                    <p><strong>{w.food_name}:</strong> {w.notes}</p>
                                </div>
                            ))}
                            {result.allergen_warnings?.map((a: any, i: number) => (
                                <div key={i} className="flex gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                                    <Info className="w-5 h-5 shrink-0" />
                                    <p>{a.matched_allergen} detected</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Nutrients Grid */}
                    <div className="space-y-4">
                        {(() => {
                            const nutrients = result.nutrients || [];
                            const major = nutrients.filter(isMacro);
                            const others = nutrients
                                .filter((n: any) => !isMacro(n))
                                .sort((a: any, b: any) => a.name.localeCompare(b.name));

                            return (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                                        {major.map((nutrient: any) => (
                                            <p key={nutrient.code} className="text-sm border-b border-emerald-100/30 py-1">
                                                <span className="font-medium">{nutrient.name.replace(/\s*\(.*?\)/g, "")}:</span> {nutrient.amount}{nutrient.unit}
                                            </p>
                                        ))}
                                    </div>

                                    {others.length > 0 && (
                                        <>
                                            <div className="my-6 border-t font-black text-[9px] text-center text-emerald-800/20 tracking-[0.3em] uppercase pt-2">
                                                Micro Elements
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5">
                                                {others.map((nutrient: any) => (
                                                    <p key={nutrient.code} className="text-[12px] text-emerald-900/70 py-0.5 leading-tight">
                                                        <span className="font-normal">{nutrient.name.replace(/\s*\(.*?\)/g, "")}:</span> {nutrient.amount}{nutrient.unit}
                                                    </p>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                    {error}
                </div>
            )}

            {!result && !loading && !error && (
                <div className="py-12 border-2 border-dashed border-slate-200 rounded-3xl opacity-40">
                    <Scale className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-sm font-medium">{t("empty_f3_results")}</p>
                </div>
            )}
        </div>
    )
}
