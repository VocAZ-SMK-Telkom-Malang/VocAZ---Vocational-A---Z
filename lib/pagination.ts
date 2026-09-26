export const DEFAULT_PAGE_SIZE = 20

export type PaginationResult = {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  hasNext: boolean
  hasPrev: boolean
}

export function parsePageParam(
  value: string | undefined,
  fallback = 1
): number {
  const n = parseInt(value || '', 10)
  return isNaN(n) || n < 1 ? fallback : n
}

export function buildPaginationMeta(
  totalItems: number,
  currentPage: number,
  pageSize: number = DEFAULT_PAGE_SIZE
): PaginationResult {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)

  return {
    currentPage: safePage,
    totalPages,
    totalItems,
    pageSize,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  }
}

/**
 * Generate daftar halaman untuk ditampilkan:
 * contoh output: [1, 2, 3, '...', 7, 8, 9, 10]
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): (number | '...')[] {
  const totalNumbers = siblingCount * 2 + 5 // first + last + current + 2 ellipsis

  // Kalau halaman sedikit, tampil semua
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1)
  const rightSibling = Math.min(currentPage + siblingCount, totalPages)

  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < totalPages - 1

  const pages: (number | '...')[] = []

  // Selalu tampil halaman 1
  pages.push(1)

  // Ellipsis kiri
  if (showLeftEllipsis) {
    pages.push('...')
  } else {
    // Kalau tidak ada ellipsis, isi halaman antara 1 dan leftSibling
    for (let i = 2; i < leftSibling; i++) {
      pages.push(i)
    }
  }

  // Halaman di sekitar current
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i)
    }
  }

  // Ellipsis kanan
  if (showRightEllipsis) {
    pages.push('...')
  } else {
    // Kalau tidak ada ellipsis, isi halaman antara rightSibling dan totalPages
    for (let i = rightSibling + 1; i < totalPages; i++) {
      pages.push(i)
    }
  }

  // Selalu tampil halaman terakhir
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  // Dedupe & sort (kecuali ellipsis)
  const seen = new Set<number>()
  const result: (number | '...')[] = []
  for (const p of pages) {
    if (p === '...') {
      result.push(p)
    } else if (!seen.has(p)) {
      seen.add(p)
      result.push(p)
    }
  }

  return result
}