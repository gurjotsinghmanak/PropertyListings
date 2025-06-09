import { ListingsGrid } from "@/components/listings-grid"
import { FilterSidebar } from "@/components/filter-sidebar"
import { QuickSort } from "@/components/quick-sort"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Map } from "lucide-react"

export default function ListingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Property Listings</h1>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/listings/map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map View
            </Link>
          </Button>
          <div className="hidden sm:block">
            <QuickSort />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <FilterSidebar />
        </div>
        <div className="w-full md:w-3/4">
          <div className="block sm:hidden mb-4">
            <QuickSort />
          </div>
          <ListingsGrid />
        </div>
      </div>
    </div>
  )
}
