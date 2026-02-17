import { Metadata } from "next"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { ComingSoon } from "@/components/landing-v3/shared/coming-soon"
import { functions } from "@/lib/functions-config"

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
        <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex-1 flex flex-col items-center justify-center">
                <ComingSoon func={functions['f3']} />
            </main>
            <Footer />
        </div>
    )
}
