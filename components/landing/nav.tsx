"use client"

import Link from "next/link"
import { useLanguage } from "../../context/LanguageContext"
import { AuthButtons } from "../auth/AuthButtons"
import { LanguageSelector } from "../landing-v3/shared/language-selector"

export function Nav() {
  const { language, setLanguage } = useLanguage()

  return (
    <nav className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between p-4 md:p-6">
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-1 font-inter font-black text-dark-navy logo-stretch logo-shadow"
      >
        <span className="text-2xl">fammy</span>
        <span className="text-2xl text-coral">.</span>
        <span className="text-2xl text-seawave">pet</span>
      </Link>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          {/* Auth buttons (Desktop) */}
          <div className="pointer-events-auto hidden sm:block">
            <AuthButtons />
          </div>

          {/* Language switcher */}
          <div className="pointer-events-auto flex items-center h-[34px]">
            <LanguageSelector />
          </div>
        </div>

        {/* Mobile Auth */}
        <div className="pointer-events-auto sm:hidden">
          <AuthButtons />
        </div>
      </div>
    </nav>
  )
}
