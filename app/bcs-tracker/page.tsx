import { Metadata } from "next"

export const metadata: Metadata = {
    title: "BCS Tracker — Fammy.pet",
    description:
        "Track your pet's body condition score over time for optimal health.",
    openGraph: {
        title: "BCS Tracker — Fammy.pet",
        description: "Track body condition score over time.",
        url: "https://fammy.pet/bcs-tracker",
        siteName: "fammy.pet",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
}

export default function BcsTrackerPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold text-navy">📈 BCS Tracker</h1>
            <p className="mt-4 text-muted-foreground">Coming soon.</p>
        </main>
    )
}
