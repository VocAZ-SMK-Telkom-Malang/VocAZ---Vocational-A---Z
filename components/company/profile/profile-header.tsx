// components/company/profile/profile-header.tsx
'use client'

import { Building2, Eye, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

type Props = {
  companyName: string
  slug: string
  logoUrl: string | null
  verified: boolean
  completion: number
}

export function ProfileHeader({
  companyName,
  slug,
  logoUrl,
  verified,
  completion,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#FFF8F5] to-[#FFEFEA] border border-primary/10 shadow-[0_8px_40px_-12px_rgba(183,0,17,0.15)]">
      <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* LEFT: Logo + Info */}
          <div className="flex items-start gap-4 flex-1">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={companyName}
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shrink-0 border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg">
                <Building2 className="w-8 h-8" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                <Building2 className="w-3 h-3 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-primary">
                  Company Profile
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
                  {companyName}
                </h1>
                {verified && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
              </div>

              <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                Kelola informasi yang tampil di halaman publik{' '}
                <Link
                  href={`/perusahaan/${slug}`}
                  className="text-primary font-bold hover:underline"
                >
                  /perusahaan/{slug}
                </Link>
              </p>
            </div>

            {/* Preview button */}
          </div>
        </div>

        {/* Completion Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Kelengkapan Profil
            </span>
            <span className="text-sm font-black text-primary">
              {completion}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}