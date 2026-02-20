"use client"

import Link from "next/link"
import { useLanguage } from "../../context/LanguageContext"

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-dark-navy px-6 py-12 text-white lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 lg:text-left">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
                <path d="M231.67,60.89a35.82,35.82,0,0,0-23.82-12.74,36,36,0,1,0-66.37,22.92.25.25,0,0,1,0,.08L71.17,141.51s0,0-.1,0a36,36,0,1,0-22.92,66.37,36,36,0,1,0,66.37-22.92.54.54,0,0,1,0-.08l70.35-70.36s0,0,.1,0a36,36,0,0,0,46.74-53.63ZM219.1,97.16a20,20,0,0,1-25.67,3.8,16,16,0,0,0-19.88,2.19l-70.4,70.4A16,16,0,0,0,101,193.43a20,20,0,1,1-36.75,7.5,8,8,0,0,0-7.91-9.24,8.5,8.5,0,0,0-1.23.1A20,20,0,1,1,62.57,155a16,16,0,0,0,19.88-2.19l70.4-70.4A16,16,0,0,0,155,62.57a20,20,0,1,1,36.75-7.5,8,8,0,0,0,9.14,9.14,20,20,0,0,1,18.17,33Z"></path>
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
              {t("footer_legal") || "Legal"}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="opacity-60">{t("footer_privacy") || "Privacy Policy"}</span>
              </li>
              <li>
                <span className="opacity-60">{t("footer_terms") || "Terms of Service"}</span>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="flex flex-col justify-end">
            <p className="text-xs opacity-50">
              {`2025 fammy.pet. ${t("footer_disclaimer")}`}
            </p>
            <p className="mt-2 text-[10px] opacity-40 font-mono">
              v1.3.0.100
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
