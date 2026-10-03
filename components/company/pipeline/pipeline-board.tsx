// components/company/pipeline/pipeline-board.tsx
'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { PipelineColumn } from './pipeline-column'
import { PipelineCard } from './pipeline-card'
import type { PipelineBoard as PipelineBoardType, PipelineCard as PipelineCardType } from '@/lib/queries/company-pipeline'

const COLUMN_ORDER = [
  'submitted',
  'reviewed',
  'shortlisted',
  'interview',
  'offered',
  'hired',
  'rejected',
]

type Props = {
  board: PipelineBoardType
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onDragEnd: (applicationId: string, newStatus: string) => void
}

export function PipelineBoard({
  board,
  selectedIds,
  onToggleSelect,
  onDragEnd,
}: Props) {
  const [activeCard, setActiveCard] = useState<PipelineCardType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    for (const status of COLUMN_ORDER) {
      const card = board.columns[status]?.find((c) => c.applicationId === id)
      if (card) {
        setActiveCard(card)
        return
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const applicationId = String(active.id)
    const overId = String(over.id)

    // Determine target status
    let targetStatus: string | null = null

    // Kalau drop langsung di column
    if (COLUMN_ORDER.includes(overId)) {
      targetStatus = overId
    } else {
      // Kalau drop di card lain → cari status dari card tersebut
      for (const status of COLUMN_ORDER) {
        const card = board.columns[status]?.find(
          (c) => c.applicationId === overId
        )
        if (card) {
          targetStatus = status
          break
        }
      }
    }

    if (!targetStatus) return

    // Cek apakah status berubah
    let currentStatus: string | null = null
    for (const status of COLUMN_ORDER) {
      const card = board.columns[status]?.find(
        (c) => c.applicationId === applicationId
      )
      if (card) {
        currentStatus = status
        break
      }
    }

    if (currentStatus === targetStatus) return

    onDragEnd(applicationId, targetStatus)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {COLUMN_ORDER.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              cards={board.columns[status] ?? []}
              jobId={board.job.id}
              selectedIds={selectedIds}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="rotate-3 opacity-90">
            <PipelineCard
              card={activeCard}
              jobId={board.job.id}
              isSelected={false}
              onToggleSelect={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}