import Link from "next/link"
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

export function PropertyCard({ property }: PropertyCardProps) {
  const { id, title, price, bedrooms, bathrooms, sqft, address, imageUrl, imageUrls, isFeatured, createdAt } = property

  // Use imageUrls if available, otherwise fallback to single imageUrl
  const carouselImages =
    imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl || "/placeholder.svg?height=225&width=400"]

  // Check if listing is new (within last 7 days)
  const isNewListing = () => {
    if (!createdAt) return false
    const listingDate = new Date(createdAt)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - listingDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7
  }

  return (
    <Card className="property-card h-full flex flex-col @container">
      <div className="relative">
        <ImageCarousel
          images={carouselImages}
          alt={title}
          variant="card"
          showThumbnails={false}
          showCounter={false}
          showProgressDots={true}
        />
        <div className="absolute top-2 right-2 flex items-center gap-2 z-40">
          <FavoriteButton propertyId={id} size="sm" className="bg-background/80 backdrop-blur-sm" />
          {isNewListing() && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              New
            </Badge>
          )}
          {isFeatured && <Badge className="bg-primary">Featured</Badge>}
        </div>
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1 text-pretty">{title}</h3>
          <p className="font-bold text-primary">${price.toLocaleString()}</p>
        </div>

        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span className="line-clamp-1">{address}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm @md:grid-cols-1 @lg:grid-cols-3">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1.5" />
            <span>
              {bedrooms} {bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1.5" />
            <span>
              {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
            </span>
          </div>
          <div className="flex items-center">
            <Maximize className="h-4 w-4 mr-1.5" />
            <span>{sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link
          href={`/listings/${id}`}
          className="w-full inline-flex h-9 items-center justify-center rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
