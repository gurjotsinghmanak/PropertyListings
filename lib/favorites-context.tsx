"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: Set<number>
  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  toggleFavorite: (id: number) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("property-favorites")
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[]
        setFavorites(new Set(favoriteIds))
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("property-favorites", JSON.stringify(Array.from(favorites)))
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error)
      }
    }
  }, [favorites, isLoaded])

  const addFavorite = (id: number) => {
    setFavorites((prev) => new Set([...prev, id]))
  }

  const removeFavorite = (id: number) => {
    setFavorites((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const isFavorite = (id: number) => {
    return favorites.has(id)
  }

  const toggleFavorite = (id: number) => {
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
