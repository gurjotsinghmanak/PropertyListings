import Link from "next/link"
import { FeaturedListings } from "@/components/featured-listings"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Featured Properties</h2>
          <p className="mt-2 text-muted-foreground">Discover our handpicked selection of premium properties</p>
        </div>
        <FeaturedListings />
        <div className="mt-12 text-center">
          <Link
            href="/listings"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            View All Listings
          </Link>
        </div>
      </div>
    </main>
  )
}
