// components/showcase/public/showcase-featured.tsx
'use client'

import { useState } from 'react'
import {
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Lock,
  BadgeCheck,
} from 'lucide-react'
import { parseVideoUrl } from '@/lib/student/video-parser'
import type { PublicShowcaseReel } from '@/lib/showcase-public'

type Props = {
  reel: PublicShowcaseReel
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return n.toString()
}

export function ShowcaseFeatured({ reel }: Props) {
  const [playing, setPlaying] = useState(false)
  const isUpload = reel.videoSource === 'upload'
  const parsed = !isUpload ? parseVideoUrl(reel.videoUrl) : null
  const posterUrl = reel.thumbnailUrl || parsed?.thumbnailUrl || null

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Card wrapper */}
        <div className="relative bg-surface-container-lowest rounded-3xl ring-1 ring-outline-variant/30 shadow-[0_4px_24px_rgba(44,14,20,0.06)] overflow-hidden">
          {/* Label bar */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-outline-variant/20">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Featured Talent
            </span>
            <span className="text-xs text-on-surface-variant">
              Video pilihan minggu ini
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6 lg:p-8">
            {/* Video — 16:9 horizontal */}
            <div className="lg:col-span-3">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                {playing ? (
                  isUpload ? (
                    <video
                      src={reel.videoUrl}
                      poster={posterUrl || undefined}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
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
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    className="group absolute inset-0 w-full h-full"
                  >
                    {posterUrl ? (
                      <img
                        src={posterUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-inverse-surface to-black flex items-center justify-center">
                        <Play className="w-14 h-14 text-white/30" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Verified Candidate
                      </div>
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                        <Eye className="w-3.5 h-3.5" />
                        {formatViews(reel.viewCount)}
                      </div>
                    </div>

                    {/* Play */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-9 h-9 fill-current ml-1" />
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute inset-x-0 bottom-0 pt-24 pb-4 px-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display text-lg font-bold text-white">
                          {reel.student.name}
                        </span>
                        <BadgeCheck className="w-5 h-5 text-blue-400 fill-current" />
                      </div>
                      <p className="text-sm text-white/90 line-clamp-1 font-medium">
                        {reel.title}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Student */}
              <div className="flex items-center gap-3">
                {reel.student.avatarUrl ? (
                  <img
                    src={reel.student.avatarUrl}
                    alt={reel.student.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-primary/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-base shrink-0">
                    {reel.student.initials}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-base font-bold text-on-surface truncate">
                      {reel.student.name}
                    </h3>
                    {reel.student.isVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                  </div>
                  {reel.student.headline && (
                    <p className="text-xs text-primary font-semibold truncate">
                      {reel.student.headline}
                    </p>
                  )}
                  {reel.student.school && (
                    <p className="text-xs text-on-surface-variant truncate">
                      {reel.student.school}
                    </p>
                  )}
                </div>
              </div>

              {/* Title + description */}
              <div>
                <h4 className="font-display text-base font-bold text-on-surface mb-2 leading-snug">
                  {reel.title}
                </h4>
                {reel.description && (
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {reel.description}
                  </p>
                )}
              </div>

              {/* Skills */}
              {reel.skillTags.length > 0 && (
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-2">
                    Kompetensi Utama
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {reel.skillTags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg bg-tertiary-fixed/60 text-on-tertiary-fixed text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-2">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  <strong className="text-on-surface font-bold">
                    {formatViews(reel.viewCount)}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" />
                  <strong className="text-on-surface font-bold">
                    {reel.likeCount}
                  </strong>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <strong className="text-on-surface font-bold">
                    {reel.commentCount}
                  </strong>
                </span>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-2 flex flex-col gap-2">
                <a
                  href="/auth/sign-in"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display font-semibold text-sm shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login untuk Menghubungi</span>
                </a>
                <span className="text-center text-[11px] text-on-surface-variant">
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