import { ListingsMap } from "@/components/listings-map"
import Link from "next/link"
import { ArrowLeft, List } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ListingsMapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <Link
            href="/listings"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Listings
          </Link>
          <h1 className="text-3xl font-bold">Property Map View</h1>
          <p className="text-muted-foreground mt-1">Explore properties on an interactive map</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/listings" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            List View
          </Link>
        </Button>
      </div>

      <ListingsMap />

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Click on any marker to view property details. Zoom and pan to explore different areas.
        </p>
      </div>
    </div>
  )
}
