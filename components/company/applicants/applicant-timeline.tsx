// components/company/applicants/applicant-timeline.tsx
import { Clock, CheckCircle2 } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  submitted: 'Lamaran Terkirim',
  reviewed: 'Sedang Ditinjau',
  shortlisted: 'Shortlist',
  interview: 'Tahap Interview',
  offered: 'Ditawari Kontrak',
  hired: 'Diterima',
  rejected: 'Tidak Lolos',
  withdrawn: 'Dicabut',
}

type TimelineItem = {
  id: string
  status: string
  notes: string | null
  createdAt: string
}

export function ApplicantTimeline({ timeline }: { timeline: TimelineItem[] }) {
  if (timeline.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 text-center">
        <Clock className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
        <p className="text-sm text-on-surface-variant">Belum ada aktivitas</p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <h3 className="text-sm font-bold text-on-surface mb-4">Timeline Lamaran</h3>

      <div className="flex flex-col gap-3">
        {timeline.map((item, idx) => {
          const isLast = idx === timeline.length - 1
          return (
            <div key={item.id} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                </div>
                {!isLast && (
                  <div className="flex-1 w-px bg-outline-variant/40 my-1" />
                )}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-on-surface">
                    {STATUS_LABEL[item.status] ?? item.status}
                  </div>
                  <div className="text-[10px] text-on-surface-variant whitespace-nowrap font-mono">
                    {new Date(item.createdAt).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {item.notes && (
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}