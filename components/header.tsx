"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { useFavorites } from "@/lib/favorites-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // We'll keep the useFavorites hook since it might be used elsewhere in the component
  const { favorites } = useFavorites()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6" />
            <span className="font-bold text-xl">PropertyFinder</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium hover:text-primary">
                Home
              </Link>
              <Link href="/listings" className="text-sm font-medium hover:text-primary">
                Listings
              </Link>
              <Link href="/listings/map" className="text-sm font-medium hover:text-primary">
                Map
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary">
                About
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary">
                Contact
              </Link>
            </nav>
            <ModeToggle />
          </div>

          <div className="md:hidden flex items-center">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background p-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-6 w-6" />
                <span className="font-bold text-xl">PropertyFinder</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="mt-6 flex flex-col space-y-4">
              <Link href="/" className="text-base font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link
                href="/listings"
                className="text-base font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Listings
              </Link>
              <Link
                href="/listings/map"
                className="text-base font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Map View
              </Link>
              <Link
                href="/about"
                className="text-base font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-base font-medium hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
