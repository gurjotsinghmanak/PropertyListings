"use client"

import { Map } from "./map"

interface PropertyMapProps {
  property: {
    id: number
    title: string
    price: number
    address: string
  }
  className?: string
}

export function PropertyMap({ property, className }: PropertyMapProps) {
  // Generate coordinates based on property ID for demo purposes
  // In a real app, you'd have actual coordinates from your API
  const generateCoordinates = (id: number): [number, number] => {
    // Base coordinates for demo (New York area)
    const baseLatitude = 40.7128
    const baseLongitude = -74.006

    // Generate pseudo-random but consistent coordinates based on ID
    const latOffset = ((id * 7) % 100) / 1000 - 0.05 // ±0.05 degrees
    const lngOffset = ((id * 11) % 100) / 1000 - 0.05 // ±0.05 degrees

    return [baseLatitude + latOffset, baseLongitude + lngOffset]
  }

  const coordinates = generateCoordinates(property.id)

  const markers = [
    {
      id: property.id,
      position: coordinates,
      title: property.title,
      price: property.price,
    },
  ]

  return (
    <div className={className}>
      <h3 className="font-medium text-lg mb-4">Location</h3>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{property.address}</p>
        <Map center={coordinates} zoom={15} markers={markers} height="300px" />
      </div>
    </div>
  )
}
