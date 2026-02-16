import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Food Safety Check — Fammy.pet",
    description:
        "Instantly check if food is safe for your pet. Database of 454 toxins based on AAFCO, FEDIAF and veterinary toxicology research.",
    openGraph: {
        title: "Food Safety Check — Fammy.pet",
        description:
            "Instantly check if food is safe for your pet. Database of 454 toxins.",
        url: "https://fammy.pet/food-safety-check",
        siteName: "fammy.pet",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
}

/**
 * F2: Food Safety Check — standalone SEO page.
 * Phase 4 will add the full F2 wizard here.
 */
export default function FoodSafetyCheckPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold text-navy">
                🔍 Food Safety Check
            </h1>
            <p className="mt-4 text-muted-foreground">
                Check if a product is safe for your pet.
            </p>
            {/* Phase 4: F2Tool component will be mounted here */}
        </main>
    )
}
