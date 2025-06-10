"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const handlePageChange = (pageNumber: number) => {
    router.push(createPageURL(pageNumber), { scroll: true })
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={currentPage <= 1 ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1
          const isCurrentPage = page === currentPage

          // If 5 or fewer pages, show all pages
          if (totalPages <= 5) {
            return (
              <Button
                key={page}
                variant={isCurrentPage ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 ${isCurrentPage ? "" : "cursor-pointer"}`}
                disabled={isCurrentPage}
              >
                {page}
              </Button>
            )
          }

          // For more than 5 pages, show limited page numbers with ellipsis
          if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
            return (
              <Button
                key={page}
                variant={isCurrentPage ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 ${isCurrentPage ? "" : "cursor-pointer"}`}
                disabled={isCurrentPage}
              >
                {page}
              </Button>
            )
          }

          // Show ellipsis for skipped pages (only when more than 5 pages)
          if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="px-2">
                ...
              </span>
            )
          }

          return null
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={currentPage >= totalPages ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
