// app/showcase/page.tsx
import type { Metadata } from 'next'
import { ShowcaseClient } from './showcase-client'
import {
  getPublicShowcaseReels,
  getPublicShowcaseStats,
  getPublicShowcaseCategories,
  getShowcasePublicStats,
} from '@/lib/showcase-public'

export const metadata: Metadata = {
  title: 'Video Talent Showcase — VocAZ',
  description:
    'Tonton demonstrasi skill nyata dari siswa SMK terverifikasi BNSP & BKK.',
}

type Props = {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
  }>
}

export default async function PublicShowcasePage({ searchParams }: Props) {
  const params = await searchParams

  const search = params.search?.trim() || ''
  const category = params.category || 'all'
  const sort =
    (params.sort as 'terbaru' | 'terpopuler' | 'views' | 'az') || 'terpopuler'

  const [result, stats, categories, publicStats] = await Promise.all([
    getPublicShowcaseReels({
      search,
      category,
      sort,
      page: 1,
      pageSize: 50,
    }),
    getPublicShowcaseStats(),
    getPublicShowcaseCategories(),
    getShowcasePublicStats(),
  ])

  return (
    <ShowcaseClient
      reels={result.reels}
      stats={stats}
      publicStats={publicStats}
      categories={categories}
      initialFilters={{ search, category, sort }}
    />
  )
}