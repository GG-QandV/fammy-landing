import { Metadata } from "next"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { ComingSoon } from "@/components/landing-v3/shared/coming-soon"
import { functions } from "@/lib/functions-config"

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
        <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex-1 flex flex-col items-center justify-center">
                <ComingSoon func={functions['f6']} />
            </main>
            <Footer />
        </div>
    )
}
