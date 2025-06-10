import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { FavoritesProvider } from "@/lib/favorites-context"

// Optimize font loading with display swap for better performance
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Improves font loading performance
  preload: true,
})

export const metadata = {
  title: "Property Listings - Find Your Dream Home",
  description:
    "Find your dream home with our property listings. Browse premium properties, luxury homes, and real estate opportunities.",
  keywords: "real estate, property listings, homes for sale, luxury properties",
  openGraph: {
    title: "Property Listings - Find Your Dream Home",
    description: "Find your dream home with our property listings",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Remove manual image preload - Next.js Image with priority handles this automatically */}

        {/* Keep DNS prefetch for external resources - this is still beneficial */}
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        {/* Optimize resource hints for faster connections */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
