export async function fetchAPI(endpoint: string, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  const url = `${baseUrl}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API fetch error:", error)
    throw error
  }
}
