import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '../context/LanguageContext';

export const metadata: Metadata = {
    title: 'fammy.pet — Free Food Safety Checker for Dogs, Cats & Families',
    description: 'Check if foods are safe for your pets and family. Instant results for 10,000+ foods. Free tool with unlimited access after donation.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
