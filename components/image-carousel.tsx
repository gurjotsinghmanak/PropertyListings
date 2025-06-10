"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  variant?: "card" | "detail"
  showThumbnails?: boolean
  showCounter?: boolean
  showProgressDots?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onImageClick?: (e: React.MouseEvent) => void
}

/**
 * Optimized ImageCarousel component with performance enhancements
 * - Memoized navigation functions to prevent recreation
 * - Optimized image loading with Next.js Image component
 * - Lazy loading for non-critical images
 * - Debounced transitions to prevent rapid clicking issues
 */
export function ImageCarousel({
  images,
  alt,
  className,
  variant = "detail",
  showThumbnails = true,
  showCounter = true,
  showProgressDots = false,
  autoPlay = false,
  autoPlayInterval = 5000,
  onImageClick,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Configuration based on variant - memoized to prevent recalculation
  const config = useMemo(
    () => ({
      isCard: variant === "card",
      isDetail: variant === "detail",
    }),
    [variant],
  )

  /**
   * Auto-play functionality with cleanup
   * Only runs when autoPlay is enabled and there are multiple images
   */
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, images.length, currentIndex])

  /**
   * Memoized navigation functions to prevent recreation on every render
   * Includes transition debouncing to prevent rapid clicking issues
   */
  const goToPrevious = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (isTransitioning) return

      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))

      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 300)
    },
    [isTransitioning, images.length],
  )

  const goToNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (isTransitioning) return

      setIsTransitioning(true)
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))

      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 300)
    },
    [isTransitioning, images.length],
  )

  const goToSlide = useCallback(
    (index: number, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (isTransitioning || index === currentIndex) return

      setIsTransitioning(true)
      setCurrentIndex(index)
      setTimeout(() => setIsTransitioning(false), 300)
    },
    [isTransitioning, currentIndex],
  )

  const handleImageClick = useCallback(
    (e: React.MouseEvent) => {
      if (onImageClick) {
        onImageClick(e)
      }
    },
    [onImageClick],
  )

  // Early return for empty images array
  if (images.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl overflow-hidden bg-muted flex items-center justify-center",
          config.isCard ? "aspect-[16/9]" : "",
          className,
        )}
      >
        <p className={cn("text-muted-foreground", config.isCard ? "text-sm" : "")}>No images available</p>
      </div>
    )
  }

  // Optimized single image display for cards
  if (images.length === 1 && config.isCard) {
    return (
      <div className={cn("aspect-[16/9] overflow-hidden relative", className)}>
        <Image
          src={images[0] || "/placeholder.svg?height=225&width=400"}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2NjY2MiLz48L3N2Zz4="
          onClick={handleImageClick}
        />
      </div>
    )
  }

  return (
    <div className={cn("relative rounded-xl overflow-hidden group", config.isCard ? "aspect-[16/9]" : "", className)}>
      {/* Main Image Container with optimized transforms */}
      <div className="relative overflow-hidden h-full">
        <div
          className="flex h-full transition-transform duration-300 ease-in-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className={cn("w-full flex-shrink-0 relative", config.isCard ? "h-full" : "aspect-video")}>
              <Image
                src={image || (config.isCard ? "/placeholder.svg?height=225&width=400" : "/placeholder.svg")}
                alt={`${alt} - Image ${index + 1}`}
                fill
                sizes={
                  config.isCard
                    ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                }
                className={cn("object-cover", config.isCard ? "transition-transform hover:scale-105" : "")}
                priority={index === 0} // Prioritize first image
                loading={index === 0 ? "eager" : "lazy"} // Lazy load non-primary images
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjY2NjIi8+PC9zdmc+"
                onClick={handleImageClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Only render when multiple images exist */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10",
              config.isCard ? "left-1 h-6 w-6" : "left-2",
            )}
            onClick={goToPrevious}
            disabled={isTransitioning}
            aria-label="Previous image"
          >
            <ChevronLeft className={cn(config.isCard ? "h-3 w-3" : "h-4 w-4")} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10",
              config.isCard ? "right-1 h-6 w-6" : "right-2",
            )}
            onClick={goToNext}
            disabled={isTransitioning}
            aria-label="Next image"
          >
            <ChevronRight className={cn(config.isCard ? "h-3 w-3" : "h-4 w-4")} />
          </Button>
        </>
      )}

      {/* Image Counter - Conditionally rendered */}
      {images.length > 1 && showCounter && (
        <div
          className={cn(
            "absolute bg-background/80 backdrop-blur-sm rounded-md font-medium z-30",
            config.isCard ? "top-1 right-1 px-1.5 py-0.5 text-xs" : "top-2 right-2 px-2 py-1 text-xs",
          )}
        >
          {currentIndex + 1}
          {config.isCard ? "/" : " / "}
          {images.length}
        </div>
      )}

      {/* Progress Dots for cards - Optimized rendering */}
      {images.length > 1 && showProgressDots && config.isCard && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToSlide(index, e)}
              disabled={isTransitioning}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all cursor-pointer",
                index === currentIndex ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80",
                isTransitioning && "pointer-events-none",
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip for detail view - Lazy loaded thumbnails */}
      {images.length > 1 && showThumbnails && config.isDetail && (
        <div className="hidden md:block absolute bottom-4 left-4 right-4 z-20">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => goToSlide(index, e)}
                disabled={isTransitioning}
                className={cn(
                  "flex-shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all cursor-pointer",
                  index === currentIndex ? "border-white scale-105" : "border-white/40 hover:border-white/70",
                  isTransitioning && "pointer-events-none",
                )}
                aria-label={`Go to image ${index + 1}`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${alt} thumbnail ${index + 1}`}
                  width={64}
                  height={48}
                  className="object-cover w-full h-full"
                  loading="lazy" // All thumbnails are lazy loaded
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
