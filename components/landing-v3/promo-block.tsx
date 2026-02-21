"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"
import { CheckCircle2, AlertCircle, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromoFeature {
  code: string
  usageLimit: number | null
  dailyLimit: number | null
}

interface PromoResult {
  features: PromoFeature[]
  tier: string
  token: string
}

const featureNames: Record<string, Record<string, string>> = {
  diet_validator: { en: 'Diet Validator', ua: 'Валідатор дієти', es: 'Validador de dieta', fr: 'Validateur de regime' },
  human_foods_checker: { en: 'Food Safety Check', ua: 'Пошук токсинів', es: 'Verificador de alimentos', fr: 'Verificateur alimentaire' },
  portion_calculator: { en: 'Portion Calculator', ua: 'Калькулятор порцій', es: 'Calculadora de porciones', fr: 'Calculateur de portions' },
  recipe_generator: { en: 'Recipe Generator', ua: 'Генератор рецептів', es: 'Generador de recetas', fr: 'Generateur de recettes' },
  bcs_tracker: { en: 'BCS Tracker', ua: 'BCS Трекер', es: 'Rastreador BCS', fr: 'Suivi BCS' },
  nutrient_advice: { en: 'Nutrient Advice', ua: 'Поради з нутрієнтів', es: 'Consejo nutricional', fr: 'Conseils nutritionnels' },
}

interface PromoBlockProps {
  variant?: "default" | "compact"
}

export function PromoBlock({ variant = "default" }: PromoBlockProps) {
  const isCompact = variant === "compact"
  const { t, language } = useLanguage()
  const [promoCode, setPromoCode] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null)

  const handleApply = async () => {
    if (!promoCode) return
    setStatus("loading")

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus("success")
        setPromoResult(data)
        setShowModal(true)

        // Dispatch event for usage count refresh
        window.dispatchEvent(new CustomEvent('usage-updated'));

        if (data.token) {
          localStorage.setItem("promo_token", data.token)
          localStorage.setItem("promo_tier", data.tier || "promo")
          if (data.features) {
            localStorage.setItem("promo_features", JSON.stringify(data.features))
          }
        }
      } else {
        setStatus("error")
        const errKey = data.error === "expired" ? "promo_expired" : "promo_invalid"
        setMessage(t(errKey) || t("promo_invalid") || "Invalid promo code")
      }
    } catch (err) {
      setStatus("error")
      setMessage(t("promo_error") || "Network error")
    }
  }

  const getFeatureName = (code: string) => {
    return featureNames[code]?.[language] || featureNames[code]?.en || code
  }

  const formatExpiry = () => {
    if (!promoResult?.token) return ""
    try {
      const payload = JSON.parse(atob(promoResult.token.split(".")[1]))
      if (payload.exp) {
        return new Date(payload.exp * 1000).toLocaleDateString()
      }
    } catch { }
    return ""
  }

  const renderModal = () => {
    if (!showModal || !promoResult) return null
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
        onClick={() => setShowModal(false)}
      >
        <div
          className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-[#2d3748]">
              {t("promo_congrats") || "Congratulations!"}
            </h3>
          </div>

          <div className="space-y-3">
            {/* Features list */}
            <div className="bg-[#f7f7f2] rounded-xl p-4">
              <p className="text-sm text-[#5c5c54] mb-2 font-medium">
                {t("promo_features_granted") || "Access granted to:"}
              </p>
              <ul className="space-y-1">
                {promoResult.features.map((f) => (
                  <li key={f.code} className="flex justify-between text-sm">
                    <span className="text-[#2d3748] font-medium">{getFeatureName(f.code)}</span>
                    <span className="text-[#546a8c]">
                      {f.usageLimit ? `${f.usageLimit} ${t("promo_total") || "total"}` : ""}
                      {f.usageLimit && f.dailyLimit ? " / " : ""}
                      {f.dailyLimit ? `${f.dailyLimit}/${t("promo_per_day") || "day"}` : ""}
                      {!f.usageLimit && !f.dailyLimit ? (t("promo_unlimited") || "unlimited") : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Expiry */}
            {formatExpiry() && (
              <p className="text-center text-sm text-[#5c5c54]">
                {t("promo_valid_until") || "Valid until"}: <span className="font-semibold text-[#2d3748]">{formatExpiry()}</span>
              </p>
            )}
          </div>

          <Button
            onClick={() => setShowModal(false)}
            className="w-full mt-4 rounded-xl bg-[#546a8c] hover:bg-[#435570] text-white"
          >
            {t("promo_got_it") || "Got it!"}
          </Button>
        </div>
      </div>
    )
  }

  if (isCompact) {
    return (
      <div className="w-full max-w-[184px]">
        <div className="flex gap-1.5 h-[34px] bg-white-card/80 p-0.5 rounded-[16px] backdrop-blur-sm border border-light-grey logo-shadow">
          <Input
            placeholder={t("enter_promo") || "Promo..."}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="h-full rounded-[14px] border-none bg-transparent text-sm pl-[5px] pr-[5px] focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0"
            disabled={status === "loading" || status === "success"}
          />
          <Button
            onClick={handleApply}
            disabled={status === "loading" || status === "success" || !promoCode}
            className="h-full rounded-[14px] bg-[#546a8c] hover:bg-[#435570] text-white px-3 text-xs flex-shrink-0"
          >
            {status === "loading" ? (
              <Clock className="w-3.5 h-3.5 animate-spin" />
            ) : (
              t("apply_btn_short") || t("apply_btn") || "OK"
            )}
          </Button>
        </div>

        {status === "error" && (
          <div className="mt-1 flex items-center gap-1.5 text-[10px] justify-start px-2 text-rose-500 whitespace-nowrap overflow-hidden">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{message}</span>
          </div>
        )}

        {status === "success" && (
          <div className="mt-1 flex items-center gap-1.5 text-[10px] justify-start px-2 text-emerald-600 whitespace-nowrap overflow-hidden">
            <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
            <span>{t("promo_applied_short") || "OK!"}</span>
          </div>
        )}

        {renderModal()}
      </div>
    )
  }

  return (
    <>
      <div className="w-full max-w-xl mx-auto mt-12 mb-16 p-6 rounded-3xl bg-[#f8f8f2] border border-[#e8e8e0] shadow-sm">
        <h3 className="text-center font-semibold text-[#5c5c54] mb-4">
          {t("have_promo") || "Have a promo code?"}
        </h3>

        <div className="flex gap-2">
          <Input
            placeholder={t("enter_promo") || "Enter promo code..."}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="rounded-xl border-[#dcdcd4] bg-white focus-visible:ring-[#546a8c]"
            disabled={status === "loading" || status === "success"}
          />
          <Button
            onClick={handleApply}
            disabled={status === "loading" || status === "success" || !promoCode}
            className="rounded-xl bg-[#546a8c] hover:bg-[#435570] text-white px-6"
          >
            {status === "loading" ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              t("apply_btn") || "Apply"
            )}
          </Button>
        </div>

        {status === "error" && (
          <div className="mt-3 flex items-center gap-2 text-sm justify-center text-rose-500">
            <AlertCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {status === "success" && (
          <div className="mt-3 flex items-center gap-2 text-sm justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t("promo_applied_short") || "Promo code activated!"}</span>
          </div>
        )}
      </div>

      {renderModal()}
    </>
  )
}
