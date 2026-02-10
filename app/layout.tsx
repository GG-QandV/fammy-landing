import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Space_Grotesk } from "next/font/google"

import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "PetCheck -- Safe Food for Pets",
  description:
    "Medical-grade food safety checker for your pets. Analyze composition and toxicity instantly.",
}

export const viewport: Viewport = {
  themeColor: "#FAFAF8",
  width: "device-width",
  initialScale: 1,
}

import { LanguageProvider } from "../context/LanguageContext"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
