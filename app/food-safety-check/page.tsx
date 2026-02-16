import { Metadata } from "next"
import FoodSafetyCheckPage from "./f2-client"

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

export default function Page() {
    return <FoodSafetyCheckPage />
}
