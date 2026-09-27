// components/showcase/feed/showcase-feed.tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Loader2, ChevronUp, ChevronDown, Video, X } from 'lucide-react'
import { ShowcaseFeedItem } from './showcase-feed-item'
import { ShowcaseCommentSheet } from './showcase-comment-sheet'
import {
  fetchShowcaseFeed,
  incrementShowcaseView,
} from '@/lib/student/actions'

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
  viewCount: bigint
  publishedAt: Date | null      // ← TAMBAH
  createdAt: Date               // ← TAMBAH
  student: {
    id: string
    user: {
      id: string
      fullName: string | null
      avatarUrl: string | null
    }
    school: {
      id: string
      name: string
    } | null
  }
}

type CommentTarget = {
  videoId: string
  ownerId: string
}

type Props = {
  initialVideos: Video[]
  initialHasMore: boolean
  currentUserId: string | null
  currentUserRole: string | null
  currentStudentProfileId: string | null
  likedVideoIds: string[]
  followingStudentIds: string[]
}

export function ShowcaseFeed({
  initialVideos,
  initialHasMore,
  currentUserId,
  currentUserRole,
  currentStudentProfileId,
  likedVideoIds,
  followingStudentIds,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [videos, setVideos] = useState(initialVideos)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [commentTarget, setCommentTarget] = useState<CommentTarget | null>(
    null
  )

  const likedSet = new Set(likedVideoIds)
  const followingSet = new Set(followingStudentIds)

  const uniqueVideos = videos.filter(
    (video, index, self) =>
      self.findIndex((v) => v.id === video.id) === index
  )

  const loadMore = useCallback(async () => {
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const result = await fetchShowcaseFeed({
        page: nextPage,
        limit: 5,
        excludeStudentId: currentStudentProfileId || undefined,
      })

      setVideos((prev) => {
        const existingIds = new Set(prev.map((v) => v.id))
        const newVideos = (result.videos as Video[]).filter(
          (v) => !existingIds.has(v.id)
        )
        return [...prev, ...newVideos]
      })
      setHasMore(result.hasMore)
      setPage(nextPage)
    } catch (err) {
      console.error('Load more error:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [page, loadingMore, currentStudentProfileId])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const itemHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / itemHeight)
      setActiveIndex(newIndex)

      const totalItems = uniqueVideos.length
      if (newIndex >= totalItems - 2 && hasMore && !loadingMore) {
        loadMore()
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [uniqueVideos.length, hasMore, loadingMore, loadMore])

  const handleViewed = useCallback((videoId: string) => {
    incrementShowcaseView(videoId).catch(() => {})
  }, [])

  function scrollToIndex(index: number) {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: 'smooth',
    })
  }

  // ============================================
  // EMPTY STATE
  // ============================================

  if (uniqueVideos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white relative">
        <Link
          href="/student/dashboard"
          className="lg:hidden absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Kembali"
        >
          <X className="w-5 h-5" />
        </Link>
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-white/70" />
          </div>
          <h3 className="font-display text-lg font-bold mb-2">
            Belum ada video showcase
          </h3>
          <p className="text-sm text-white/70">
            Video showcase akan muncul di sini setelah siswa mulai upload.
          </p>
        </div>
      </div>
    )
  }

  // ============================================
  // RENDER FEED
  // ============================================

  return (
    <>
      <div className="relative w-full h-full bg-black">
        <div
          ref={containerRef}
          className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {uniqueVideos.map((video, index) => (
            <div
              key={video.id}
              className="w-full h-full snap-start snap-always relative"
            >
              <ShowcaseFeedItem
                video={video}
                isActive={index === activeIndex}
                isLiked={likedSet.has(video.id)}
                isFollowing={followingSet.has(video.student.id)}
                currentUserRole={currentUserRole}
                currentStudentProfileId={currentStudentProfileId}
                onOpenComments={(videoId) =>
                  setCommentTarget({
                    videoId,
                    ownerId: video.student.id,
                  })
                }
                onViewed={handleViewed}
              />
            </div>
          ))}

          {loadingMore && (
            <div className="w-full h-20 flex items-center justify-center bg-black">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Close / Back button — mobile only */}
        <Link
          href="/student/dashboard"
          className="lg:hidden absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Kembali ke dashboard"
        >
          <X className="w-5 h-5" />
        </Link>

        {/* Nav buttons — desktop only */}
        <div className="hidden lg:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-30">
          <button
            type="button"
            onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Video sebelumnya"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() =>
              scrollToIndex(
                Math.min(uniqueVideos.length - 1, activeIndex + 1)
              )
            }
            disabled={
              activeIndex === uniqueVideos.length - 1 && !hasMore
            }
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Video berikutnya"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Counter */}
        <div className="absolute top-4 right-16 z-30 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
          <span className="text-xs font-semibold text-white">
            {activeIndex + 1} / {uniqueVideos.length}
          </span>
        </div>
      </div>

      {commentTarget && (
        <ShowcaseCommentSheet
          videoId={commentTarget.videoId}
          videoOwnerId={commentTarget.ownerId}
          currentUserId={currentUserId}
          currentStudentProfileId={currentStudentProfileId}
          currentUserRole={currentUserRole}
          isOpen={!!commentTarget}
          onClose={() => setCommentTarget(null)}
        />
      )}
    </>
  )
}