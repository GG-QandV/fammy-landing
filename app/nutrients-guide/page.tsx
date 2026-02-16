import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Nutrients Guide — Fammy.pet",
    description:
        "Learn about essential nutrients for your pet's health and well-being.",
    openGraph: {
        title: "Nutrients Guide — Fammy.pet",
        description: "Essential nutrients guide for pets.",
        url: "https://fammy.pet/nutrients-guide",
        siteName: "fammy.pet",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
}

export default function NutrientsGuidePage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold text-navy">📚 Nutrients Guide</h1>
            <p className="mt-4 text-muted-foreground">Coming soon.</p>
        </main>
    )
}
