// components/company/talent/talent-card.tsx
'use client'

import Link from 'next/link'
import {
  MapPin,
  BadgeCheck,
  Zap,
  CheckCircle2,
  GraduationCap,
  MessageSquare,
  Send,
  UserPlus,
  Eye,
} from 'lucide-react'
import type { TalentCard as TalentCardType } from '@/lib/queries/company-talent'
import { SaveTalentButton } from '@/components/company/saved/save-talent-button'

type Props = {
  talent: TalentCardType
  onInvite?: (talent: TalentCardType) => void
  onContact?: (talent: TalentCardType) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function getMatchGradient(score: number | null): string {
  if (score === null) return 'from-slate-400 to-slate-500'
  if (score >= 85) return 'from-emerald-500 to-teal-500'
  if (score >= 70) return 'from-blue-500 to-indigo-500'
  if (score >= 50) return 'from-amber-500 to-orange-500'
  return 'from-rose-500 to-pink-500'
}

function getMatchLabel(score: number | null): string {
  if (score === null) return 'Belum Match'
  if (score >= 85) return 'Sangat Cocok'
  if (score >= 70) return 'Cocok'
  if (score >= 50) return 'Cukup Cocok'
  return 'Kurang Cocok'
}

export function TalentCard({ talent, onInvite, onContact }: Props) {
  const matchGradient = getMatchGradient(talent.matchScore)
  const matchLabel = getMatchLabel(talent.matchScore)
  const hasCover = !!talent.coverImageUrl

  return (
    <div className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(183,0,17,0.15)] transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail Cover */}
      <Link href={`/company/talent/${talent.id}`} className="block relative">
        <div className="relative aspect-[16/9] overflow-hidden">
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talent.coverImageUrl!}
              alt={talent.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-fixed via-primary-fixed/60 to-tertiary-fixed/40 flex items-center justify-center">
              <span className="text-5xl font-black text-primary/30 tracking-tight">
                {talent.initials}
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* ============================================ */}
          {/* TOP ROW: Verified (kiri) + Match Score (kanan) */}
          {/* ============================================ */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {/* LEFT — Badges: Verified + Open to Work */}
            <div className="flex flex-col gap-1.5 items-start">
              {talent.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-md">
                  <BadgeCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
              {talent.isOpenToWork && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/95 backdrop-blur-sm text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Open to Work
                </span>
              )}
            </div>

            {/* RIGHT — Match Score Badge */}
            {talent.matchScore !== null && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${matchGradient} text-white shadow-lg ring-2 ring-white/20`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="font-black text-sm leading-none">
                  {talent.matchScore}%
                </span>
              </div>
            )}
          </div>

          {/* Match Label — di bawah match score (opsional, kalau mau) */}
          {talent.matchScore !== null && (
            <div className="absolute top-11 right-3">
              <span
                className={`inline-block px-2 py-0.5 rounded-md bg-gradient-to-r ${matchGradient} text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm opacity-90`}
              >
                {matchLabel}
              </span>
            </div>
          )}

          {/* Preview button on hover */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm text-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Header: Avatar + Name */}
        <div className="flex items-start gap-3 mb-3">
          {talent.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talent.avatarUrl}
              alt={talent.fullName}
              className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-surface-container-lowest -mt-8 relative z-10 shadow-md"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-surface-container-lowest -mt-8 relative z-10 shadow-md">
              {talent.initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <Link
                href={`/company/talent/${talent.id}`}
                className="text-sm font-bold text-on-surface truncate hover:text-primary transition-colors"
              >
                {talent.fullName}
              </Link>
              {talent.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </div>
            {talent.headline && (
              <p className="text-xs text-on-surface-variant truncate mt-0.5">
                {talent.headline}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-on-surface-variant mb-3">
          {talent.city && (
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {talent.city}
            </span>
          )}
          {talent.school && (
            <span className="inline-flex items-center gap-1 truncate">
              <GraduationCap className="w-3 h-3 shrink-0" />
              <span className="truncate">{talent.school.name}</span>
            </span>
          )}
        </div>

        {/* Skills */}
        {talent.topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {talent.topSkills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold"
              >
                {s}
              </span>
            ))}
            {talent.topSkills.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold">
                +{talent.topSkills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}

        <SaveTalentButton
            studentId={talent.id}
            source="talent_match"
            variant="icon"
            size="sm"
          />
        <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/30">
          {talent.hasApplied ? (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sudah Apply
            </span>
          ) : talent.hasBeenInvited ? (
            <span className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
              <Send className="w-3.5 h-3.5" />
              Diundang
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onInvite?.(talent)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-xs font-bold hover:brightness-110 transition-all shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Undang
            </button>
          )}

          <button
            type="button"
            onClick={() => onContact?.(talent)}
            className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary flex items-center justify-center transition-colors shrink-0"
            aria-label="Chat"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}