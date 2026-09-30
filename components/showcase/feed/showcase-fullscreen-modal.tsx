// components/showcase/feed/showcase-fullscreen-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { ShowcaseFeedItem } from './showcase-feed-item'

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
  videos: Video[]
  initialIndex: number
  onClose: () => void
  currentUserId: string | null
  currentStudentProfileId: string | null
  likedVideoIds: string[]
  followingStudentIds: string[]
}

export function ShowcaseFullscreenModal({
  videos,
  initialIndex,
  onClose,
  currentUserId,
  currentStudentProfileId,
  likedVideoIds,
  followingStudentIds,
}: Props) {
  const [index, setIndex] = useState(initialIndex)
  const [muted, setMuted] = useState(true)

  // ESC to close + arrow nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setIndex((i) => Math.min(videos.length - 1, i + 1))
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setIndex((i) => Math.max(0, i - 1))
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, videos.length])

  const video = videos[index]

  if (!video) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Tutup"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Mute toggle */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setMuted((v) => !v)
        }}
        className="absolute top-4 right-16 z-10 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold">
        {index + 1} / {videos.length}
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIndex(index - 1)
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next */}
      {index < videos.length - 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIndex(index + 1)
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Berikutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content */}
      <div
        className="w-full max-w-md h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <ShowcaseFeedItem
          video={video}
          currentUserId={currentUserId}
          currentStudentProfileId={currentStudentProfileId}
          initialLiked={likedVideoIds.includes(video.id)}
          initialFollowing={followingStudentIds.includes(video.student.id)}
          muted={muted}
          onClose={onClose}
        />
      </div>
    </div>
  )
}