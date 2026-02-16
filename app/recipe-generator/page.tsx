import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Recipe Generator — Fammy.pet",
    description: "Create balanced, vet-approved recipes for your pet.",
    openGraph: {
        title: "Recipe Generator — Fammy.pet",
        description: "Create balanced recipes for your pet.",
        url: "https://fammy.pet/recipe-generator",
        siteName: "fammy.pet",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
}

export default function RecipeGeneratorPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold text-navy">📋 Recipe Generator</h1>
            <p className="mt-4 text-muted-foreground">Coming soon.</p>
        </main>
    )
}
