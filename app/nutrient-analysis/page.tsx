import { Metadata } from "next"
import NutrientAnalysisClient from "./f1-client"

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

export default function Page() {
    return <NutrientAnalysisClient />
}
