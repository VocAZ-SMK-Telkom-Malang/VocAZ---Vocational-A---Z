// components/student/applications/status-badge.tsx
'use client'

import { STATUS_CONFIG, type ApplicationStatus } from './types'

type Props = {
  status: ApplicationStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const config = STATUS_CONFIG[status]

  if (!config) {
    return null
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-bold border
        ${config.bg} ${config.color} ${config.border}
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.shortLabel}
    </span>
  )
}