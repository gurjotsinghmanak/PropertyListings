"use client"

import { useEffect, useState, useCallback } from "react"
import { PropertyCard } from "./property-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { propertyApi, type Property } from "@/lib/api"
import { AlertCircle } from "lucide-react"

/**
 * Optimized FeaturedListings component with performance improvements
 * - Memoized API calls to prevent unnecessary requests
 * - Efficient error handling and retry logic
 * - Optimized loading states
 */
export function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Memoized function to load featured properties
   * Prevents unnecessary API calls on re-renders
   */
  const loadFeaturedProperties = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Use optimized API call with specific parameters for featured listings
      const response = await propertyApi.getFeaturedListings()

      if (response.success && response.data) {
        // Limit to 3 featured properties for homepage
        setProperties(response.data.slice(0, 3))
      } else {
        setError(response.message || "Failed to load featured properties")
      }
    } catch (err) {
      console.error("Error loading featured properties:", err)
      setError(err instanceof Error ? err.message : "Failed to load featured properties")
    } finally {
      setLoading(false)
    }
  }, [])

  // Load featured properties on component mount
  useEffect(() => {
    loadFeaturedProperties()
  }, [loadFeaturedProperties])

  // Error state with retry functionality
  if (error) {
    return (
      <div className="text-center py-8">
        <Alert className="max-w-md mx-auto mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadFeaturedProperties} variant="outline" className="cursor-pointer">
          Try Again
        </Button>
      </div>
    )
  }

  // Empty state
  if (!loading && properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No featured properties available at the moment.</p>
      </div>
    )
  }

  // Main content - loading is handled by Suspense in parent
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
