// components/company/showcase/showcase-card.tsx
'use client'

import {
  Play,
  Eye,
  Zap,
  BadgeCheck,
  Bookmark,
  MessageSquare,
  UserPlus,
  Send,
  CheckCircle2,
} from 'lucide-react'
import type { ShowcaseVideoItem } from '@/lib/queries/company-showcase'
import { SaveTalentButton } from '@/components/company/saved/save-talent-button'

type Props = {
  video: ShowcaseVideoItem
  onPlay: (video: ShowcaseVideoItem) => void
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

function getMatchLabel(score: number | null): string {
  if (score === null) return ''
  if (score >= 85) return 'Sangat Cocok'
  if (score >= 70) return 'Cocok'
  if (score >= 50) return 'Cukup Cocok'
  return 'Kurang Cocok'
}

export function ShowcaseCard({
  video,
  onPlay,
  onSave,
  onContact,
  onInvite,
}: Props) {
  const matchGradient = getMatchGradient(video.matchScore)
  const matchLabel = getMatchLabel(video.matchScore)

  return (
    <div className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(183,0,17,0.15)] transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail 16:9 LANDSCAPE */}
      <button
        type="button"
        onClick={() => onPlay(video)}
        className="block relative w-full aspect-video overflow-hidden bg-black"
      >
        {video.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-inverse-surface via-[#1a1a1f] to-black flex items-center justify-center">
            <Play className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1.5 items-start">
            {video.student.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-md">
                <BadgeCheck className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {video.matchScore !== null && (
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${matchGradient} text-white shadow-lg ring-2 ring-white/20`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span className="font-black text-sm leading-none">
                {video.matchScore}%
              </span>
            </div>
          )}
        </div>

        {/* Match label (below match score) */}
        {video.matchScore !== null && matchLabel && (
          <div className="absolute top-12 right-3">
            <span
              className={`inline-block px-2 py-0.5 rounded-md bg-gradient-to-r ${matchGradient} text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm opacity-90`}
            >
              {matchLabel}
            </span>
          </div>
        )}

        {/* Center play button (hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm text-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-3 text-left">
          {/* Duration + Views */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
              {video.durationFormatted}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white font-mono text-[10px]">
              <Eye className="w-2.5 h-2.5" />
              {video.viewCount}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
            {video.title}
          </h3>
        </div>
      </button>

      {/* Content */}
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          {video.student.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.student.avatarUrl}
              alt={video.student.fullName}
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-xs shrink-0">
              {video.student.initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-bold text-on-surface truncate">
                {video.student.fullName}
              </h4>
              {video.student.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-on-surface-variant truncate">
              {video.student.headline ?? video.student.school?.name ?? 'Siswa SMK'}
            </p>
          </div>
        </div>

        {/* Skills */}
        {video.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.skillTags.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold"
              >
                {s}
              </span>
            ))}
            {video.skillTags.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold">
                +{video.skillTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <SaveTalentButton
                    studentId={video.student.id}
                    source="showcase"
                    variant="icon"
                    size="sm"
                  />

          <button
            type="button"
            onClick={() => onContact?.(video)}
            className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary flex items-center justify-center transition-colors shrink-0"
            aria-label="Chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>

          {video.hasApplied ? (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sudah Apply
            </span>
          ) : video.hasBeenInvited ? (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
              <Send className="w-3.5 h-3.5" />
              Diundang
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onInvite?.(video)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-xs font-bold hover:brightness-110 transition-all shadow-sm"
            >
           
              <UserPlus className="w-3.5 h-3.5" />
              Undang
            </button>
          )}
        </div>
      </div>
  )
}