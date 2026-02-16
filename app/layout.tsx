import React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Space_Grotesk, Inter } from "next/font/google"

import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  weight: ["900"],
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Fammy.pet - Pet Nutrition Validator",
  description:
    "Validate homemade pet recipes instantly. Check ingredients for toxicity, balance nutrients, and keep your dog or cat healthy.",
  openGraph: {
    title: "Fammy.pet - Pet Nutrition Validator",
    description:
      "Validate homemade pet recipes instantly. Check ingredients for toxicity, balance nutrients, and keep your dog or cat healthy.",
    url: "https://fammy.pet",
    siteName: "Fammy.pet",
    images: [
      {
        url: "https://fammy.pet/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fammy.pet - Pet Nutrition Validator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fammy.pet - Pet Nutrition Validator",
    description:
      "Validate homemade pet recipes instantly. Check ingredients for toxicity, balance nutrients, and keep your dog or cat healthy.",
    images: ["https://fammy.pet/og-image.jpg"],
  },
  icons: {
    icon: "/favicon-f-p.png",
  },
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
        className={`${dmSans.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
