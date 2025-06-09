import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-10" />
      <div
        className="h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=500&width=1200')" }}
      >
        <div className="container mx-auto px-4 h-full flex items-center relative z-20">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">Find Your Dream Home</h1>
            <p className="text-lg mb-8 text-pretty">
              Discover the perfect property from our extensive collection of premium listings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/listings">Browse Listings</Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
