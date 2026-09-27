'use client'

import {
  Play,
  MapPin,
  School,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from 'lucide-react'

type Talent = {
  id: string
  name: string
  initials: string
  headline: string
  city: string | null
  province: string | null
  avatarUrl: string | null
  school: string
  major: string
  graduationYear: number | null
  isVerified: boolean
  skills: string[]
  video: {
    id: string
    title: string
    category: string | null
    duration: number | null
    durationFormatted: string
    thumbnailUrl: string | null
    videoUrl: string
  } | null
}

type Props = {
  talent: Talent
  onPreview: () => void
}

export function TalentCard({ talent, onPreview }: Props) {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(220,38,38,0.06),0_4px_12px_-2px_rgba(20,27,43,0.04)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(220,38,38,0.12)] transition-all duration-300 group">
      <div className="relative w-full h-48 overflow-hidden bg-[#293040]">
        {talent.video?.thumbnailUrl ? (
          <img
            src={talent.video.thumbnailUrl}
            alt={talent.video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-container/30 via-[#293040] to-tertiary-container/30" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#293040]/80 via-transparent to-black/30" />

        {talent.video?.category && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-on-surface font-mono text-[11px] font-bold">
            {talent.video.category}
          </span>
        )}

        <button
          type="button"
          onClick={onPreview}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform"
        >
          <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
        </button>

        {talent.video && (
          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#293040]/90 text-white font-mono text-[11px]">
            {talent.video.durationFormatted}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 gap-4">
        {talent.video && (
          <p className="text-xs text-on-surface-variant italic truncate">
            Proyek Unggulan: {talent.video.title}
          </p>
        )}

        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            {talent.avatarUrl ? (
              <img
                src={talent.avatarUrl}
                alt={talent.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold">
                {talent.initials}
              </div>
            )}
            {talent.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary-container text-white flex items-center justify-center border-2 border-white">
                <CheckCircle2 className="w-3 h-3" strokeWidth={3} />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold text-on-surface truncate">
              {talent.name}
            </h3>
            <p className="text-xs text-primary font-medium truncate">
              {talent.headline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          <School className="w-4 h-4 text-secondary shrink-0" />
          <span className="font-medium text-on-surface truncate">
            {talent.school}
          </span>
          {talent.major && (
            <>
              <span className="text-outline-variant">•</span>
              <span className="truncate">
                {talent.major}
                {talent.graduationYear &&
                  ` '${String(talent.graduationYear).slice(-2)}`}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {talent.isVerified && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>LSP-BNSP Certified</span>
            </div>
          )}
          {talent.city && (
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[11px]">{talent.city}</span>
            </div>
          )}
        </div>

        {talent.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {talent.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-2">
          <button
            type="button"
            onClick={onPreview}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-primary-container hover:bg-primary text-white text-sm font-bold shadow-sm transition-colors"
          >
            <span>Lihat Selengkapnya</span>
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}