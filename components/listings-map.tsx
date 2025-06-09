"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Map } from "./map"
import { propertyApi, type Property } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ListingsMapProps {
  properties?: Property[]
  className?: string
}

export function ListingsMap({ properties: propProperties, className }: ListingsMapProps) {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>(propProperties || [])
  const [loading, setLoading] = useState(!propProperties)
  const [error, setError] = useState<string | null>(null)

  // Generate coordinates based on property ID for demo purposes
  const generateCoordinates = (id: number): [number, number] => {
    const baseLatitude = 40.7128
    const baseLongitude = -74.006

    const latOffset = ((id * 7) % 200) / 1000 - 0.1 // ±0.1 degrees
    const lngOffset = ((id * 11) % 200) / 1000 - 0.1 // ±0.1 degrees

    return [baseLatitude + latOffset, baseLongitude + lngOffset]
  }

  // Load properties if not provided
  useEffect(() => {
    if (!propProperties) {
      const loadProperties = async () => {
        try {
          setLoading(true)
          const response = await propertyApi.getListings({ pageSize: 50 })
          if (response.success && response.data) {
            setProperties(response.data.items)
          } else {
            setError("Failed to load properties for map")
          }
        } catch (err) {
          setError("Failed to load properties for map")
        } finally {
          setLoading(false)
        }
      }
      loadProperties()
    }
  }, [propProperties])

  if (loading) {
    return (
      <div className={className}>
        <Skeleton className="h-[500px] w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const markers = properties.map((property) => ({
    id: property.id,
    position: generateCoordinates(property.id),
    title: property.title,
    price: property.price,
    onClick: () => router.push(`/listings/${property.id}`),
  }))

  return (
    <div className={className}>
      <Map center={[40.7128, -74.006]} zoom={12} markers={markers} height="500px" />
    </div>
  )
}
