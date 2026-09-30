// components/student/companies/company-detail-hero.tsx
'use client'

import {
  MapPin,
  Users,
  Briefcase,
  BadgeCheck,
  Star,
  Bookmark,
  Globe,
  Calendar,
  Building2,
} from 'lucide-react'
import { useState, useTransition } from 'react'
import { toggleSaveCompany } from '@/lib/student/actions'

type Props = {
  company: {
    id: string
    name: string
    tagline: string
    industry: string
    location: string
    size: string
    verified: boolean
    featured: boolean
    logoColor: string
    website: string | null
    foundedYear: number | null
    employeeRange: string
    rating: number
    reviewCount: number
    activeJobsCount: number
  }
  initialSaved: boolean
}

export function CompanyDetailHero({ company, initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  const initials = company.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  function handleSave() {
    if (isPending) return

    startTransition(async () => {
      const result = await toggleSaveCompany(company.id)
      if (result.ok) {
        setSaved(result.data.saved)
      }
    })
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
      {/* Cover gradient */}
      <div
        className="h-32 sm:h-40 relative"
        style={{
          background: `linear-gradient(135deg, ${company.logoColor}25, ${company.logoColor}05)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {company.featured && (
          <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="px-6 sm:px-8 pb-6 -mt-12 sm:-mt-14">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Logo */}
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-white font-black text-3xl shrink-0 shadow-lg ring-4 ring-surface-container-lowest"
            style={{ backgroundColor: company.logoColor }}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
                {company.name}
              </h1>
              {company.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Terverifikasi
                </span>
              )}
            </div>

            {company.tagline && (
              <p className="text-sm text-on-surface-variant mt-1">
                {company.tagline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {company.industry}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {company.location}
              </span>
              {company.employeeRange && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {company.employeeRange}
                </span>
              )}
              {company.foundedYear && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Berdiri {company.foundedYear}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className={`p-3 rounded-xl transition-colors disabled:opacity-60 ${
                saved
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              aria-label={saved ? 'Hapus dari tersimpan' : 'Simpan perusahaan'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <StatBox
            icon={<Briefcase className="w-4 h-4" />}
            label="Lowongan Aktif"
            value={String(company.activeJobsCount)}
            accent="bg-primary/10 text-primary"
          />
          <StatBox
            icon={<Star className="w-4 h-4 fill-current" />}
            label="Rating"
            value={`${company.rating.toFixed(1)} (${company.reviewCount})`}
            accent="bg-amber-100 text-amber-700"
          />
          <StatBox
            icon={<Users className="w-4 h-4" />}
            label="Ukuran"
            value={company.size}
            accent="bg-indigo-100 text-indigo-700"
          />
          <StatBox
            icon={<BadgeCheck className="w-4 h-4" />}
            label="Status"
            value={company.verified ? 'Verified' : 'Belum'}
            accent={
              company.verified
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-surface-container text-on-surface-variant'
            }
          />
        </div>
      </div>
    </div>
  )
}

function StatBox({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <p className="text-sm font-black text-on-surface truncate">{value}</p>
      </div>
    </div>
  )
}