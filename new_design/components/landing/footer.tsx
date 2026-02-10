"use client"

import Link from "next/link"
import { useLanguage } from "../../context/LanguageContext"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-teal px-6 py-12 text-primary-foreground lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" />
                <circle cx="14" cy="14" r="4" fill="hsl(22 85% 49%)" />
              </svg>
              <span className="font-display text-lg font-bold">fammy.pet</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed opacity-70">
              {t("footer_safe_food")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider opacity-50">
              {t("footer_tools")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/diet-validator" className="opacity-80 transition-opacity hover:opacity-100">
                  {t("f1_title")}
                </Link>
              </li>
              <li>
                <Link href="/safety-check" className="opacity-80 transition-opacity hover:opacity-100">
                  {t("f2_title")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider opacity-50">
              {"Legal"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="opacity-60">{"Privacy Policy"}</span>
              </li>
              <li>
                <span className="opacity-60">{"Terms of Service"}</span>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="flex flex-col justify-end">
            <p className="text-xs opacity-50">
              {`2026 fammy.pet. ${t("footer_disclaimer")}`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
