import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold mb-4">Property Not Found</h2>
      <p className="text-muted-foreground mb-6">Sorry, we couldn't find the property you're looking for.</p>
      <Link
        href="/listings"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Back to Listings
      </Link>
    </div>
  )
}
