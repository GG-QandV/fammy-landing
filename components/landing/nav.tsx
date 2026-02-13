"use client"

import Link from "next/link"
import { useLanguage } from "../../context/LanguageContext"

export function Nav() {
  const { language, setLanguage } = useLanguage()

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 md:p-6">
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-2 font-semibold text-foreground"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream text-xs text-navy">
          ●
        </span>
        fammy.pet
      </Link>

      {/* Language switcher */}
      <div className="pointer-events-auto flex gap-1 rounded-full border border-light-grey bg-white-card/80 p-1 backdrop-blur-sm">
        {(["en", "es", "fr", "ua"] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${
              language === lang
                ? "bg-navy text-white"
                : "text-grey hover:text-navy"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </nav>
  )
}
