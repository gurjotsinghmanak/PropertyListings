import { PropertyDetail } from "@/components/property-detail"
import { notFound } from "next/navigation"
import { propertyApi } from "@/lib/api"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PageProps) {
  try {
    // Await the params object before accessing its properties
    const { id } = await params

    const response = await propertyApi.getListingById(Number.parseInt(id))

    if (!response.success || !response.data) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <PropertyDetail property={response.data} />
      </div>
    )
  } catch (error) {
    console.error("Error loading property:", error)
    notFound()
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  try {
    const { id } = await params
    const response = await propertyApi.getListingById(Number.parseInt(id))

    if (response.success && response.data) {
      return {
        title: `${response.data.title} - PropertyFinder`,
        description: response.data.description,
      }
    }

    return {
      title: "Property Not Found - PropertyFinder",
      description: "The requested property could not be found.",
    }
  } catch (error) {
    return {
      title: "Property Not Found - PropertyFinder",
      description: "The requested property could not be found.",
    }
  }
}
