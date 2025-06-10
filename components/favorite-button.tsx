"use client"

import type React from "react"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/lib/favorites-context"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  propertyId: number
  className?: string
  size?: "sm" | "default" | "lg"
}

export function FavoriteButton({ propertyId, className, size = "default" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(propertyId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(propertyId)
  }

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon" : "icon"}
      onClick={handleClick}
      className={cn("hover:bg-background/80 transition-colors cursor-pointer", size === "sm" && "h-8 w-8", className)}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "transition-colors",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          favorite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500",
        )}
      />
    </Button>
  )
}
