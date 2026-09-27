// components/showcase/feed/showcase-feed-item.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, Play, ExternalLink } from 'lucide-react'
import { parseVideoUrl } from '@/lib/student/video-parser'
import { ShowcaseFeedInfo } from './showcase-feed-info'
import { ShowcaseFeedActions } from './showcase-feed-actions'

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
  publishedAt: Date | null
  createdAt: Date
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

type Props = {
  video: Video
  isActive: boolean
  isLiked: boolean
  isFollowing: boolean
  currentUserRole: string | null
  currentStudentProfileId: string | null
  onOpenComments: (videoId: string) => void
  onViewed?: (videoId: string) => void
}

export function ShowcaseFeedItem({
  video,
  isActive,
  isLiked,
  isFollowing,
  currentUserRole,
  currentStudentProfileId,
  onOpenComments,
  onViewed,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const viewedRef = useRef(false)

  const isUpload = video.videoSource === 'upload'
  const parsed = !isUpload ? parseVideoUrl(video.videoUrl) : null

  // Auto-play saat active (upload only)
  useEffect(() => {
    if (!isUpload) return
    const el = videoRef.current
    if (!el) return

    if (isActive) {
      el.currentTime = 0
      el.muted = muted
      el.play().catch(() => {
        // Browser block autoplay
      })

      if (!viewedRef.current && onViewed) {
        viewedRef.current = true
        onViewed(video.id)
      }
    } else {
      el.pause()
    }
  }, [isActive, isUpload, muted, onViewed, video.id])

  // Sync muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted
    }
  }, [muted])

  return (
    <div className="relative w-full h-full snap-start snap-always bg-black flex items-center justify-center overflow-hidden">
      {/* ============================================
          VIDEO CONTENT
          ============================================ */}
      {isUpload ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl || undefined}
          loop
          playsInline
          muted={muted}
          className="absolute inset-0 w-full h-full object-cover"
          onClick={() => {
            const el = videoRef.current
            if (!el) return
            if (el.paused) el.play()
            else el.pause()
          }}
        />
      ) : parsed ? (
        isActive ? (
          <iframe
            src={parsed.embedUrl}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            {video.thumbnailUrl || parsed.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl || parsed.thumbnailUrl || ''}
                alt={video.title}
                className="w-full h-full object-cover opacity-60"
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl">
                <Play className="w-7 h-7 text-white fill-current ml-1" />
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-white text-sm">Video tidak tersedia</div>
      )}

      {/* ============================================
          MUTE TOGGLE (upload only)
          ============================================ */}
      {isUpload && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Open in new tab (external only) */}
      {!isUpload && (
        <a
          href={video.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label="Buka di tab baru"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}

      {/* ============================================
          INFO OVERLAY
          ============================================ */}
      <ShowcaseFeedInfo video={video} />

      {/* ============================================
          ACTIONS RAIL
          ============================================ */}
      <ShowcaseFeedActions
        videoId={video.id}
        initialLiked={isLiked}
        initialLikeCount={video.likeCount}
        initialCommentCount={video.commentCount}
        initialShareCount={video.shareCount}
        studentProfileId={video.student.id}
        studentName={video.student.user.fullName || 'Anonim'}
        initialFollowing={isFollowing}
        currentUserRole={currentUserRole}
        currentStudentProfileId={currentStudentProfileId}
        onOpenComments={() => onOpenComments(video.id)}
      />
    </div>
  )
}