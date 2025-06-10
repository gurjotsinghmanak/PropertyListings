import Link from "next/link"
import { Suspense } from "react"
import { FeaturedListings } from "@/components/featured-listings"
import { HeroSection } from "@/components/hero-section"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Optimized Home page with improved loading performance
 * - Suspense boundaries for better perceived performance
 * - Optimized component loading order
 */

// Loading component for featured listings
function FeaturedListingsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[225px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* Hero section loads immediately for better LCP */}
      <HeroSection />

      {/* Main content with optimized loading */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Properties</h2>
          <p className="text-muted-foreground">Discover our handpicked selection of premium properties</p>
        </div>

        {/* Suspense boundary for non-critical content */}
        <Suspense fallback={<FeaturedListingsLoading />}>
          <FeaturedListings />
        </Suspense>

        {/* Call-to-action section */}
        <div className="mt-12 text-center">
          <Link
            href="/listings"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View All Listings
          </Link>
        </div>
      </div>
    </>
  )
}
