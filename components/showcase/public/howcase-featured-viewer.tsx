// components/showcase/public/showcase-featured-viewer.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Lock,
  ChevronUp,
  ChevronDown,
  BadgeCheck,
  ExternalLink,
} from 'lucide-react'
import { parseVideoUrl } from '@/lib/student/video-parser'
import type { PublicShowcaseReel } from '@/lib/showcase-public'

type Props = {
  reels: PublicShowcaseReel[]
  onOpenTikTok?: (reel: PublicShowcaseReel) => void
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function ShowcaseFeaturedViewer({ reels, onOpenTikTok }: Props) {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const scrollLockRef = useRef(false)

  const reel = reels[activeIndex]
  const isUpload = reel?.videoSource === 'upload'
  const parsed = reel && !isUpload ? parseVideoUrl(reel.videoUrl) : null

  // Reset playing saat ganti video
  useEffect(() => {
    setPlaying(false)
  }, [activeIndex])

  // Scroll wheel + keyboard navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Cegah terlalu sensitif
      if (scrollLockRef.current) return
      if (Math.abs(e.deltaY) < 30) return

      const direction = e.deltaY > 0 ? 1 : -1
      const nextIndex = activeIndex + direction

      if (nextIndex >= 0 && nextIndex < reels.length) {
        scrollLockRef.current = true
        setActiveIndex(nextIndex)
        setTimeout(() => {
          scrollLockRef.current = false
        }, 400)
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (activeIndex < reels.length - 1) setActiveIndex(activeIndex + 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (activeIndex > 0) setActiveIndex(activeIndex - 1)
      }
    }

    // Listen di featured section — pakai ref elemen
    const el = document.getElementById('featured-viewer-section')
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('keydown', handleKey)
    }

    return () => {
      if (el) el.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
    }
  }, [activeIndex, reels.length])

  // Handle interaksi → redirect login
  const handleAuthRequired = (action: string) => {
    router.push(`/auth/sign-in?next=/showcase&reason=${action}`)
  }

  if (!reel) {
    return null
  }

  return (
    <section
      id="featured-viewer-section"
      className="w-full px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(44,14,20,0.08)] border border-outline-variant/30 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-b from-surface-container-low via-surface-bright to-surface-container">
          {/* Ambient background blur */}
          {reel.thumbnailUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
            />
          )}

          <div className="relative z-10 flex flex-col xl:flex-row items-center justify-center gap-6 lg:gap-8 w-full">
            {/* ============================================
                VIDEO + ACTION RAIL
                ============================================ */}
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-[680px] h-[382px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-black flex-shrink-0 group">
                {/* Video / Embed */}
                {playing ? (
                  isUpload ? (
                    <video
                      src={reel.videoUrl}
                      poster={reel.thumbnailUrl || undefined}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                    />
                  ) : parsed ? (
                    <iframe
                      src={parsed.embedUrl + '?autoplay=1'}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : null
                ) : (
                  <>
                    {/* Poster */}
                    {reel.thumbnailUrl ? (
                      <img
                        src={reel.thumbnailUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-inverse-surface to-black flex items-center justify-center">
                        <Play className="w-16 h-16 text-white/30" />
                      </div>
                    )}

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="flex flex-col gap-1.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          Verified Candidate
                        </div>
                        {reel.student.school && (
                          <span className="font-mono text-[10px] text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full w-fit">
                            {reel.student.school}
                          </span>
                        )}
                      </div>
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        {formatViews(reel.viewCount)}
                      </div>
                    </div>

                    {/* Play button center */}
                    <button
                      type="button"
                      onClick={() => {
                        // Klik play → buka TikTok modal
                        if (onOpenTikTok) {
                          onOpenTikTok(reel)
                        } else {
                          setPlaying(true)
                        }
                      }}
                      aria-label="Putar Video Talent"
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm hover:scale-110 hover:bg-primary transition-all duration-300"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>

                    {/* Bottom info overlay */}
                    <div className="absolute inset-x-0 bottom-0 pt-20 pb-4 px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end text-white">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-display text-base font-bold">
                          {reel.student.name}
                        </span>
                        <BadgeCheck className="w-4 h-4 text-blue-400 fill-current" />
                      </div>
                      <p className="text-sm text-white/90 line-clamp-2 mb-2 font-medium">
                        {reel.title}
                      </p>

                      {reel.skillTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          {reel.skillTags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white font-mono text-[10px] font-bold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Progress bar (dummy, karena video belum play) */}
                      <div className="w-full flex items-center gap-2">
                        <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-container rounded-full w-0" />
                        </div>
                        <span className="font-mono text-[10px] text-white/80 whitespace-nowrap">
                          {reel.durationFormatted || '00:00'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action rail — ⬆⬇ + Share */}
              <div className="hidden sm:flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(Math.max(0, activeIndex - 1))
                  }
                  disabled={activeIndex === 0}
                  className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface hover:text-primary hover:scale-105 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Video Sebelumnya"
                  aria-label="Video sebelumnya"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(Math.min(reels.length - 1, activeIndex + 1))
                  }
                  disabled={activeIndex === reels.length - 1}
                  className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface hover:text-primary hover:scale-105 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Video Berikutnya"
                  aria-label="Video berikutnya"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleAuthRequired('share')}
                    className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface hover:text-primary hover:scale-105 flex items-center justify-center transition-all"
                    title="Bagikan Video"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="mt-1 font-mono text-[10px] font-bold text-on-surface-variant">
                    {reel.shareCount}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================
                INFO PANEL (kanan)
                ============================================ */}
            <div className="w-full sm:w-[320px] bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 shadow-xl flex flex-col gap-4 text-on-surface flex-shrink-0">
              {/* Student */}
              <div className="flex items-center gap-3">
                {reel.student.avatarUrl ? (
                  <img
                    src={reel.student.avatarUrl}
                    alt={reel.student.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0 shadow-sm ring-2 ring-primary/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold shrink-0 ring-2 ring-primary/10">
                    {reel.student.initials}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-display text-base font-bold truncate">
                      {reel.student.name}
                    </h3>
                    {reel.student.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                  </div>
                  {reel.student.headline && (
                    <span className="text-xs text-primary font-medium truncate">
                      {reel.student.headline}
                    </span>
                  )}
                  {reel.student.school && (
                    <span className="text-[11px] text-on-surface-variant truncate">
                      {reel.student.school}
                    </span>
                  )}
                </div>
              </div>

              {/* Kompetensi */}
              {reel.skillTags.length > 0 && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    Kompetensi Utama
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {reel.skillTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification badge (dummy placeholder — nanti dari DB) */}
              <div className="p-3 rounded-xl bg-tertiary-fixed/40 flex items-start gap-2.5">
                <BadgeCheck className="w-5 h-5 text-tertiary shrink-0 mt-0.5 fill-current" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-tertiary-fixed leading-tight">
                    LSP-BNSP Certified
                  </span>
                  <span className="text-[11px] text-on-tertiary-fixed/80 leading-normal">
                    Talenta Terverifikasi
                  </span>
                </div>
              </div>

              {/* Stats mini */}
              <div className="flex items-center gap-3 text-xs text-on-surface-variant pt-1">
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {formatViews(reel.viewCount)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {reel.likeCount}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {reel.commentCount}
                </span>
              </div>

              {/* CTA — Login */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleAuthRequired('contact')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display font-semibold text-sm shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login untuk Menghubungi</span>
                </button>
                <span className="text-center text-[11px] text-on-surface-variant/80">
                  Khusus Akun Perusahaan Terverifikasi
                </span>
              </div>

              {/* Counter info */}
              <div className="pt-2 border-t border-outline-variant/20 text-center">
                <span className="font-mono text-[10px] text-on-surface-variant">
                  Video {activeIndex + 1} dari {reels.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}