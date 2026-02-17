import { Metadata } from "next"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { ComingSoon } from "@/components/landing-v3/shared/coming-soon"
import { functions } from "@/lib/functions-config"

export const metadata: Metadata = {
    title: "Body Condition Score Tracker — Fammy.pet",
    description:
        "Track your pet's body condition score over time to ensure they stay at a healthy weight.",
    openGraph: {
        title: "BCS Tracker — Fammy.pet",
        description: "Track your pet's body condition score.",
        url: "https://fammy.pet/bcs-tracker",
        siteName: "fammy.pet",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
}

export default function BcsTrackerPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex-1 flex flex-col items-center justify-center">
                <ComingSoon func={functions['f5']} />
            </main>
            <Footer />
        </div>
    )
}
