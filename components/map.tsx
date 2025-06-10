"use client"

import { useEffect, useRef, useCallback } from "react"
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

/**
 * Optimized Map component with lazy loading and performance enhancements
 * - Dynamic import of Leaflet to reduce initial bundle size
 * - Proper cleanup and memory management
 * - Memoized marker creation and updates
 */
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

  /**
   * Cleanup function to properly dispose of map resources
   * Prevents memory leaks when component unmounts
   */
  const cleanup = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }
    markersRef.current = []
  }, [])

  useEffect(() => {
    const initMap = async () => {
      if (typeof window === "undefined" || !mapRef.current) return

      try {
        // Dynamic import to reduce initial bundle size
        const L = (await import("leaflet")).default

        // Lazy load CSS only when needed
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          link.onload = () => console.log("Leaflet CSS loaded")
          document.head.appendChild(link)
        }

        // Fix for default markers in Leaflet - only set once
        if (!L.Icon.Default.prototype._getIconUrl) {
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          })
        }

        // Initialize map only once
        if (!mapInstanceRef.current && mapRef.current) {
          mapInstanceRef.current = L.map(mapRef.current, {
            // Performance optimizations
            preferCanvas: true,
            zoomControl: true,
            attributionControl: true,
          }).setView(center, zoom)

          // Add tile layer with error handling
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            // Performance optimizations
            updateWhenIdle: true,
            updateWhenZooming: false,
          }).addTo(mapInstanceRef.current)
        }

        // Clear existing markers efficiently
        markersRef.current.forEach((marker) => {
          if (mapInstanceRef.current && marker) {
            mapInstanceRef.current.removeLayer(marker)
          }
        })
        markersRef.current = []

        // Add new markers with optimized popup creation
        markers.forEach((markerData) => {
          if (!mapInstanceRef.current) return

          const marker = L.marker(markerData.position).addTo(mapInstanceRef.current)

          // Create optimized popup content
          const popupContent = `
            <div class="p-2">
              <h3 class="font-semibold text-sm mb-1">${markerData.title}</h3>
              <p class="text-primary font-bold">$${markerData.price.toLocaleString()}</p>
            </div>
          `

          marker.bindPopup(popupContent, {
            // Performance optimizations for popups
            autoPan: false,
            closeOnEscapeKey: true,
          })

          // Add click handler if provided
          if (markerData.onClick) {
            marker.on("click", markerData.onClick)
          }

          markersRef.current.push(marker)
        })

        // Optimize map bounds fitting
        if (markers.length > 1 && mapInstanceRef.current) {
          const group = new L.featureGroup(markersRef.current)
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), {
            // Animation optimizations
            animate: true,
            duration: 0.5,
          })
        } else if (markers.length === 1 && mapInstanceRef.current) {
          mapInstanceRef.current.setView(markers[0].position, zoom, {
            animate: true,
            duration: 0.5,
          })
        }
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initMap()

    // Cleanup on unmount
    return cleanup
  }, [center, zoom, markers, cleanup])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        style={{ height, width: "100%" }}
        className="rounded-lg overflow-hidden border"
        role="application"
        aria-label="Interactive map showing property locations"
      />
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
