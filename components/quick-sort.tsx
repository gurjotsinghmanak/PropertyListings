"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

export function QuickSort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortBy = searchParams.get("sortBy") || "createdAt"
  const sortOrder = searchParams.get("sortOrder") || "desc"

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-")
    const params = new URLSearchParams(searchParams.toString())

    params.set("sortBy", newSortBy)
    params.set("sortOrder", newSortOrder)
    params.set("page", "1") // Reset to first page when sorting changes

    router.push(`${pathname}?${params.toString()}`)
  }

  const getCurrentSortValue = () => {
    return `${sortBy}-${sortOrder}`
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px] cursor-pointer">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="bedrooms-desc">Most Bedrooms</SelectItem>
          <SelectItem value="bedrooms-asc">Fewest Bedrooms</SelectItem>
          <SelectItem value="bathrooms-desc">Most Bathrooms</SelectItem>
          <SelectItem value="bathrooms-asc">Fewest Bathrooms</SelectItem>
          <SelectItem value="sqft-desc">Largest First</SelectItem>
          <SelectItem value="sqft-asc">Smallest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
