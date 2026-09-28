// components/showcase/public/showcase-tiktok-modal.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Volume2,
  VolumeX,
  Play,
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  Lock,
  ExternalLink,
  BadgeCheck,
  Eye,
} from 'lucide-react'
import { parseVideoUrl } from '@/lib/student/video-parser'
import type { PublicShowcaseReel } from '@/lib/showcase-public'

type Props = {
  initialReel: PublicShowcaseReel
  allReels: PublicShowcaseReel[]
  onClose: () => void
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

function FeedItem({
  reel,
  isActive,
}: {
  reel: PublicShowcaseReel
  isActive: boolean
}) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const isUpload = reel.videoSource === 'upload'
  const parsed = !isUpload ? parseVideoUrl(reel.videoUrl) : null

  useEffect(() => {
    if (!isUpload) return
    const el = videoRef.current
    if (!el) return
    if (isActive) {
      el.currentTime = 0
      el.muted = muted
      el.play().catch(() => {})
    } else {
      el.pause()
    }
  }, [isActive, isUpload, muted])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  function handleAuth(action: string) {
    router.push(`/auth/sign-in?next=/showcase&reason=${action}`)
  }

  return (
    <div className="relative w-full h-full snap-start snap-always bg-black flex items-center justify-center overflow-hidden">
      {isUpload ? (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnailUrl || undefined}
          loop
          playsInline
          muted={muted}
          className="absolute inset-0 w-full h-full object-contain"
          onClick={() => {
            const el = videoRef.current
            if (!el) return
            if (el.paused) el.play()
            else el.pause()
          }}
        />
      ) : parsed && isActive ? (
        <iframe
          src={parsed.embedUrl + '?autoplay=1'}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {reel.thumbnailUrl || parsed?.thumbnailUrl ? (
            <img
              src={reel.thumbnailUrl || parsed?.thumbnailUrl || ''}
              alt={reel.title}
              className="w-full h-full object-contain opacity-60"
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl">
              <Play className="w-7 h-7 text-white fill-current ml-1" />
            </div>
          </div>
        </div>
      )}

      {isUpload && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute top-20 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      )}

      {!isUpload && (
        <a
          href={reel.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-20 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          aria-label="Buka di tab baru"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}

      {/* Info overlay */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none">
        <div className="pointer-events-auto max-w-[calc(100%-80px)]">
          <div className="flex items-center gap-3 mb-2">
            {reel.student.avatarUrl ? (
              <img
                src={reel.student.avatarUrl}
                alt={reel.student.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0 ring-2 ring-white/30">
                {reel.student.initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-sm font-bold text-white truncate">
                  {reel.student.name}
                </span>
                <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              </div>
              {reel.student.school && (
                <p className="text-[11px] text-white/80 truncate">
                  {reel.student.school}
                </p>
              )}
            </div>
          </div>

          <h3 className="font-display text-sm font-bold text-white mb-1 line-clamp-2">
            {reel.title}
          </h3>

          {reel.description && (
            <p className="text-xs text-white/85 line-clamp-2 mb-2">
              {reel.description}
            </p>
          )}

          {reel.skillTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {reel.skillTags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 text-[11px] text-white/70 font-medium">
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatViews(reel.viewCount)} views
            </span>
          </div>
        </div>
      </div>

      {/* Action rail */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={() => handleAuth('like')}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white">
            {reel.likeCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleAuth('comment')}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white">
            {reel.commentCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleAuth('share')}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-white">
            {reel.shareCount}
          </span>
        </button>
      </div>
    </div>
  )
}

export function ShowcaseTikTokModal({
  initialReel,
  allReels,
  onClose,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Urutkan: initialReel dulu
  const reels = (() => {
    const others = allReels.filter((r) => r.id !== initialReel.id)
    return [initialReel, ...others]
  })()

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const newIndex = Math.round(
        container.scrollTop / container.clientHeight
      )
      setActiveIndex(newIndex)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToIndex(index: number) {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        scrollToIndex(Math.min(reels.length - 1, activeIndex + 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        scrollToIndex(Math.max(0, activeIndex - 1))
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [activeIndex, reels.length])

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        aria-label="Tutup"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md">
        <span className="text-xs font-semibold text-white">
          {activeIndex + 1} / {reels.length}
        </span>
      </div>

      {/* Login CTA */}
      <a
        href="/auth/sign-in?next=/showcase"
        className="absolute top-4 right-4 z-30 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold shadow-lg hover:bg-primary-container transition-colors"
      >
        <Lock className="w-3.5 h-3.5" />
        Login untuk Hubungi
      </a>

      {/* Feed */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className="w-full h-full snap-start snap-always relative"
          >
            <FeedItem reel={reel} isActive={index === activeIndex} />
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      <div className="hidden lg:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-30">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Video sebelumnya"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() =>
            scrollToIndex(Math.min(reels.length - 1, activeIndex + 1))
          }
          disabled={activeIndex === reels.length - 1}
          className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Video berikutnya"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {activeIndex === 0 && reels.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md sm:hidden">
          <span className="text-[11px] text-white/90 font-semibold">
            ↑ Swipe untuk video berikutnya
          </span>
        </div>
      )}
    </div>
  )
}