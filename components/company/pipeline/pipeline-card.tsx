// components/company/pipeline/pipeline-card.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import {
  Zap,
  BadgeCheck,
  MapPin,
  Clock,
  AlertTriangle,
  ExternalLink,
  GripVertical,
} from 'lucide-react'
import type { PipelineCard as PipelineCardType } from '@/lib/queries/company-pipeline'

type Props = {
  card: PipelineCardType
  jobId: string
  isSelected: boolean
  onToggleSelect: (id: string) => void
}

export function PipelineCard({
  card,
  jobId,
  isSelected,
  onToggleSelect,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.applicationId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const agingLevel =
    card.daysSinceApplied > 14
      ? 'danger'
      : card.daysSinceApplied > 7
      ? 'warning'
      : 'normal'

  const matchColor =
    (card.matchScore ?? 0) >= 85
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : (card.matchScore ?? 0) >= 70
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : (card.matchScore ?? 0) >= 50
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative bg-surface-container-lowest rounded-xl border-2 transition-colors
        ${isSelected ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:border-primary/40'}
        ${isDragging ? 'shadow-2xl cursor-grabbing' : 'cursor-grab'}
      `}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 p-1 rounded cursor-grab active:cursor-grabbing text-on-surface-variant/30 hover:text-on-surface-variant hover:bg-surface-container transition-colors z-10"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Checkbox */}
      <div className="absolute top-2 right-2 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation()
            onToggleSelect(card.applicationId)
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
        />
      </div>

      {/* Link ke detail pelamar — dengan from=pipeline */}
      <Link
        href={`/company/jobs/${jobId}/applicants/${card.applicationId}?from=pipeline`}
        className="block p-4 pt-8"
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {card.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.avatarUrl}
              alt={card.fullName}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {card.initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h4 className="text-sm font-bold text-on-surface truncate">
                {card.fullName}
              </h4>
              {card.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </div>
            <p className="text-[11px] text-on-surface-variant truncate">
              {card.headline ?? card.school ?? 'Siswa SMK'}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {card.matchScore !== null && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${matchColor}`}
            >
              <Zap className="w-2.5 h-2.5" />
              {card.matchScore}%
            </span>
          )}
          {card.city && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px]">
              <MapPin className="w-2.5 h-2.5" />
              {card.city}
            </span>
          )}
        </div>

        {/* Next step */}
        {card.nextStep && (
          <div className="mb-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
              Next Step
            </p>
            <p className="text-[11px] text-on-surface font-semibold line-clamp-2">
              {card.nextStep}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 text-[10px] ${
              agingLevel === 'danger'
                ? 'text-error font-bold'
                : agingLevel === 'warning'
                ? 'text-amber-600 font-semibold'
                : 'text-on-surface-variant'
            }`}
          >
            {agingLevel !== 'normal' && (
              <AlertTriangle className="w-3 h-3" />
            )}
            <Clock className="w-2.5 h-2.5" />
            {card.appliedAtRelative}
          </span>
          <ExternalLink className="w-3 h-3 text-on-surface-variant/40" />
        </div>
      </Link>
    </div>
  )
}