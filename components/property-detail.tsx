import Link from "next/link"
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FavoriteButton } from "./favorite-button"
import { PropertyMap } from "./property-map"
import { ImageCarousel } from "./image-carousel"

interface PropertyDetailProps {
  property: {
    id: number
    title: string
    price: number
    bedrooms: number
    bathrooms: number
    sqft: number
    description: string
    address: string
    imageUrl: string
    imageUrls: string[]
    features?: string[]
    propertyType?: string
    status?: string
    createdAt: string
    updatedAt: string
  }
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const { title, price, bedrooms, bathrooms, sqft, description, address, imageUrl, imageUrls, features, createdAt } =
    property

  // Use imageUrls from backend, fallback to single imageUrl if imageUrls is empty
  const carouselImages =
    imageUrls && imageUrls.length > 0 ? imageUrls : [imageUrl || `/placeholder.svg?height=600&width=1200`]

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate days since listing
  const getDaysSinceListing = (dateString: string) => {
    const listingDate = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - listingDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysSinceListing = getDaysSinceListing(createdAt)

  return (
    <div className="max-w-6xl mx-auto @container">
      <div className="mb-6">
        <Link
          href="/listings"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Listings
        </Link>
      </div>

      {/* Image Carousel */}
      <div className="mb-8 max-w-4xl mx-auto">
        <ImageCarousel
          images={carouselImages}
          alt={title}
          variant="detail"
          className="h-[400px] md:h-[500px]"
          showThumbnails={true}
          showCounter={true}
          showProgressDots={false}
        />
      </div>

      <div className="grid gap-8 @lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-balance">{title}</h1>
              <div className="flex items-center text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{address}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Listed on {formatDate(createdAt)}
                  {daysSinceListing === 1 && " (1 day ago)"}
                  {daysSinceListing > 1 && daysSinceListing <= 30 && ` (${daysSinceListing} days ago)`}
                  {daysSinceListing > 30 && daysSinceListing <= 60 && " (Over a month ago)"}
                  {daysSinceListing > 60 && " (Over 2 months ago)"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton propertyId={property.id} />
              <Badge className="text-lg px-3 py-1 bg-primary">${price.toLocaleString()}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/40 rounded-lg mb-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Bed className="h-5 w-5 mr-1.5" />
                <span className="font-medium">{bedrooms}</span>
              </div>
              <span className="text-sm text-muted-foreground">{bedrooms === 1 ? "Bedroom" : "Bedrooms"}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Bath className="h-5 w-5 mr-1.5" />
                <span className="font-medium">{bathrooms}</span>
              </div>
              <span className="text-sm text-muted-foreground">{bathrooms === 1 ? "Bathroom" : "Bathrooms"}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-1">
                <Maximize className="h-5 w-5 mr-1.5" />
                <span className="font-medium">{sqft.toLocaleString()}</span>
              </div>
              <span className="text-sm text-muted-foreground">Square Feet</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="text-pretty">{description}</p>
            </div>
          </div>

          {features && features.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Features</h2>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <PropertyMap property={property} className="mb-8" />
        </div>

        <div>
          <div className="sticky top-6 bg-card rounded-lg border p-6">
            <h3 className="font-medium text-lg mb-4">Contact Agent</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm">Phone: (123) 456-7890</p>
                <p className="text-sm">Email: john@propertyfinder.com</p>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Listed</p>
                    <p className="text-muted-foreground">{formatDate(createdAt)}</p>
                  </div>
                </div>
              </div>

              <Button className="w-full cursor-pointer">Request a Tour</Button>
              <Button variant="outline" className="w-full cursor-pointer">
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
