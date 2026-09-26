'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPageNumbers } from '@/lib/pagination'

type Props = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
}: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) params.delete('page')
    else params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Info */}
      <p className="text-xs text-on-surface-variant order-2 sm:order-1">
        Menampilkan{' '}
        <span className="font-semibold text-on-surface">{startItem}</span>–
        <span className="font-semibold text-on-surface">{endItem}</span> dari{' '}
        <span className="font-semibold text-on-surface">
          {totalItems.toLocaleString('id-ID')}
        </span>{' '}
        user
      </p>

      {/* Pages */}
      <nav className="flex items-center gap-1 order-1 sm:order-2">
        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pages.map((page, i) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm"
              >
                …
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary-container to-[#E03E3E] text-white shadow-[0_4px_12px_rgba(220,38,38,0.25)]'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  )
}