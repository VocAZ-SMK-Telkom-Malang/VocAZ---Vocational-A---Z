// components/company/jobs/job-status-badge.tsx

const STATUS_CONFIG: Record<
  string,
  { label: string; style: string; dot: string }
> = {
  active: {
    label: 'Aktif',
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  draft: {
    label: 'Draft',
    style: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  closed: {
    label: 'Ditutup',
    style: 'bg-surface-container text-on-surface-variant border-outline-variant',
    dot: 'bg-on-surface-variant',
  },
  archived: {
    label: 'Arsip',
    style: 'bg-surface-container text-on-surface-variant border-outline-variant',
    dot: 'bg-on-surface-variant',
  },
}

export function JobStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider ${config.style}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}