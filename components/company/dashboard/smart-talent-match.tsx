// components/company/dashboard/smart-talent-match.tsx
import Link from 'next/link'
import { Sparkles, ArrowRight, BadgeCheck } from 'lucide-react'
import type { SmartMatchDTO } from '@/lib/queries/company-dashboard'

export function SmartTalentMatch({ candidates }: { candidates: SmartMatchDTO[] }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-tertiary-fixed/50 flex items-center justify-center text-tertiary shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-on-surface">Smart Talent Match</h3>
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            Kandidat pilihan AI untuk lowongan aktif Anda.
          </p>
        </div>
      </div>

      {candidates.length === 0 ? (
        <div className="py-6 flex flex-col items-center text-center gap-2">
          <Sparkles className="w-8 h-8 text-on-surface-variant/40" />
          <p className="text-sm text-on-surface-variant">
            Belum ada rekomendasi. Posting lowongan dulu.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {candidates.map((c) => (
            <Link
              key={c.studentId}
              href={`/company/talent/${c.studentId}`}
              className="flex items-center gap-3 p-2.5 rounded-xl border border-outline-variant/30 hover:border-primary/30 hover:bg-surface-container-low/40 transition-all"
            >
              {c.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.avatarUrl}
                  alt={c.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {c.initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold text-on-surface truncate">
                    {c.name}
                  </h4>
                  {c.isVerified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant truncate">
                  {c.headline ?? c.school ?? 'Siswa SMK'}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-extrabold text-emerald-600">
                  {c.matchScore}%
                </div>
                <div className="font-mono text-[9px] text-on-surface-variant uppercase">
                  Match
                </div>
              </div>
            </Link>
          ))}

          <Link
            href="/company/talent-match"
            className="mt-2 inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors"
          >
            Jelajahi Smart Match
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}