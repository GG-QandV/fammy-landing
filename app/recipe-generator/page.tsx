import { Metadata } from "next"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { ComingSoon } from "@/components/landing-v3/shared/coming-soon"
import { functions } from "@/lib/functions-config"

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
        <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex-1 flex flex-col items-center justify-center">
                <ComingSoon func={functions['f4']} />
            </main>
            <Footer />
        </div>
    )
}
