// components/student/talents/modals/experience-modal.tsx
'use client'

import { useEffect } from 'react'
import { X, Briefcase, Calendar, MapPin } from 'lucide-react'

type Experience = {
  id: string
  title: string
  companyName: string | null
  employmentType: string | null
  location: string | null
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  description: string | null
}

type Props = {
  experience: Experience
  onClose: () => void
}

const TYPE_LABEL: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  internship: 'Magang',
  contract: 'Kontrak',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
}

export function ExperienceModal({ experience, onClose }: Props) {
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

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-0.5">
                Pengalaman
              </p>
              <h2 className="text-base font-black text-on-surface line-clamp-2">
                {experience.title}
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
        <div className="p-6 space-y-5 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experience.companyName && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                  Perusahaan
                </h3>
                <p className="text-sm font-bold text-on-surface">
                  {experience.companyName}
                </p>
              </div>
            )}

            {experience.employmentType && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                  Tipe
                </h3>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold">
                  {TYPE_LABEL[experience.employmentType] ??
                    experience.employmentType}
                </span>
              </div>
            )}

            {experience.startDate && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                  Periode
                </h3>
                <p className="inline-flex items-center gap-1.5 text-sm text-on-surface">
                  <Calendar className="w-3.5 h-3.5 text-on-surface-variant" />
                  {new Date(experience.startDate).toLocaleDateString('id-ID', {
                    month: 'short',
                    year: 'numeric',
                  })}
                  {' - '}
                  {experience.isCurrent
                    ? 'Sekarang'
                    : experience.endDate
                      ? new Date(experience.endDate).toLocaleDateString(
                          'id-ID',
                          { month: 'short', year: 'numeric' }
                        )
                      : '-'}
                </p>
              </div>
            )}

            {experience.location && (
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">
                  Lokasi
                </h3>
                <p className="inline-flex items-center gap-1.5 text-sm text-on-surface">
                  <MapPin className="w-3.5 h-3.5 text-on-surface-variant" />
                  {experience.location}
                </p>
              </div>
            )}
          </div>

          {experience.description && (
            <div className="pt-4 border-t border-outline-variant/20">
              <h3 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
                Deskripsi
              </h3>
              <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {experience.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}