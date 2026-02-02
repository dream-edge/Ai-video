import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ParticlesBackground from '@/components/ParticlesBackground';
import { Inter } from 'next/font/google';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'AI Videography Challenge',
    description: 'AI Photography Challenge Leaderboard',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} min-h-screen font-sans bg-white text-slate-900 antialiased`}>
                <ParticlesBackground />
                <Navbar />
                <main className="container mx-auto px-4 py-8 mt-16 relative z-10">
                    {children}
                </main>
            </body>
        </html>
    );
}
