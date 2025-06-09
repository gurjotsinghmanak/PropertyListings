"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFavorites } from "@/lib/favorites-context"

export function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "any")
  const [bathrooms, setBathrooms] = useState(searchParams.get("bathrooms") || "any")
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt")
  const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc")
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(searchParams.get("favoritesOnly") === "true")

  const { favorites } = useFavorites()

  // Update price range slider when min/max price inputs change
  useEffect(() => {
    const min = minPrice ? Number.parseInt(minPrice) : 0
    const max = maxPrice ? Number.parseInt(maxPrice) : 2000000
    setPriceRange([min, max])
  }, [minPrice, maxPrice])

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    setMinPrice(values[0].toString())
    setMaxPrice(values[1].toString())
  }

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-")
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  const getCurrentSortValue = () => {
    return `${sortBy}-${sortOrder}`
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (bedrooms !== "any") params.set("bedrooms", bedrooms)
    if (bathrooms !== "any") params.set("bathrooms", bathrooms)
    if (sortBy !== "createdAt" || sortOrder !== "desc") {
      params.set("sortBy", sortBy)
      params.set("sortOrder", sortOrder)
    }
    if (showFavoritesOnly) params.set("favoritesOnly", "true")

    // Reset to page 1 when filters change
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setMinPrice("")
    setMaxPrice("")
    setBedrooms("any")
    setBathrooms("any")
    setSortBy("createdAt")
    setSortOrder("desc")
    setShowFavoritesOnly(false)
    setPriceRange([0, 2000000])
    router.push(pathname)
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="font-medium text-lg mb-4">Filter Properties</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="sort-by">Sort By</Label>
          <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
            <SelectTrigger id="sort-by" className="cursor-pointer">
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

        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>

          <div className="pt-4 px-2">
            <Slider
              value={priceRange}
              min={0}
              max={2000000}
              step={10000}
              onValueChange={handlePriceRangeChange}
              className="mb-6 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-price">Min Price</Label>
              <Input
                id="min-price"
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="cursor-text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-price">Max Price</Label>
              <Input
                id="max-price"
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="cursor-text"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger id="bedrooms" className="cursor-pointer">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Select value={bathrooms} onValueChange={setBathrooms}>
            <SelectTrigger id="bathrooms" className="cursor-pointer">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="favorites-only"
            checked={showFavoritesOnly}
            onChange={(e) => setShowFavoritesOnly(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
          />
          <Label
            htmlFor="favorites-only"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Show favorites only ({favorites.size})
          </Label>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button onClick={applyFilters} className="cursor-pointer">
            Apply Filters
          </Button>
          <Button variant="outline" onClick={resetFilters} className="cursor-pointer">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
