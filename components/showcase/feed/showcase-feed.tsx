// components/showcase/feed/showcase-feed.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Video } from 'lucide-react'
import { ShowcaseFeedHero } from './showcase-feed-hero'
import { ShowcaseFeedViewer } from './showcase-feed-viewer'
import { fetchShowcaseFeed } from '@/lib/student/actions'

type Video = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  videoSource: string
  thumbnailUrl: string | null
  skillTags: string[]
  likeCount: number
  commentCount: number
  shareCount: number
  viewCount: number
  durationSec: number | null
  publishedAt: string | Date | null
  createdAt: string | Date
  student: {
    id: string
    fullName: string
    avatarUrl: string | null
    schoolName: string | null
    headline: string | null
  }
}

type Props = {
  
  initialVideos: Video[]
  initialHasMore: boolean
  currentUserId: string | null
  currentUserRole: string
  currentStudentProfileId: string | null
  likedVideoIds: string[]
  followingStudentIds: string[]
}

type SortKey = 'terbaru' | 'terpopuler' | 'trending' | 'views'

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: 'software', label: 'Software' },
  { value: 'network', label: 'Jaringan' },
  { value: 'multimedia', label: 'Multimedia' },
  { value: 'mechatronics', label: 'Mekatronika' },
  { value: 'automotive', label: 'Otomotif' },
  { value: 'business', label: 'Bisnis' },
  { value: 'other', label: 'Lainnya' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'terpopuler', label: 'Terpopuler' },
  { value: 'trending', label: 'Trending' },
  { value: 'views', label: 'Paling Dilihat' },
]

export function ShowcaseFeed({
  initialVideos,
  initialHasMore,
  currentUserId,
  currentStudentProfileId,
  likedVideoIds,
  followingStudentIds,
}: Props) {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState<SortKey>('terbaru')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchShowcaseFeed({
        page: 1,
        limit: 15,
        excludeStudentId: currentStudentProfileId ?? undefined,
        search: debouncedSearch || undefined,
        category: category !== 'all' ? category : undefined,
        sort,
      })
      setVideos(res.videos as any)
      setHasMore(res.hasMore)
      setPage(1)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }, [debouncedSearch, category, sort, currentStudentProfileId])

  useEffect(() => {
    reload()
  }, [reload])

  const uniqueCreators = new Set(videos.map((v) => v.student.id)).size
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0)
  const activeFilterCount =
    (category !== 'all' ? 1 : 0) + (sort !== 'terbaru' ? 1 : 0)

  return (
    <div className="space-y-6 pb-12">
      {/* Hero */}
      <ShowcaseFeedHero
        search={search}
        onSearchChange={setSearch}
        totalVideos={videos.length}
        totalCreators={uniqueCreators}
        totalLikes={totalLikes}
        onFilterClick={() => setFilterOpen((v) => !v)}
        activeFilterCount={activeFilterCount}
      />

      {/* Filter panel */}
      {filterOpen && (
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
              Kategori
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    category === c.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
              Urutkan
            </p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSort(s.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    sort === s.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setCategory('all')
                setSort('terbaru')
              }}
              className="text-xs font-bold text-primary hover:underline underline-offset-4"
            >
              Reset filter
            </button>
          )}
        </div>
      )}

      {/* Viewer */}
      {loading && videos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
            <Video className="w-7 h-7 text-on-surface-variant/60" />
          </div>
          <p className="text-base font-bold text-on-surface mb-1">
            Tidak ada video
          </p>
          <p className="text-sm text-on-surface-variant">
            Coba ubah filter atau kata kunci
          </p>
        </div>
      ) : (
        <ShowcaseFeedViewer
          videos={videos}
          currentUserId={currentUserId}
          currentStudentProfileId={currentStudentProfileId}
          likedVideoIds={likedVideoIds}
          followingStudentIds={followingStudentIds}
        />
      )}
    </div>
  )
}