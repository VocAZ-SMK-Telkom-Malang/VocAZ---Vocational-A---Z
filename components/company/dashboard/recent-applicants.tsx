// components/company/dashboard/recent-applicants.tsx
import Link from 'next/link'
import { ChevronRight, Inbox, BadgeCheck, Zap } from 'lucide-react'
import type { RecentApplicantDTO } from '@/lib/queries/company-dashboard'

export function RecentApplicants({
  applicants,
}: {
  applicants: RecentApplicantDTO[]
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-on-surface">Pelamar Terbaru</h3>
        <Link
          href="/company/pipeline"
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
        >
          Lihat Pipeline
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {applicants.length === 0 ? (
        <div className="py-8 flex flex-col items-center text-center gap-2">
          <Inbox className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm text-on-surface-variant">Belum ada pelamar masuk</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {applicants.map((a) => (
            <div
              key={a.applicationId}
              className="flex items-start gap-3 p-3 rounded-xl border border-outline-variant/30 hover:border-primary/30 hover:bg-surface-container-low/40 transition-all"
            >
              {a.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.avatarUrl}
                  alt={a.name}
                  className="w-11 h-11 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {a.initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-on-surface truncate">
                    {a.name}
                  </h4>
                  {a.isVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {a.headline ?? a.school ?? 'Siswa SMK'}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {a.certificateCount > 0 && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[10px] font-bold">
                      <BadgeCheck className="w-3 h-3" />
                      {a.certificateCount} Sertifikat
                    </span>
                  )}
                  {a.matchScore !== null && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
                      <Zap className="w-3 h-3" />
                      {a.matchScore}% Match
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    {a.appliedAtRelative}
                  </span>
                  <Link
                    href={`/company/pipeline/${a.applicationId}`}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Tinjau Profil
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}