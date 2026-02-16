import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Nutrient Analysis — Fammy.pet",
    description:
        "Detailed analysis of vitamins, minerals, and calories based on official USDA Foundation Foods database. 3,800+ products.",
    openGraph: {
        title: "Nutrient Analysis — Fammy.pet",
        description:
            "Analyze vitamins, minerals, and calories of pet food recipes.",
        url: "https://fammy.pet/nutrient-analysis",
        siteName: "fammy.pet",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
}

/**
 * F1: Nutrient Analysis — standalone SEO page.
 * Phase 5 will add the full F1 wizard here.
 */
export default function NutrientAnalysisPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold text-navy">
                📊 Nutrient Analysis
            </h1>
            <p className="mt-4 text-muted-foreground">
                Analyze vitamins, minerals, and caloric density of your recipe.
            </p>
            {/* Phase 5: F1Tool component will be mounted here */}
        </main>
    )
}
