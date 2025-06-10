import Link from "next/link"
import { memo } from "react"
import { Bed, Bath, Maximize, MapPin } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FavoriteButton } from "./favorite-button"
import { ImageCarousel } from "./image-carousel"

interface PropertyCardProps {
  property: {
    id: number
    title: string
    price: number
    bedrooms: number
    bathrooms: number
    sqft: number
    address: string
    imageUrl: string
    imageUrls?: string[]
    isFeatured?: boolean
    propertyType?: string
    status?: string
    createdAt?: string
  }
}

/**
 * PropertyCard component displays a single property listing in a card format
 * Memoized to prevent unnecessary re-renders when parent components update
 */
function PropertyCardComponent({ property }: PropertyCardProps) {
  const { id, title, price, bedrooms, bathrooms, sqft, address, imageUrl, imageUrls, isFeatured, createdAt } = property

  // Use imageUrls if available, otherwise fallback to single imageUrl
  // Memoize the image array to prevent recreation on every render
  const carouselImages =
    imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl || "/placeholder.svg?height=225&width=400"]

  /**
   * Check if listing is new (within last 7 days)
   * Only calculate when createdAt is available to avoid unnecessary computations
   */
  const isNewListing = () => {
    if (!createdAt) return false
    const listingDate = new Date(createdAt)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - listingDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  // Cache the new listing status to avoid recalculation
  const isNew = isNewListing()

  return (
    <Card className="property-card h-full flex flex-col @container">
      {/* Image carousel with lazy loading and optimized performance */}
      <div className="relative">
        <ImageCarousel
          images={carouselImages}
          alt={title}
          variant="card"
          showThumbnails={false}
          showCounter={false}
          showProgressDots={true}
        />

        {/* Overlay badges positioned absolutely for better performance */}
        <div className="absolute top-2 right-2 flex items-center gap-2 z-40">
          <FavoriteButton propertyId={id} size="sm" className="bg-background/80 backdrop-blur-sm" />
          {isNew && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              New
            </Badge>
          )}
          {isFeatured && <Badge className="bg-primary">Featured</Badge>}
        </div>
      </div>

      {/* Property details with semantic structure */}
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1 text-pretty">{title}</h3>
          <p className="font-bold text-primary">${price.toLocaleString()}</p>
        </div>

        {/* Address with location icon */}
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" aria-hidden="true" />
          <span className="line-clamp-1">{address}</span>
        </div>

        {/* Property specifications grid with responsive layout */}
        <div className="grid grid-cols-3 gap-2 text-sm @md:grid-cols-1 @lg:grid-cols-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span>
              {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span>
              {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>
          <div className="flex items-center">
            <Maximize className="h-4 w-4 mr-1.5 flex-shrink-0" aria-hidden="true" />
            <span>{sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </CardContent>

      {/* Call-to-action footer */}
      <CardFooter className="p-4 pt-0">
        <Link
          href={`/listings/${id}`}
          className="w-full inline-flex h-9 items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors"
          aria-label={`View details for ${title}`}
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}

// Export memoized component to prevent unnecessary re-renders
export const PropertyCard = memo(PropertyCardComponent)
