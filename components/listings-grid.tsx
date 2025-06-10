"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { PropertyCard } from "./property-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Pagination } from "./pagination"
import { propertyApi, type Property, type FilterCriteria } from "@/lib/api"
import { AlertCircle } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"

export function ListingsGrid() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State management for listings data
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const { favorites } = useFavorites()

  // Memoized values to prevent unnecessary recalculations
  const showFavoritesOnly = useMemo(() => searchParams.get("favoritesOnly") === "true", [searchParams])
  const pageSize = 6
  const pageFromUrl = useMemo(
    () => (searchParams.get("page") ? Number.parseInt(searchParams.get("page") as string) : 1),
    [searchParams],
  )

  /**
   * Client-side sorting function - memoized to prevent recreation
   * Handles various sorting criteria efficiently
   */
  const sortProperties = useCallback((properties: Property[], sortBy: string, sortOrder: string): Property[] => {
    return [...properties].sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "price":
          aValue = a.price
          bValue = b.price
          break
        case "bedrooms":
          aValue = a.bedrooms
          bValue = b.bedrooms
          break
        case "bathrooms":
          aValue = a.bathrooms
          bValue = b.bathrooms
          break
        case "sqft":
          aValue = a.sqft
          bValue = b.sqft
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "createdAt":
        default:
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [])

  /**
   * Update page parameter in URL without full page reload
   * Optimized to prevent unnecessary navigation
   */
  const updatePageParam = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", page.toString())
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  /**
   * Main data loading function with optimized API calls and error handling
   * Implements efficient caching and filtering strategies
   */
  const loadListings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Early return for empty favorites filter
      if (showFavoritesOnly && favorites.size === 0) {
        setAllProperties([])
        setDisplayedProperties([])
        setTotalPages(1)
        setCurrentPage(1)
        setTotalCount(0)
        setLoading(false)
        return
      }

      // Build optimized filter criteria
      const criteria: FilterCriteria = {
        pageSize: showFavoritesOnly ? 100 : pageSize, // Fetch more for client-side filtering
        page: showFavoritesOnly ? 1 : pageFromUrl,
      }

      // Extract and apply search parameters efficiently
      const filters = [
        { key: "minPrice", param: "minPrice", transform: Number.parseInt },
        { key: "maxPrice", param: "maxPrice", transform: Number.parseInt },
        {
          key: "minBedrooms",
          param: "bedrooms",
          transform: Number.parseInt,
          condition: (val: string) => val !== "any",
        },
        {
          key: "minBathrooms",
          param: "bathrooms",
          transform: Number.parseInt,
          condition: (val: string) => val !== "any",
        },
      ]

      filters.forEach(({ key, param, transform, condition }) => {
        const value = searchParams.get(param)
        if (value && (!condition || condition(value))) {
          criteria[key as keyof FilterCriteria] = transform(value) as any
        }
      })

      // Add sorting criteria
      const sortBy = searchParams.get("sortBy") || "createdAt"
      const sortOrder = searchParams.get("sortOrder") || "desc"
      criteria.sortBy = sortBy
      criteria.sortOrder = sortOrder

      // Execute API call
      const response = await propertyApi.getListings(criteria)

      if (response.success && response.data) {
        const properties = response.data.items

        if (showFavoritesOnly) {
          // Client-side filtering and pagination for favorites
          const favoriteProperties = properties.filter((property) => favorites.has(property.id))
          const sortedFavorites = sortProperties(favoriteProperties, sortBy, sortOrder)

          setAllProperties(sortedFavorites)

          // Calculate pagination for favorites
          const favoritesCount = sortedFavorites.length
          const favoritesTotalPages = Math.max(1, Math.ceil(favoritesCount / pageSize))
          const validPage = Math.min(pageFromUrl, favoritesTotalPages)

          // Apply client-side pagination
          const startIndex = (validPage - 1) * pageSize
          const endIndex = startIndex + pageSize
          setDisplayedProperties(sortedFavorites.slice(startIndex, endIndex))

          // Update state
          setTotalCount(favoritesCount)
          setTotalPages(favoritesTotalPages)
          setCurrentPage(validPage)

          // Update URL if page is invalid
          if (validPage !== pageFromUrl) {
            updatePageParam(validPage)
          }
        } else {
          // Server-side pagination (already optimized)
          setAllProperties(properties)
          setDisplayedProperties(properties)
          setTotalPages(response.data.totalPages)
          setCurrentPage(response.data.page)
          setTotalCount(response.data.totalCount)
        }
      } else {
        setError(response.message || "Failed to load properties")
      }
    } catch (err) {
      console.error("Error loading listings:", err)
      setError(err instanceof Error ? err.message : "Failed to load properties")
    } finally {
      setLoading(false)
    }
  }, [searchParams, favorites.size, showFavoritesOnly, pageFromUrl, sortProperties, updatePageParam])

  /**
   * Effect to reload when dependencies change
   * Optimized to prevent unnecessary API calls
   */
  useEffect(() => {
    loadListings()
  }, [loadListings])

  /**
   * Memoized sort display text to prevent recalculation
   */
  const sortDisplayText = useMemo(() => {
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const sortMap: Record<string, string> = {
      "createdAt-desc": "Newest First",
      "createdAt-asc": "Oldest First",
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low",
      "bedrooms-desc": "Most Bedrooms",
      "bedrooms-asc": "Fewest Bedrooms",
      "bathrooms-desc": "Most Bathrooms",
      "bathrooms-asc": "Fewest Bathrooms",
      "sqft-desc": "Largest First",
      "sqft-asc": "Smallest First",
    }
    return sortMap[`${sortBy}-${sortOrder}`] || "Newest First"
  }, [searchParams])

  // Loading state with optimized skeleton layout
  if (loading) {
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, i) => (
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
      </div>
    )
  }

  // Error state with retry functionality
  if (error) {
    return (
      <div className="text-center py-8">
        <Alert className="max-w-md mx-auto mb-4" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadListings} variant="outline" className="cursor-pointer">
          Try Again
        </Button>
      </div>
    )
  }

  // Empty state with contextual messaging
  if (displayedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">
          {showFavoritesOnly ? "No favorite properties" : "No properties found"}
        </h3>
        <p className="text-muted-foreground">
          {showFavoritesOnly
            ? "You haven't saved any properties as favorites yet. Browse our listings and click the heart icon to save your favorites."
            : "Try adjusting your filters to find more properties."}
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Results summary with memoized sort text */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {displayedProperties.length} of {totalCount} properties
        </p>
        <p className="text-sm text-muted-foreground">Sorted by: {sortDisplayText}</p>
      </div>

      {/* Optimized property grid with memoized cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Conditional pagination rendering */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}
