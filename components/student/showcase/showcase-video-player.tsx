// components/student/showcase/showcase-video-player.tsx
'use client'

import { Play } from 'lucide-react'
import { useState } from 'react'
import { parseVideoUrl } from '@/lib/student/video-parser'

type Props = {
  videoUrl: string
  videoSource: string
  thumbnailUrl?: string | null
  className?: string
  autoPlay?: boolean
}

export function ShowcaseVideoPlayer({
  videoUrl,
  videoSource,
  thumbnailUrl,
  className = '',
  autoPlay = false,
}: Props) {
  const [playing, setPlaying] = useState(autoPlay)

  // ── Upload / Direct video ─────────────────────
  if (videoSource === 'upload') {
    return (
      <video
        src={videoUrl}
        poster={thumbnailUrl || undefined}
        controls
        className={`w-full h-full object-cover bg-black ${className}`}
      />
    )
  }

  // ── Embedded platforms ────────────────────────
  const parsed = parseVideoUrl(videoUrl)
  if (!parsed) {
    return (
      <div
        className={`flex items-center justify-center bg-black text-white text-xs ${className}`}
      >
        URL tidak valid
      </div>
    )
  }

  const posterUrl = thumbnailUrl || parsed.thumbnailUrl

  // Belum play → tampilkan thumbnail + play button
  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className={`relative group bg-black ${className}`}
      >
        {posterUrl ? (
          <img
            src={posterUrl}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback kalau thumbnail gagal load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : null}

        {/* Fallback kalau tidak ada thumbnail */}
        {!posterUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              {parsed.source}
            </span>
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-white fill-current ml-1" />
          </div>
        </div>
      </button>
    )
  }

  // Playing → iframe embed
  return (
    <iframe
      src={parsed.embedUrl + (autoPlay ? '?autoplay=1' : '')}
      className={`w-full h-full ${className}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  )
}