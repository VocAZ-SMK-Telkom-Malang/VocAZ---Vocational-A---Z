// components/student/companies/company-card.tsx
'use client'

import Link from 'next/link'
import {
  MapPin,
  Users,
  Briefcase,
  BadgeCheck,
  Star,
  ArrowUpRight,
} from 'lucide-react'
import type { Company } from './types'
import { SaveCompanyButton } from './save-company-button'

type Props = {
  company: Company
}

export function CompanyCard({ company }: Props) {
  const href = `/student/companies/${company.slug}`
  const initials = company.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link
      href={href}
      className="group relative flex flex-col p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all overflow-hidden"
    >
      {company.featured && (
        <div className="absolute top-0 right-0 px-2.5 py-1 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[9px] font-black uppercase tracking-wider rounded-bl-xl">
          ⭐ Featured
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm"
          style={{ backgroundColor: company.logoColor }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0 pt-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-bold text-on-surface leading-snug line-clamp-1 group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            {company.verified && (
              <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
            )}
          </div>
          <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5">
            {company.tagline}
          </p>
        </div>

        {/* Save button — stopPropagation biar ga trigger Link */}
        <div onClick={(e) => { e.preventDefault(); e.stopPropagation() }}>
          <SaveCompanyButton
            companyId={company.id}
            initialSaved={company.saved ?? false}
          />
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 mb-3">
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold">
          <Star className="w-3 h-3 fill-current" />
          {company.rating.toFixed(1)}
          <span className="text-amber-600/70 font-medium">({company.reviewCount})</span>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-container text-[11px] font-semibold text-on-surface-variant">
          {company.industry}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-on-surface-variant mb-4">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {company.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="w-3 h-3" />
          {company.employees}
        </span>
      </div>

      <div className="mt-auto pt-3 border-t border-outline-variant/20 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
          <Briefcase className="w-3.5 h-3.5" />
          {company.activeJobs} lowongan aktif
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">
          Lihat
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  )
}