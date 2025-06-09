"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

// Define types for our map props
interface MapProps {
  center?: [number, number]
  zoom?: number
  markers?: Array<{
    id: number
    position: [number, number]
    title: string
    price: number
    onClick?: () => void
  }>
  height?: string
  className?: string
}

export function Map({
  center = [40.7128, -74.006],
  zoom = 13,
  markers = [],
  height = "400px",
  className = "",
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current) return

      // Dynamically import Leaflet
      const L = (await import("leaflet")).default

      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Fix for default markers in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })

      // Initialize map if it doesn't exist
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current)
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Add new markers
      markers.forEach((markerData) => {
        const marker = L.marker(markerData.position).addTo(mapInstanceRef.current)

        // Create popup content
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold text-sm mb-1">${markerData.title}</h3>
            <p class="text-primary font-bold">$${markerData.price.toLocaleString()}</p>
          </div>
        `

        marker.bindPopup(popupContent)

        // Add click handler if provided
        if (markerData.onClick) {
          marker.on("click", markerData.onClick)
        }

        markersRef.current.push(marker)
      })

      // Fit bounds if multiple markers
      if (markers.length > 1) {
        const group = new L.featureGroup(markersRef.current)
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
      } else if (markers.length === 1) {
        mapInstanceRef.current.setView(markers[0].position, zoom)
      }
    }

    initMap()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, markers])

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-lg overflow-hidden border" />
      {markers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
