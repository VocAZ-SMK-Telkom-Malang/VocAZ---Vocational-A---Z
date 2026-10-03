// components/company/showcase/showcase-modal.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Zap,
  Eye,
  BadgeCheck,
  Bookmark,
  MessageSquare,
  UserPlus,
  Send,
  CheckCircle2,
  MapPin,
  GraduationCap,
  ExternalLink,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import type { ShowcaseVideoItem } from '@/lib/queries/company-showcase'

type Props = {
  video: ShowcaseVideoItem | null
  onClose: () => void
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

export function ShowcaseModal({
  video,
  onClose,
  onSave,
  onContact,
  onInvite,
}: Props) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!video) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (fullscreen) setFullscreen(false)
        else onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [video, onClose, fullscreen])

  if (!video) return null

  const matchGradient = getMatchGradient(video.matchScore)

  // Fullscreen mode
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[110] bg-black flex items-center justify-center">
        <video
          src={video.videoUrl}
          poster={video.thumbnailUrl ?? undefined}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
        <button
          type="button"
          onClick={() => setFullscreen(false)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <Minimize2 className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh] w-full max-w-[1200px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT — Video Player */}
          <div className="relative bg-black lg:w-[60%] shrink-0 flex items-center justify-center p-4 lg:p-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <video
                src={video.videoUrl}
                poster={video.thumbnailUrl ?? undefined}
                controls
                autoPlay
                className="w-full h-full"
              />

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

              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT — Info Panel */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            {/* Close button desktop */}
            <button
              type="button"
              onClick={onClose}
              className="hidden lg:flex absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-5">
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

              {/* Title + description */}
              <div>
                <h4 className="text-base font-bold text-on-surface leading-snug mb-1.5">
                  {video.title}
                </h4>
                {video.description && (
                  <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
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
                  {video.viewCount} views
                </span>
                <span className="px-2 py-1 rounded-md bg-surface-container text-on-surface-variant font-mono">
                  {video.durationFormatted}
                </span>
              </div>

              {/* Skills */}
              {video.skillTags.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Skill
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {video.skillTags.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface font-mono text-[10px] font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {video.student.certificates.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                    Sertifikat Verified ({video.student.certificates.length})
                  </h5>
                  <div className="space-y-1.5">
                    {video.student.certificates.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200"
                      >
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-xs font-semibold text-emerald-800 truncate flex-1">
                          {c.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={`/company/talent/${video.student.id}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
              >
                Lihat Profil Lengkap
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Action footer */}
            <div className="flex items-center gap-2 p-4 border-t border-outline-variant/30 bg-surface-container-low/30 shrink-0">
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}