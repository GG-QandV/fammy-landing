"use client"
import { useState } from "react"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import SupportCard from "@/components/landing/support-card"
import WaitlistCTA from "@/components/landing/waitlist-cta"
import { MiniFounder } from "@/components/landing/mini-founder"
import type { FunctionId } from "@/lib/functions-config"

/**
 * Draft landing page — development-only route.
 * Uses reusable components from production (Nav, Footer, Support, Waitlist, Founder)
 * and new v3 components from landing-v3/.
 * 
 * Will be assembled fully in Phase 6.
 */
export default function DraftPage() {
    const [activeTool, setActiveTool] = useState<FunctionId | null>(null)

    return (
        <>
            <Nav />
            <main>
                {/* Phase 6: HeroV3 will go here */}
                <section className="px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-navy">
                        🚧 Draft Landing v3
                    </h1>
                    <p className="mt-4 text-muted-foreground">
                        Active tool: {activeTool ?? "none"}
                    </p>
                    {/* Phase 5: CategoryAccordion + ToolSheet will go here */}
                    {/* Phase 6: DesktopLayout will wrap the above */}
                </section>

                <SupportCard />
                <WaitlistCTA />
                <MiniFounder />
            </main>
            <Footer />
        </>
    )
}
