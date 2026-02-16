"use client"
import { useState } from "react"
import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { FeatureCards } from "@/components/landing/feature-cards"
import { MiniFounder } from "@/components/landing/mini-founder"
import SupportCard from "@/components/landing/support-card"
import WaitlistCTA from "@/components/landing/waitlist-cta"
import { Footer } from "@/components/landing/footer"

export default function Page() {
  const [activeFeature, setActiveFeature] = useState<"f1" | "f2" | "f3">("f2")

  return (
    <>
      <Nav />
      <main>
        <Hero activeFeature={activeFeature} onFeatureChange={setActiveFeature} />
        <FeatureCards onFeatureSelect={setActiveFeature} />
        <SupportCard />
        <WaitlistCTA />
        <MiniFounder />
      </main>
      <Footer />
    </>
  )
}
