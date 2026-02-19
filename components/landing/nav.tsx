"use client"

import Link from "next/link"
import { useLanguage } from "../../context/LanguageContext"
import { AuthButtons } from "../auth/AuthButtons"

export function Nav() {
  const { language, setLanguage } = useLanguage()

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between p-4 md:p-6">
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-1 font-inter font-black text-dark-navy logo-stretch logo-shadow"
      >
        <span className="text-2xl">fammy</span>
        <span className="text-2xl text-coral">.</span>
        <span className="text-2xl text-seawave">pet</span>
      </Link>

      <div className="flex items-center gap-2">
        {/* Auth buttons */}
        <div className="pointer-events-auto hidden sm:block">
          <AuthButtons />
        </div>

        {/* Language switcher */}
        <div className="pointer-events-auto flex gap-1 rounded-full border border-light-grey bg-white-card/80 p-1 backdrop-blur-sm">
          {(["en", "es", "fr", "ua"] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 text-xs font-medium rounded-full transition-colors ${language === lang
                ? "bg-navy/70 text-white"
                : "text-grey hover:text-navy"
                }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Mobile Auth (if needed separate or just shown) */}
        <div className="pointer-events-auto sm:hidden">
          <AuthButtons />
        </div>
      </div>
    </nav>
  )
}
