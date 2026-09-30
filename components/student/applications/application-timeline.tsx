// components/student/applications/application-timeline.tsx
'use client'

import { Check, Circle } from 'lucide-react'
import {
  STATUS_CONFIG,
  STATUS_FLOW,
  type ApplicationStatus,
  formatDateTime,
} from './types'

type Props = {
  status: ApplicationStatus
  timeline: {
    status: ApplicationStatus
    at: string
    note?: string
  }[]
}

export function ApplicationTimeline({ status, timeline }: Props) {
  const isTerminated = status === 'rejected' || status === 'withdrawn'
  const currentIndex = STATUS_FLOW.indexOf(status)

  function getNoteForStep(s: ApplicationStatus): string | undefined {
    return timeline.find((t) => t.status === s)?.note
  }

  function getDateForStep(s: ApplicationStatus): string | undefined {
    return timeline.find((t) => t.status === s)?.at
  }

  // ============================================
  // TERMINATED (rejected/withdrawn) — vertical timeline
  // ============================================
  if (isTerminated) {
    return (
      <div className="space-y-2">
        {timeline.map((t, idx) => {
          const cfg = STATUS_CONFIG[t.status]
          const isLast = idx === timeline.length - 1
          return (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.color} border ${cfg.border}`}
                >
                  {isLast ? (
                    <span className="text-[10px]">{cfg.icon}</span>
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                </div>
                {idx < timeline.length - 1 && (
                  <div className="w-px h-full bg-outline-variant/40 my-0.5" />
                )}
              </div>
              <div className="flex-1 pb-3 min-w-0">
                <p className="text-xs font-bold text-on-surface">{cfg.label}</p>
                <p className="text-[10px] text-on-surface-variant mt-0.5">
                  {formatDateTime(t.at)}
                </p>
                {t.note && (
                  <p className="text-[11px] text-on-surface-variant mt-1 italic">
                    "{t.note}"
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ============================================
  // NORMAL FLOW — horizontal timeline
  // ============================================
  return (
    <div className="space-y-3">
      {/* Dots + connector */}
      <div className="flex items-center gap-1">
        {STATUS_FLOW.map((s, idx) => {
          const cfg = STATUS_CONFIG[s]
          const isCompleted = idx < currentIndex
          const isCurrent = idx === currentIndex

          return (
            <div key={s} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all
                    ${
                      isCurrent
                        ? `${cfg.bg} ${cfg.color} border-2 ${cfg.border} ring-4 ring-primary/10`
                        : isCompleted
                          ? 'bg-emerald-500 text-white border-2 border-emerald-500'
                          : 'bg-surface-container text-on-surface-variant/40 border-2 border-outline-variant/40'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3" strokeWidth={3} />
                  ) : isCurrent ? (
                    <span className="text-[10px]">{cfg.icon}</span>
                  ) : (
                    <Circle className="w-2 h-2 fill-current" />
                  )}
                </div>
              </div>

              {idx < STATUS_FLOW.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded-full ${
                    idx < currentIndex ? 'bg-emerald-500' : 'bg-outline-variant/30'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between gap-1">
        {STATUS_FLOW.map((s, idx) => {
          const cfg = STATUS_CONFIG[s]
          const isPast = idx <= currentIndex
          const date = getDateForStep(s)
          return (
            <div
              key={s}
              className="flex flex-col items-center text-center flex-1 min-w-0 px-0.5"
            >
              <p
                className={`text-[9px] font-bold uppercase tracking-wider truncate w-full ${
                  isPast ? 'text-on-surface' : 'text-on-surface-variant/40'
                }`}
              >
                {cfg.shortLabel}
              </p>
              {date && (
                <p className="text-[8px] text-on-surface-variant mt-0.5 truncate w-full">
                  {new Date(date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Current step detail */}
      {(() => {
        const currentCfg = STATUS_CONFIG[status]
        const note = getNoteForStep(status)
        return (
          <div className={`p-2.5 rounded-lg ${currentCfg.bg} border ${currentCfg.border}`}>
            <p className={`text-[11px] font-bold ${currentCfg.color}`}>
              {currentCfg.icon} {currentCfg.label}
            </p>
            {note && (
              <p className="text-[10px] text-on-surface-variant mt-0.5 italic">
                "{note}"
              </p>
            )}
          </div>
        )
      })()}
    </div>
  )
}