// components/company/applicants/match-score-badge.tsx
'use client'

import { useState } from 'react'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import type { MatchBreakdown } from '@/lib/matching/types'

type Props = {
  score: number
  breakdown?: MatchBreakdown | null
  size?: 'sm' | 'md' | 'lg'
}

export function MatchScoreBadge({ score, breakdown, size = 'md' }: Props) {
  const [expanded, setExpanded] = useState(false)

  const config =
    score >= 85
      ? { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Sangat Cocok' }
      : score >= 70
      ? { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Cocok' }
      : score >= 50
      ? { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Cukup Cocok' }
      : { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Kurang Cocok' }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size]

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => breakdown && setExpanded((v) => !v)}
        disabled={!breakdown}
        className={`inline-flex items-center gap-1 rounded-lg border font-mono font-bold transition-colors ${
          config.color
        } ${sizeClasses} ${
          breakdown ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
        }`}
      >
        <Zap className="w-3 h-3" />
        {score}%
        {breakdown && (
          expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* Popover */}
      {expanded && breakdown && (
        <div className="absolute z-30 top-full right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-on-surface">
              Kenapa {breakdown.totalScore}%?
            </h4>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.color}`}>
              {config.label}
            </span>
          </div>

          <div className="space-y-2.5">
            <BreakdownRow
              label="Skills"
              score={breakdown.skills.score}
              weight={breakdown.skills.weight}
              detail={`${breakdown.skills.matched} / ${breakdown.skills.total} skill`}
            />
            <BreakdownRow
              label="Pengalaman"
              score={breakdown.experience.score}
              weight={breakdown.experience.weight}
              detail={breakdown.experience.description}
            />
            <BreakdownRow
              label="Pendidikan"
              score={breakdown.education.score}
              weight={breakdown.education.weight}
              detail={breakdown.education.description}
            />
            <BreakdownRow
              label="Sertifikat"
              score={breakdown.certifications.score}
              weight={breakdown.certifications.weight}
              detail={breakdown.certifications.description}
            />
            <BreakdownRow
              label="Lokasi"
              score={breakdown.location.score}
              weight={breakdown.location.weight}
              detail={breakdown.location.description}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function BreakdownRow({
  label,
  score,
  weight,
  detail,
}: {
  label: string
  score: number
  weight: number
  detail: string
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface">{label}</span>
          <span className="text-[9px] font-mono text-on-surface-variant">
            ({weight}%)
          </span>
        </div>
        <span className="text-xs font-bold text-on-surface">{score}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden">
        <div
          className={`h-full rounded-full ${
            score >= 85
              ? 'bg-emerald-500'
              : score >= 70
              ? 'bg-blue-500'
              : score >= 50
              ? 'bg-amber-500'
              : 'bg-rose-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-[10px] text-on-surface-variant mt-0.5">{detail}</p>
    </div>
  )
}