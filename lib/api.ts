const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Request cache to prevent duplicate API calls
const requestCache = new Map<string, Promise<any>>()

export interface Property {
  id: number
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  description: string
  address: string
  imageUrl: string
  imageUrls: string[]
  isFeatured: boolean
  features: string[]
  propertyType: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  errors: string[]
}

export interface FilterCriteria {
  page?: number
  pageSize?: number
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  minSqft?: number
  maxSqft?: number
  propertyType?: string
  status?: string
  isFeatured?: boolean
  searchTerm?: string
  sortBy?: string
  sortOrder?: string
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: string[] = [],
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Optimized API request function with caching and deduplication
 * Prevents multiple identical requests from being made simultaneously
 */
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const cacheKey = `${url}-${JSON.stringify(options)}`

  // Return cached promise if request is already in flight
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)
  }

  const requestPromise = (async () => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        // Add timeout for better UX
        signal: AbortSignal.timeout(10000), // 10 second timeout
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(response.status, data.message || "An error occurred", data.errors || [])
      }

      return data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      // Handle network and timeout errors
      if (error instanceof DOMException && error.name === "TimeoutError") {
        throw new ApiError(0, "Request timed out. Please try again.")
      }

      throw new ApiError(0, "Failed to connect to API server. Please check your connection and try again.")
    } finally {
      // Remove from cache after completion
      requestCache.delete(cacheKey)
    }
  })()

  // Cache the promise
  requestCache.set(cacheKey, requestPromise)

  return requestPromise
}

/**
 * Property API with optimized methods and intelligent caching
 */
export const propertyApi = {
  /**
   * Get paginated listings with efficient parameter handling
   */
  async getListings(criteria: FilterCriteria = {}): Promise<ApiResponse<PaginatedResult<Property>>> {
    const params = new URLSearchParams()

    // Efficiently build query parameters
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString())
      }
    })

    const queryString = params.toString()
    const endpoint = `/listings${queryString ? `?${queryString}` : ""}`

    return apiRequest<ApiResponse<PaginatedResult<Property>>>(endpoint)
  },

  /**
   * Get single listing by ID with caching
   */
  async getListingById(id: number): Promise<ApiResponse<Property>> {
    return apiRequest<ApiResponse<Property>>(`/listings/${id}`)
  },

  /**
   * Search listings with optimized parameter handling
   */
  async searchListings(criteria: FilterCriteria = {}): Promise<ApiResponse<Property[]>> {
    const params = new URLSearchParams()

    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString())
      }
    })

    const queryString = params.toString()
    const endpoint = `/listings/search${queryString ? `?${queryString}` : ""}`

    return apiRequest<ApiResponse<Property[]>>(endpoint)
  },

  /**
   * Get featured listings with optimized query
   */
  async getFeaturedListings(): Promise<ApiResponse<Property[]>> {
    return this.searchListings({
      isFeatured: true,
      sortBy: "createdAt",
      sortOrder: "desc",
    })
  },

  /**
   * Create new listing
   */
  async createListing(listing: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Property>> {
    return apiRequest<ApiResponse<Property>>("/listings", {
      method: "POST",
      body: JSON.stringify(listing),
    })
  },

  /**
   * Update listing
   */
  async updateListing(id: number, listing: Partial<Property>): Promise<ApiResponse<Property>> {
    return apiRequest<ApiResponse<Property>>(`/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(listing),
    })
  },

  /**
   * Delete listing
   */
  async deleteListing(id: number): Promise<ApiResponse<void>> {
    return apiRequest<ApiResponse<void>>(`/listings/${id}`, {
      method: "DELETE",
    })
  },
}
