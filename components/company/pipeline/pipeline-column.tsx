// components/company/pipeline/pipeline-column.tsx
'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PipelineCard } from './pipeline-card'
import type { PipelineCard as PipelineCardType } from '@/lib/queries/company-pipeline'

const COLUMN_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: {
    label: 'Kotak Masuk',
    color: 'text-blue-700',
    bg: 'bg-blue-500',
  },
  reviewed: {
    label: 'Ditinjau',
    color: 'text-amber-700',
    bg: 'bg-amber-500',
  },
  shortlisted: {
    label: 'Shortlist',
    color: 'text-purple-700',
    bg: 'bg-purple-500',
  },
  interview: {
    label: 'Wawancara',
    color: 'text-indigo-700',
    bg: 'bg-indigo-500',
  },
  offered: {
    label: 'Penawaran',
    color: 'text-emerald-700',
    bg: 'bg-emerald-500',
  },
  hired: {
    label: 'Diterima',
    color: 'text-emerald-800',
    bg: 'bg-emerald-600',
  },
  rejected: {
    label: 'Tidak Cocok',
    color: 'text-rose-700',
    bg: 'bg-rose-500',
  },
}

type Props = {
  status: string
  cards: PipelineCardType[]
  jobId: string
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
}

export function PipelineColumn({
  status,
  cards,
  jobId,
  selectedIds,
  onToggleSelect,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const config = COLUMN_CONFIG[status] ?? COLUMN_CONFIG.submitted

  return (
    <div className="flex flex-col w-[280px] shrink-0">
      {/* Header */}
      <div className="mb-3 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${config.bg}`} />
            <h3 className={`text-sm font-bold ${config.color}`}>
              {config.label}
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-mono text-[10px] font-bold">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Drop area */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 min-h-[400px] rounded-xl border-2 border-dashed p-2 space-y-2 transition-colors
          ${
            isOver
              ? 'border-primary bg-primary/5'
              : 'border-outline-variant/30 bg-surface-container-low/30'
          }
        `}
      >
        <SortableContext
          items={cards.map((c) => c.applicationId)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <PipelineCard
              key={card.applicationId}
              card={card}
              jobId={jobId}
              isSelected={selectedIds.has(card.applicationId)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex items-center justify-center h-32 text-xs text-on-surface-variant/50">
            Tidak ada pelamar
          </div>
        )}
      </div>
    </div>
  )
}