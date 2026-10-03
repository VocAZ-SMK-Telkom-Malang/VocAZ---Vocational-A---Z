// components/company/analytics/top-jobs-table.tsx
'use client'

import Link from 'next/link'
import { Briefcase, ExternalLink, TrendingUp } from 'lucide-react'
import type { TopJob } from '@/lib/queries/company-analytics'

const STATUS_LABEL: Record<string, string> = {
  active: 'Aktif',
  draft: 'Draft',
  closed: 'Ditutup',
  archived: 'Arsip',
}

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-surface-container text-on-surface-variant border-outline-variant',
  archived: 'bg-surface-container text-on-surface-variant border-outline-variant',
}

export function TopJobsTable({ data }: { data: TopJob[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="h-64 flex flex-col items-center justify-center text-center gap-2">
          <Briefcase className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm font-bold text-on-surface">
            Belum ada data lowongan
          </p>
          <p className="text-xs text-on-surface-variant">
            Posting lowongan untuk melihat performa
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden">
      <div className="p-6 pb-4">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          Top Performing Jobs
        </h3>
        <p className="text-[11px] text-on-surface-variant mt-0.5">
          Lowongan dengan performa terbaik
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-surface-container-low border-y border-outline-variant/30">
            <tr>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Lowongan
              </th>
              <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Pelamar
              </th>
              <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Diterima
              </th>
              <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Avg Match
              </th>
              <th className="px-4 py-3 text-center font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Konversi
              </th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((job) => (
              <tr
                key={job.id}
                className="border-b border-outline-variant/20 hover:bg-surface-container-low/40 transition-colors"
              >
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/company/jobs/${job.id}`}
                      className="text-sm font-bold text-on-surface hover:text-primary transition-colors line-clamp-1"
                    >
                      {job.title}
                    </Link>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded border font-mono text-[9px] font-bold shrink-0 ${
                        STATUS_STYLE[job.status] ?? ''
                      }`}
                    >
                      {STATUS_LABEL[job.status] ?? job.status}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-on-surface-variant">
                    {job.daysOpen} hari dibuka
                  </p>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="font-display text-base font-black text-on-surface">
                    {job.applicantCount}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="font-display text-base font-black text-emerald-600">
                    {job.hiredCount}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                      job.avgMatchScore >= 70
                        ? 'bg-emerald-50 text-emerald-700'
                        : job.avgMatchScore >= 50
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {job.avgMatchScore}%
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="font-mono text-sm font-bold text-primary">
                    {job.conversionRate}%
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/company/jobs/${job.id}/applicants`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    Detail
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}