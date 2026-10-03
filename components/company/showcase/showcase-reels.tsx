// components/company/showcase/showcase-reels.tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Zap,
  BadgeCheck,
  Bookmark,
  MessageSquare,
  UserPlus,
  Send,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Eye,
} from 'lucide-react'
import { ShowcaseVideoPlayer } from '@/components/student/showcase/showcase-video-player'
import type { ShowcaseVideoItem } from '@/lib/queries/company-showcase'

type Props = {
  videos: ShowcaseVideoItem[]
  startIdx?: number
  onSave?: (video: ShowcaseVideoItem) => void
  onContact?: (video: ShowcaseVideoItem) => void
  onInvite?: (video: ShowcaseVideoItem) => void
}

function getMatchGradient(score: number | null): string {
  if (score === null) return 'from-slate-400 to-slate-500'
  if (score >= 85) return 'from-emerald-500 to-teal-500'
  if (score >= 70) return 'from-blue-500 to-indigo-500'
  if (score >= 50) return 'from-amber-500 to-orange-500'
  return 'from-rose-500 to-pink-500'
}

export function ShowcaseReels({
  videos,
  startIdx = 0,
  onSave,
  onContact,
  onInvite,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(startIdx)
  const [muted, setMuted] = useState(true)
  const [fullscreenVideo, setFullscreenVideo] = useState<ShowcaseVideoItem | null>(null)

  // ============================================
  // INIT SCROLL
  // ============================================
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.scrollTop = startIdx * container.clientHeight
  }, [startIdx])

  // ============================================
  // DETECT ACTIVE VIDEO ON SCROLL
  // ============================================
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function onScroll() {
      const idx = Math.round(container!.scrollTop / container!.clientHeight)
      setActiveIdx(idx)
    }

    container.addEventListener('scroll', onScroll)
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIdx])

  function goNext() {
    const next = Math.min(activeIdx + 1, videos.length - 1)
    containerRef.current?.scrollTo({
      top: next * containerRef.current.clientHeight,
      behavior: 'smooth',
    })
  }

  function goPrev() {
    const prev = Math.max(activeIdx - 1, 0)
    containerRef.current?.scrollTo({
      top: prev * containerRef.current.clientHeight,
      behavior: 'smooth',
    })
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
        <p className="text-sm text-on-surface-variant">
          Tidak ada video untuk ditampilkan
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ============================================ */}
      {/* VERTICAL SNAP SCROLL CONTAINER */}
      {/* ============================================ */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-8rem)] overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar rounded-3xl bg-black"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((video, idx) => {
          const isActive = idx === activeIdx
          const matchGradient = getMatchGradient(video.matchScore)

          return (
            <div
              key={video.id}
              className="relative h-full w-full snap-start snap-always flex items-center justify-center"
            >
              {/* VIDEO 9:16 atau 16:9 — centered */}
              <div className="relative w-full h-full max-w-[1400px] mx-auto">
                <ShowcaseVideoPlayer
                  videoUrl={video.videoUrl}
                  videoSource={video.videoSource}
                  thumbnailUrl={video.thumbnailUrl}
                  autoPlay={isActive}
                  muted={muted}
                  className="absolute inset-0"
                />

                {/* Gradient overlay top */}
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {/* Gradient overlay bottom */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

                {/* ============================================ */}
                {/* TOP LEFT: Match Score + Verified */}
                {/* ============================================ */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                  {video.matchScore !== null && (
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r ${matchGradient} text-white shadow-lg ring-2 ring-white/20`}
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="font-black text-lg leading-none">
                        {video.matchScore}%
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 border-l border-white/30 pl-2 ml-0.5">
                        Match
                      </span>
                    </div>
                  )}

                  {video.student.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-md w-fit">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Verified Candidate
                    </span>
                  )}
                </div>

                {/* ============================================ */}
                {/* TOP RIGHT: View Count + Mute + Fullscreen */}
                {/* ============================================ */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-bold">
                    <Eye className="w-3.5 h-3.5" />
                    {video.viewCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => setMuted((v) => !v)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    title={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFullscreenVideo(video)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                </div>

                {/* ============================================ */}
                {/* RIGHT RAIL: Action Buttons */}
                {/* ============================================ */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5 z-20">
                  {/* Save */}
                  <ActionRailButton
                    icon={Bookmark}
                    label="Save"
                    active={video.hasSaved}
                    onClick={() => onSave?.(video)}
                  />

                  {/* Chat */}
                  <ActionRailButton
                    icon={MessageSquare}
                    label="Chat"
                    onClick={() => onContact?.(video)}
                  />

                  {/* Undang / Status */}
                  {video.hasApplied ? (
                    <ActionRailButton
                      icon={CheckCircle2}
                      label="Applied"
                      active
                      disabled
                    />
                  ) : video.hasBeenInvited ? (
                    <ActionRailButton
                      icon={Send}
                      label="Diundang"
                      active
                      disabled
                    />
                  ) : (
                    <ActionRailButton
                      icon={UserPlus}
                      label="Undang"
                      primary
                      onClick={() => onInvite?.(video)}
                    />
                  )}
                </div>

                {/* ============================================ */}
                {/* RIGHT RAIL: Navigation (Up/Down) */}
                {/* ============================================ */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={activeIdx === 0}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Video sebelumnya"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>

                  <div className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                    {activeIdx + 1}/{videos.length}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={activeIdx === videos.length - 1}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Video berikutnya"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                {/* ============================================ */}
                {/* BOTTOM: Author + Title */}
                {/* ============================================ */}
                <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 z-10 pointer-events-none">
                  {/* Author */}
                  <div className="flex items-center gap-3 mb-3">
                    {video.student.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.student.avatarUrl}
                        alt={video.student.fullName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white/40 shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-sm ring-2 ring-white/40 shrink-0">
                        {video.student.initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 pointer-events-auto">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/company/talent/${video.student.id}`}
                          className="text-sm font-bold text-white truncate hover:underline"
                        >
                          {video.student.fullName}
                        </Link>
                        {video.student.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      {video.student.headline && (
                        <p className="text-xs text-white/80 truncate">
                          {video.student.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Title + Description */}
                  <h3 className="text-base lg:text-lg font-bold text-white line-clamp-2 leading-snug mb-1">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-xs lg:text-sm text-white/80 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}

                  {/* Tags + Duration */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {video.category && (
                      <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                        {video.category}
                      </span>
                    )}
                    {video.skillTags.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white font-mono text-[10px]"
                      >
                        #{s}
                      </span>
                    ))}
                    <span className="font-mono text-[10px] text-white/70">
                      {video.durationFormatted}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ============================================ */}
      {/* FULLSCREEN MODAL */}
      {/* ============================================ */}
      {fullscreenVideo && (
        <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center">
          <ShowcaseVideoPlayer
            videoUrl={fullscreenVideo.videoUrl}
            videoSource={fullscreenVideo.videoSource}
            thumbnailUrl={fullscreenVideo.thumbnailUrl}
            autoPlay
            muted={false}
            className="w-full h-full"
          />

          <button
            type="button"
            onClick={() => setFullscreenVideo(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors z-10"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}

// ============================================
// ACTION RAIL BUTTON
// ============================================

function ActionRailButton({
  icon: Icon,
  label,
  onClick,
  active = false,
  primary = false,
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  active?: boolean
  primary?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 shrink-0 disabled:cursor-default"
      aria-label={label}
    >
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all
          ${
            disabled
              ? active
                ? 'bg-emerald-500/90 text-white'
                : 'bg-white/20 text-white/60'
              : primary
              ? 'bg-gradient-to-br from-primary to-primary-container text-white shadow-lg hover:scale-110'
              : active
              ? 'bg-primary text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }
        `}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-bold text-white drop-shadow-md">
        {label}
      </span>
    </button>
  )
}