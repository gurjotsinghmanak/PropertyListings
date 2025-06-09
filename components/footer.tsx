import Link from "next/link"
import { Home } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6" />
              <span className="font-bold text-xl">PropertyFinder</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Find your dream home with our extensive property listings.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/listings" className="hover:text-primary">
                  Listings
                </Link>
              </li>
              <li>
                <Link href="/listings/map" className="hover:text-primary">
                  Map View
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>123 Property Street</p>
              <p>Real Estate City, RE 12345</p>
              <p className="mt-2">Email: info@propertyfinder.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PropertyFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
