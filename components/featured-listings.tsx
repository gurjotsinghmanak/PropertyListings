"use client"

import { useEffect, useState } from "react"
import { PropertyCard } from "./property-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { propertyApi, type Property } from "@/lib/api"
import { AlertCircle } from "lucide-react"

export function FeaturedListings() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await propertyApi.getFeaturedListings()

      if (response.success && response.data) {
        setProperties(response.data)
      } else {
        setError(response.message || "Failed to load featured properties")
      }
    } catch (err) {
      console.error("Error loading featured properties:", err)
      setError(err instanceof Error ? err.message : "Failed to load featured properties")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeaturedProperties()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
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

  if (error) {
    return (
      <div className="text-center py-8">
        <Alert className="max-w-md mx-auto mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadFeaturedProperties} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No featured properties found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
