// components/showcase/public/showcase-card.tsx
'use client'

import {
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BadgeCheck,
} from 'lucide-react'
import type { PublicShowcaseReel } from '@/lib/showcase-public'

type Props = {
  reel: PublicShowcaseReel
  onPlay: (reel: PublicShowcaseReel) => void
}

const SOURCE_BADGE: Record<string, { label: string; className: string }> = {
  upload: { label: 'Video', className: 'bg-blue-600' },
  youtube: { label: 'YouTube', className: 'bg-red-600' },
  tiktok: { label: 'TikTok', className: 'bg-black' },
  gdrive: { label: 'Drive', className: 'bg-emerald-600' },
  instagram: { label: 'Instagram', className: 'bg-pink-600' },
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function ShowcaseCard({ reel, onPlay }: Props) {
  const sourceBadge = SOURCE_BADGE[reel.videoSource] || SOURCE_BADGE.upload
  const visibleSkills = reel.skillTags.slice(0, 3)
  const extraSkills = reel.skillTags.length - 3

  return (
    <button
      type="button"
      onClick={() => onPlay(reel)}
      className="group text-left w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(17,24,39,0.04),0_1px_2px_-1px_rgba(17,24,39,0.02)] hover:shadow-[0_10px_25px_-5px_rgba(220,38,38,0.08),0_8px_10px_-6px_rgba(17,24,39,0.04)] ring-1 ring-outline-variant/30 hover:ring-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail 16:9 Horizontal */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        {reel.thumbnailUrl ? (
          <img
            src={reel.thumbnailUrl}
            alt={reel.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-inverse-surface via-[#1a1a1f] to-black flex items-center justify-center">
            <Play className="w-12 h-12 text-white/30" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${sourceBadge.className} text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm`}
          >
            {sourceBadge.label}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
            <Eye className="w-3 h-3" />
            {formatViews(reel.viewCount)}
          </span>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-primary/95 backdrop-blur-sm text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        {reel.durationFormatted && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
            {reel.durationFormatted}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2.5">
          {reel.student.avatarUrl ? (
            <img
              src={reel.student.avatarUrl}
              alt={reel.student.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-[11px] shrink-0">
              {reel.student.initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="font-display text-sm font-bold text-on-surface truncate">
                {reel.student.name}
              </h3>
              {reel.student.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
            </div>
            {reel.student.school && (
              <p className="text-[11px] text-on-surface-variant truncate">
                {reel.student.school}
              </p>
            )}
          </div>
        </div>

        <h4 className="font-display text-sm font-bold text-on-surface leading-snug line-clamp-2 min-h-[2.6em] group-hover:text-primary transition-colors">
          {reel.title}
        </h4>

        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold"
              >
                {skill}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-mono text-[10px] font-semibold">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 mt-auto border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {reel.likeCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {reel.commentCount}
          </span>
          <span className="inline-flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            {reel.shareCount}
          </span>
        </div>
      </div>
    </button>
  )
}