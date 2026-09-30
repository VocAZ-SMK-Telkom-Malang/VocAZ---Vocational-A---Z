// components/student/talents/modals/achievement-modal.tsx
'use client'

import { useEffect } from 'react'
import { X, Trophy, Calendar, Medal, ExternalLink } from 'lucide-react'

type Achievement = {
  id: string
  title: string
  issuer: string | null
  level: string | null
  dateAchieved: string | null
  description: string | null
  certificateUrl: string | null
}

type Props = {
  achievement: Achievement
  onClose: () => void
}

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  school: { label: 'Tingkat Sekolah', color: 'bg-slate-100 text-slate-700' },
  regional: { label: 'Tingkat Regional', color: 'bg-blue-100 text-blue-700' },
  national: { label: 'Tingkat Nasional', color: 'bg-amber-100 text-amber-700' },
  international: {
    label: 'Tingkat Internasional',
    color: 'bg-purple-100 text-purple-700',
  },
}

export function AchievementModal({ achievement, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const cfg = achievement.level ? LEVEL_CONFIG[achievement.level] : null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-0.5">
                Prestasi
              </p>
              <h2 className="text-base font-black text-on-surface line-clamp-2">
                {achievement.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Bukti */}
          {achievement.certificateUrl && (
            <div className="aspect-video bg-surface-container">
              <img
                src={achievement.certificateUrl}
                alt={achievement.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="p-6 space-y-5">
            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievement.issuer && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Penyelenggara
                  </h3>
                  <p className="text-sm font-bold text-on-surface">
                    {achievement.issuer}
                  </p>
                </div>
              )}

              {cfg && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Tingkat
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}
                  >
                    <Medal className="w-3 h-3" />
                    {cfg.label}
                  </span>
                </div>
              )}

              {achievement.dateAchieved && (
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                    Tanggal
                  </h3>
                  <p className="inline-flex items-center gap-1.5 text-sm text-on-surface">
                    <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                    {new Date(achievement.dateAchieved).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {achievement.description && (
              <div className="pt-4 border-t border-outline-variant/20">
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                  Deskripsi
                </h3>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                  {achievement.description}
                </p>
              </div>
            )}

            {/* Link bukti */}
            {achievement.certificateUrl && (
              <div className="pt-4 border-t border-outline-variant/20">
                <a
                  href={achievement.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                >
                  Lihat Bukti Asli
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}