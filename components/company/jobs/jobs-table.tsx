// components/company/jobs/jobs-table.tsx
import { JobsTableRow } from './jobs-table-row'
import type { JobListItem } from '@/lib/queries/company-jobs'

type Props = {
  jobs: JobListItem[]
}

export function JobsTable({ jobs }: Props) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Posisi & Lokasi
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Pelamar
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Batas Waktu
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Status
              </th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <JobsTableRow key={job.id} job={job} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}