// components/showcase/feed/showcase-feed-viewer.tsx
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  BadgeCheck,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { ShowcaseVideoPlayer } from '@/components/student/showcase/showcase-video-player'
import {
  toggleShowcaseLike,
  recordShowcaseShare,
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
  videos: Video[]
  currentUserId: string | null
  currentStudentProfileId: string | null
  likedVideoIds: string[]
  followingStudentIds: string[]
}

export function ShowcaseFeedViewer({
  videos,
  currentUserId,
  currentStudentProfileId,
  likedVideoIds,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  // Track video aktif via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            if (!isNaN(idx)) setActiveIndex(idx)
          }
        })
      },
      { threshold: [0.5, 0.8], root: container }
    )

    container.querySelectorAll('[data-index]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [videos])

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        scrollTo(activeIndex + 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        scrollTo(activeIndex - 1)
      } else if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, fullscreen])

  function scrollTo(idx: number) {
    const container = containerRef.current
    if (!container) return
    const clampedIdx = Math.max(0, Math.min(videos.length - 1, idx))
    const target = container.querySelector(
      `[data-index="${clampedIdx}"]`
    ) as HTMLElement
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <div
        className={
          fullscreen
            ? 'fixed inset-0 z-[100] bg-black flex items-center justify-center'
            : 'relative w-full rounded-2xl overflow-hidden bg-black'
        }
      >
        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={() => setFullscreen((v) => !v)}
          className={`absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-all hover:scale-105 ${
            fullscreen ? 'top-6 right-6' : ''
          }`}
          aria-label={fullscreen ? 'Keluar fullscreen' : 'Fullscreen'}
        >
          {fullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Scroll container */}
        <div
          ref={containerRef}
          className={`
            overflow-y-scroll snap-y snap-mandatory scrollbar-hide
            ${fullscreen ? 'w-full h-full' : 'h-[calc(100vh-200px)] min-h-[600px]'}
          `}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, idx) => (
            <div
              key={video.id}
              data-index={idx}
              className="h-full w-full snap-start snap-always flex items-center justify-center relative px-6 sm:px-12 lg:px-20"
            >
              <VideoCard
                video={video}
                isActive={idx === activeIndex}
                fullscreen={fullscreen}
                currentUserId={currentUserId}
                currentStudentProfileId={currentStudentProfileId}
                initialLiked={likedVideoIds.includes(video.id)}
                onScrollNext={() => scrollTo(idx + 1)}
                onScrollPrev={() => scrollTo(idx - 1)}
                hasNext={idx < videos.length - 1}
                hasPrev={idx > 0}
              />
            </div>
          ))}
        </div>

        {/* Desktop nav panel */}
        {!fullscreen && (
          <div className="hidden lg:flex flex-col items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <button
              type="button"
              onClick={() => scrollTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all pointer-events-auto"
              aria-label="Sebelumnya"
            >
              <ChevronUp className="w-5 h-5" />
            </button>

            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black min-w-[50px] text-center">
              {activeIndex + 1}/{videos.length}
            </div>

            <button
              type="button"
              onClick={() => scrollTo(activeIndex + 1)}
              disabled={activeIndex === videos.length - 1}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all pointer-events-auto"
              aria-label="Berikutnya"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ============================================
// VIDEO CARD
// ============================================

function VideoCard({
  video,
  isActive,
  fullscreen,
  currentUserId,
  currentStudentProfileId,
  initialLiked,
  onScrollNext,
  onScrollPrev,
  hasNext,
  hasPrev,
}: {
  video: Video
  isActive: boolean
  fullscreen: boolean
  currentUserId: string | null
  currentStudentProfileId: string | null
  initialLiked: boolean
  onScrollNext: () => void
  onScrollPrev: () => void
  hasNext: boolean
  hasPrev: boolean
}) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(video.likeCount)
  const [muted, setMuted] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()
  const viewedRef = useRef(false)

  const isOwn = currentStudentProfileId === video.student.id

  // Increment view once
  useEffect(() => {
    if (isActive && !viewedRef.current) {
      viewedRef.current = true
      incrementShowcaseView(video.id).catch(() => {})
    }
  }, [isActive, video.id])

  // ============================================
  // LIKE
  // ============================================
  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUserId) {
      alert('Login dulu untuk like')
      return
    }

    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount((c) => c + (newLiked ? 1 : -1))

    startTransition(async () => {
      try {
        const result = await toggleShowcaseLike(video.id)
        if (!result.ok) {
          setLiked(!newLiked)
          setLikeCount((c) => c + (newLiked ? -1 : 1))
          alert(result.error || 'Gagal like')
        }
      } catch (err) {
        setLiked(!newLiked)
        setLikeCount((c) => c + (newLiked ? -1 : 1))
        console.error('Like error:', err)
      }
    })
  }

  // ============================================
  // SHARE
  // ============================================
  async function handleShare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/showcase/${video.id}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description ?? '',
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
      recordShowcaseShare(video.id).catch(() => {})
    } catch (err) {
      // User cancelled share atau clipboard error → silent
      console.log('Share cancelled')
    }
  }

  // ============================================
  // MUTE TOGGLE
  // ============================================
  function handleToggleMute(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setMuted((v) => !v)
  }

  return (
    <div
      className={`
        relative bg-black overflow-hidden rounded-2xl shadow-2xl
        ${fullscreen ? 'w-full h-full max-w-6xl' : 'w-full h-full max-w-[1000px] mx-auto'}
      `}
    >
      {/* ============================================ */}
      {/* VIDEO PLAYER                                 */}
      {/* ============================================ */}
      <div className="absolute inset-0">
        <ShowcaseVideoPlayer
          videoUrl={video.videoUrl}
          videoSource={
            video.videoSource as React.ComponentProps<typeof ShowcaseVideoPlayer>['videoSource']
          }
          thumbnailUrl={video.thumbnailUrl}
          className="absolute inset-0 w-full h-full"
          autoPlay={isActive}
          muted={muted}
        />
      </div>

      {/* ============================================ */}
      {/* TOP BAR — verified + views + mute            */}
      {/* ============================================ */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-emerald-400/40 pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {video.student.schoolName ? 'Verified' : 'Candidate'}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">
              {video.viewCount.toLocaleString('id-ID')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* RIGHT ACTIONS — Like, Comment, Share         */}
      {/* ============================================ */}
      <div className="absolute right-4 sm:right-6 bottom-32 z-20 flex flex-col items-center gap-5">
        {/* LIKE */}
        <button
          type="button"
          onClick={handleLike}
          disabled={isPending}
          className="group flex flex-col items-center gap-1.5 disabled:opacity-60"
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg ${
              liked
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-black/50 backdrop-blur-md text-white hover:bg-black/70 group-hover:scale-105'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-lg">
            {likeCount}
          </span>
        </button>

        {/* COMMENT → halaman detail */}
        <Link
          href={`/showcase/${video.id}`}
          onClick={(e) => e.stopPropagation()}
          className="group flex flex-col items-center gap-1.5"
          aria-label="Lihat komentar"
        >
          <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all group-hover:scale-105 shadow-lg">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-lg">
            {video.commentCount}
          </span>
        </Link>

        {/* SHARE */}
        <button
          type="button"
          onClick={handleShare}
          className="group flex flex-col items-center gap-1.5"
          aria-label="Bagikan"
        >
          <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all group-hover:scale-105 shadow-lg">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-lg">
            {copied ? '✓' : video.shareCount}
          </span>
        </button>
      </div>

      {/* ============================================ */}
      {/* BOTTOM INFO — creator + title + tags         */}
      {/* ============================================ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 sm:px-7 pb-5 pt-20 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
        {/* Creator → detail talent */}
        <Link
          href={`/student/talents/${video.student.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2.5 mb-3 group pointer-events-auto"
        >
          <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden ring-2 ring-white/40 shrink-0">
            {video.student.avatarUrl ? (
              <img
                src={video.student.avatarUrl}
                alt={video.student.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              video.student.fullName.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex items-center gap-1.5">
            <p className="text-sm font-bold text-white truncate group-hover:underline">
              {video.student.fullName}
            </p>
            <BadgeCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400 shrink-0" />
            <ExternalLink className="w-3 h-3 text-white/60 group-hover:text-white transition-colors shrink-0" />
          </div>
        </Link>

        {/* Title → halaman detail video */}
        <Link
          href={`/showcase/${video.id}`}
          onClick={(e) => e.stopPropagation()}
          className="block pointer-events-auto"
        >
          <h2 className="text-lg sm:text-xl font-black text-white leading-tight mb-1.5 line-clamp-2 drop-shadow-lg hover:underline">
            {video.title}
          </h2>
        </Link>

        {/* Description */}
        {video.description && (
          <p className="text-sm text-white/80 line-clamp-1 mb-2 drop-shadow-md pointer-events-auto">
            {video.description}
          </p>
        )}

        {/* Skill tags + time */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {video.skillTags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border border-white/20"
            >
              #{tag}
            </span>
          ))}
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/70">
            <Clock className="w-3 h-3" />
            {formatRelativeTime(video.publishedAt || video.createdAt)}
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* SCROLL HINTS                                  */}
      {/* ============================================ */}
      {hasPrev && isActive && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onScrollPrev()
          }}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-20 p-1.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/25 transition-all opacity-60 hover:opacity-100"
          aria-label="Video sebelumnya"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      )}
      {hasNext && isActive && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onScrollNext()
          }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 p-1.5 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/25 transition-all opacity-60 hover:opacity-100"
          aria-label="Video berikutnya"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// HELPERS
// ============================================

function formatRelativeTime(date: string | Date | null) {
  if (!date) return 'Baru saja'
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days === 1) return '1 hari lalu'
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}