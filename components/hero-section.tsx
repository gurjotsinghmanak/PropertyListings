import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

/**
 * Optimized Hero Section with proper image loading
 * - Removed redundant preload (Next.js Image with priority handles this)
 * - Optimized image parameters for better performance
 * - Enhanced visual design with the new architecture image
 */
export function HeroSection() {
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Optimized hero image with Next.js automatic optimization */}
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85"
        alt="Modern luxury home with contemporary architecture and beautiful lighting"
        fill
        priority // This handles preloading automatically and efficiently
        quality={85} // Balanced quality vs file size
        sizes="100vw" // Full viewport width
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />

      {/* Enhanced gradient overlay that complements the warm architectural lighting */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-slate-800/30 to-transparent z-10" />

      {/* Content container with enhanced styling */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-20">
        <div className="max-w-2xl">
          {/* Enhanced typography with excellent contrast */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white drop-shadow-xl">
            Find Your Dream Home
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/95 drop-shadow-lg max-w-xl leading-relaxed">
            Discover the perfect property from our extensive collection of premium listings in prime locations.
          </p>

          {/* Enhanced call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/listings">Browse Listings</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/15 backdrop-blur-md border-white/40 text-white hover:bg-white/25 hover:text-white shadow-lg transition-all duration-300"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
