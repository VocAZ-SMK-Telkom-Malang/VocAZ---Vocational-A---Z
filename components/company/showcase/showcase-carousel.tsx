// components/company/showcase/showcase-carousel.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  X,
  Zap,
  BadgeCheck,
  MapPin,
  GraduationCap,
  Bookmark,
  MessageSquare,
  UserPlus,
  Send,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Eye,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'
import type { ShowcaseVideoItem } from '@/lib/queries/company-showcase'

type Props = {
  videos: ShowcaseVideoItem[]
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

export function ShowcaseCarousel({
  videos,
  onSave,
  onContact,
  onInvite,
}: Props) {
  const [fullscreenVideo, setFullscreenVideo] =
    useState<ShowcaseVideoItem | null>(null)

  if (videos.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-on-surface-variant">
          Tidak ada video untuk ditampilkan
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {videos.map((video) => (
          <VideoItem
            key={video.id}
            video={video}
            onSave={onSave}
            onContact={onContact}
            onInvite={onInvite}
            onFullscreen={() => setFullscreenVideo(video)}
          />
        ))}
      </div>

      {/* FULLSCREEN MODAL */}
      {fullscreenVideo && (
        <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center">
          <video
            src={fullscreenVideo.videoUrl}
            poster={fullscreenVideo.thumbnailUrl ?? undefined}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={() => setFullscreenVideo(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  )
}

// ============================================
// VIDEO ITEM — 1 video + info kanan
// ============================================

function VideoItem({
  video,
  onSave,
  onContact,
  onInvite,
  onFullscreen,
}: {
  video: ShowcaseVideoItem
  onSave?: (video: ShowcaseVideoItem) => void
  onContact?: (video: ShowcaseVideoItem) => void
  onInvite?: (video: ShowcaseVideoItem) => void
  onFullscreen: () => void
}) {
  const matchGradient = getMatchGradient(video.matchScore)

  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden shadow-[0_4px_24px_-8px_rgba(183,0,17,0.08)]">
      <div className="flex flex-col lg:flex-row">
        {/* LEFT — Video Player */}
        <div className="relative lg:w-[60%] bg-black shrink-0 flex items-center justify-center p-4 lg:p-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            <video
              src={video.videoUrl}
              poster={video.thumbnailUrl ?? undefined}
              controls
              preload="metadata"
              className="w-full h-full"
            />

            {/* Match badge */}
            {video.matchScore !== null && (
              <div className="absolute top-3 left-3 z-10 pointer-events-none">
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${matchGradient} text-white shadow-lg ring-2 ring-white/20`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span className="font-black text-sm leading-none">
                    {video.matchScore}%
                  </span>
                </div>
              </div>
            )}

            {/* Fullscreen */}
            <button
              type="button"
              onClick={onFullscreen}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* RIGHT — Info Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-5 lg:p-6 space-y-4">
            {/* Author */}
            <div className="flex items-start gap-3">
              {video.student.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={video.student.avatarUrl}
                  alt={video.student.fullName}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-base shrink-0">
                  {video.student.initials}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Link
                    href={`/company/talent/${video.student.id}`}
                    className="text-base font-black text-on-surface truncate hover:text-primary transition-colors"
                  >
                    {video.student.fullName}
                  </Link>
                  {video.student.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
                {video.student.headline && (
                  <p className="text-xs text-on-surface-variant line-clamp-1">
                    {video.student.headline}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-on-surface-variant">
                  {video.student.school && (
                    <span className="inline-flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {video.student.school.name}
                    </span>
                  )}
                  {video.student.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {video.student.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <h4 className="text-base font-bold text-on-surface leading-snug mb-1.5">
                {video.title}
              </h4>
              {video.description && (
                <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line line-clamp-3">
                  {video.description}
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              {video.category && (
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold">
                  {video.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container text-on-surface-variant">
                <Eye className="w-3 h-3" />
                {video.viewCount}
              </span>
              <span className="px-2 py-1 rounded-md bg-surface-container text-on-surface-variant font-mono">
                {video.durationFormatted}
              </span>
            </div>

            {/* Skills */}
            {video.skillTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {video.skillTags.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface font-mono text-[10px] font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Certificates */}
            {video.student.certificates.length > 0 && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-emerald-800 truncate flex-1">
                  {video.student.certificates.length} Sertifikat Verified
                </span>
              </div>
            )}
          </div>

          {/* Action footer */}
          <div className="flex items-center gap-2 p-4 border-t border-outline-variant/30 bg-surface-container-low/30">
            <button
              type="button"
              onClick={() => onSave?.(video)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                video.hasSaved
                  ? 'bg-primary/10 text-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${video.hasSaved ? 'fill-current' : ''}`}
              />
            </button>

            <button
              type="button"
              onClick={() => onContact?.(video)}
              className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary flex items-center justify-center transition-colors shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <Link
              href={`/company/talent/${video.student.id}`}
              className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary flex items-center justify-center transition-colors shrink-0"
              title="Lihat Profil"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            {video.hasApplied ? (
              <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Sudah Apply
              </span>
            ) : video.hasBeenInvited ? (
              <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-amber-50 text-amber-700 text-sm font-bold">
                <Send className="w-4 h-4" />
                Sudah Diundang
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onInvite?.(video)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-sm font-bold hover:brightness-110 transition-all shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                Undang Melamar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}