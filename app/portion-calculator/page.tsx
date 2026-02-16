import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Portion Calculator — Fammy.pet",
    description:
        "Calculate exactly how much food your pet needs based on weight, age, and activity level.",
    openGraph: {
        title: "Portion Calculator — Fammy.pet",
        description: "Calculate the right portion size for your pet.",
        url: "https://fammy.pet/portion-calculator",
        siteName: "fammy.pet",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
}

export default function PortionCalculatorPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold text-navy">⚖️ Portion Calculator</h1>
            <p className="mt-4 text-muted-foreground">Coming soon.</p>
        </main>
    )
}
