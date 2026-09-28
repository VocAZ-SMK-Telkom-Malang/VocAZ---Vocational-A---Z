// components/showcase/public/showcase-stage.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Play,
  Pause,
  Eye,
  Share2,
  ChevronUp,
  ChevronDown,
  Lock,
  BadgeCheck,
  Maximize2,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { parseVideoUrl } from '@/lib/student/video-parser'
import type { PublicShowcaseReel } from '@/lib/showcase-public'

type Props = {
  reels: PublicShowcaseReel[]
  onOpenFullscreen?: (reel: PublicShowcaseReel) => void
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function ShowcaseStage({ reels, onOpenFullscreen }: Props) {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollLockRef = useRef(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const reel = reels[activeIndex]
  const isUpload = reel?.videoSource === 'upload'
  const parsed = reel && !isUpload ? parseVideoUrl(reel.videoUrl) : null

  // Reset saat ganti video
  useEffect(() => {
    setPlaying(false)
    setProgress(0)
    setMuted(true)
  }, [activeIndex])

  // Update progress
  useEffect(() => {
    if (!isUpload || !playing) return
    const el = videoRef.current
    if (!el) return
    const update = () => {
      if (el.duration) setProgress((el.currentTime / el.duration) * 100)
    }
    el.addEventListener('timeupdate', update)
    return () => el.removeEventListener('timeupdate', update)
  }, [isUpload, playing, activeIndex])

  // Sync muted
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  // Scroll + keyboard nav
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollLockRef.current) return
      if (Math.abs(e.deltaY) < 30) return

      const dir = e.deltaY > 0 ? 1 : -1
      const next = activeIndex + dir

      if (next >= 0 && next < reels.length) {
        scrollLockRef.current = true
        setActiveIndex(next)
        setTimeout(() => {
          scrollLockRef.current = false
        }, 350)
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (activeIndex < reels.length - 1) setActiveIndex(activeIndex + 1)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (activeIndex > 0) setActiveIndex(activeIndex - 1)
      }
    }

    const el = document.getElementById('showcase-stage')
    if (el) el.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKey)

    return () => {
      if (el) el.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
    }
  }, [activeIndex, reels.length])

  // Auto-hide controls
  useEffect(() => {
    if (!playing) {
      setShowControls(true)
      return
    }
    const resetTimeout = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 2500)
    }
    resetTimeout()
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    }
  }, [playing])

  const handleAuth = (action: string) => {
    router.push(`/auth/sign-in?next=/showcase&reason=${action}`)
  }

  const handlePlayPause = () => {
    if (!isUpload) return
    const el = videoRef.current
    if (!el) return

    if (el.paused) {
      el.play().catch(() => {})
      setPlaying(true)
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  if (!reel) return null

  const nextReel = reels[activeIndex + 1]

  return (
    <section
      id="showcase-stage"
      className="w-full px-4 sm:px-6 lg:px-8 py-8 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        {/* Stage wrapper */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(183,0,17,0.12)] border border-[#FBD5D0] p-5 sm:p-6 lg:p-10 bg-gradient-to-br from-[#FFF7F6] via-[#FDEEEC] to-[#FCE2DE]">
          {/* Ambient */}
          {reel.thumbnailUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-20 pointer-events-none"
              style={{ backgroundImage: `url(${reel.thumbnailUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-tertiary-fixed/20 via-transparent to-secondary-fixed/20 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-inverse-surface/10 backdrop-blur-[1px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-6 w-full">
            {/* ═══════════════════════════════════
                VIDEO + ACTION RAIL
                ═══════════════════════════════════ */}
            <div className="flex items-center gap-3 w-full lg:w-auto lg:flex-1 lg:max-w-[720px]">
              <div
                className="relative flex-1 aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group"
                onMouseMove={() => {
                  if (playing) {
                    setShowControls(true)
                    if (controlsTimeoutRef.current)
                      clearTimeout(controlsTimeoutRef.current)
                    controlsTimeoutRef.current = setTimeout(() => {
                      setShowControls(false)
                    }, 2500)
                  }
                }}
              >
                {/* ============================================
                    CASE 1: UPLOAD VIDEO — bisa play inline
                    ============================================ */}
                {isUpload ? (
                  <>
                    <video
                      ref={videoRef}
                      src={reel.videoUrl}
                      poster={reel.thumbnailUrl || undefined}
                      loop
                      playsInline
                      muted={muted}
                      className="w-full h-full object-cover bg-black"
                      onClick={handlePlayPause}
                    />

                    {/* Big play button — tampil saat pause */}
                    {!playing && (
                      <button
                        type="button"
                        onClick={handlePlayPause}
                        aria-label="Putar Video"
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm hover:scale-110 hover:bg-primary transition-all duration-300 active:scale-95"
                      >
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </button>
                    )}

                    {/* Top badges — selalu tampil */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none z-10">
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

                    {/* Bottom info overlay — tampil saat pause, atau saat playing + showControls */}
                    {(!playing || showControls) && (
                      <div className="absolute inset-x-0 bottom-0 pt-16 pb-3 px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white z-10 pointer-events-none">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-display text-sm font-bold">
                            {reel.student.name}
                          </span>
                          <BadgeCheck className="w-4 h-4 text-blue-400 fill-current" />
                        </div>
                        <p className="text-xs text-white/90 line-clamp-2 mb-2 font-medium">
                          {reel.title}
                        </p>

                        {reel.skillTags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
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

                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-container rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-white/80 whitespace-nowrap">
                            {reel.durationFormatted || '00:00'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Inline controls — tampil saat playing + showControls */}
                    {playing && showControls && (
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handlePlayPause}
                            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                            aria-label="Pause"
                          >
                            <Pause className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setMuted((m) => !m)}
                            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                            aria-label={muted ? 'Unmute' : 'Mute'}
                          >
                            {muted ? (
                              <VolumeX className="w-4 h-4" />
                            ) : (
                              <Volume2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {onOpenFullscreen && (
                          <button
                            type="button"
                            onClick={() => onOpenFullscreen(reel)}
                            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                            aria-label="Buka full screen"
                            title="Buka full screen"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : parsed ? (
                  /* ============================================
                     CASE 2: EXTERNAL LINK — embed via iframe
                     ============================================ */
                  <>
                    {!playing ? (
                      <>
                        {reel.thumbnailUrl ? (
                          <img
                            src={reel.thumbnailUrl}
                            alt={reel.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        ) : parsed.thumbnailUrl ? (
                          <img
                            src={parsed.thumbnailUrl}
                            alt={reel.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-inverse-surface to-black flex items-center justify-center">
                            <Play className="w-16 h-16 text-white/30" />
                          </div>
                        )}

                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
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

                        {/* Play → embed inline */}
                        <button
                          type="button"
                          onClick={() => setPlaying(true)}
                          aria-label="Putar Video"
                          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-lg backdrop-blur-sm hover:scale-110 hover:bg-primary transition-all duration-300 active:scale-95"
                        >
                          <Play className="w-8 h-8 fill-current ml-1" />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 pt-16 pb-3 px-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white pointer-events-none">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-display text-sm font-bold">
                              {reel.student.name}
                            </span>
                            <BadgeCheck className="w-4 h-4 text-blue-400 fill-current" />
                          </div>
                          <p className="text-xs text-white/90 line-clamp-2 font-medium">
                            {reel.title}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <iframe
                          src={parsed.embedUrl + '?autoplay=1'}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                        {/* Fullscreen button untuk external */}
                        {onOpenFullscreen && (
                          <button
                            type="button"
                            onClick={() => onOpenFullscreen(reel)}
                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors z-20"
                            aria-label="Buka full screen"
                            title="Buka full screen"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                    Video tidak tersedia
                  </div>
                )}
              </div>

              {/* Action Rail */}
              <div className="hidden sm:flex flex-col items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                  disabled={activeIndex === 0}
                  className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface hover:text-primary hover:scale-105 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Reel Sebelumnya"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>

                <div className="relative group">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex(
                        Math.min(reels.length - 1, activeIndex + 1)
                      )
                    }
                    disabled={activeIndex === reels.length - 1}
                    className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface hover:text-primary hover:scale-105 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Reel Berikutnya"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  {nextReel && (
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-inverse-surface text-inverse-on-surface font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20">
                      Berikutnya
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleAuth('share')}
                    className="w-11 h-11 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-md text-on-surface hover:text-primary hover:scale-105 flex items-center justify-center transition-all"
                    title="Bagikan Video"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <span className="mt-1 font-mono text-[10px] text-on-surface-variant font-bold">
                    {reel.shareCount}
                  </span>
                </div>

                <div className="pt-1 mt-1 border-t border-outline-variant/30 text-center">
                  <span className="font-mono text-[10px] text-on-surface-variant font-bold">
                    {activeIndex + 1}/{reels.length}
                  </span>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════
                INFO PANEL
                ═══════════════════════════════════ */}
            <div className="w-full lg:w-[320px] bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-5 shadow-xl flex flex-col gap-4 text-on-surface shrink-0">
              <div className="flex items-center gap-3">
                {reel.student.avatarUrl ? (
                  <img
                    src={reel.student.avatarUrl}
                    alt={reel.student.name}
                    className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-primary/10"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold shrink-0 ring-2 ring-primary/10">
                    {reel.student.initials}
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
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

              {reel.skillTags.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    Kompetensi Utama
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {reel.skillTags.slice(0, 3).map((tag, i) => (
                      <span
                        key={tag}
                        className={
                          i === 0
                            ? 'px-2.5 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed text-xs font-medium'
                            : 'px-2.5 py-1 rounded-lg bg-surface-container-high text-on-secondary-container text-xs font-medium'
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

              <div className="pt-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleAuth('contact')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-primary text-on-primary hover:bg-primary-container font-display font-semibold text-sm shadow-md transition-all hover:scale-[1.02]"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login untuk Menghubungi</span>
                </button>
                <span className="text-center text-[11px] text-on-surface-variant/80">
                  Khusus Akun Perusahaan Terverifikasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}