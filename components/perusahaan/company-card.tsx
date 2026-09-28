// components/perusahaan/company-card.tsx
import Link from 'next/link'
import {
  MapPin,
  Briefcase,
  BadgeCheck,
  Globe,
  Building2,
  Star,
} from 'lucide-react'
import type { PublicCompany } from '@/lib/perusahaan/queries'

type Props = {
  company: PublicCompany
}

function CompanyLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="max-h-12 w-auto object-contain"
      />
    )
  }

  // Fallback initials
  const initials = name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-display font-extrabold text-lg flex items-center justify-center shadow-sm">
      {initials || 'CO'}
    </div>
  )
}

export function CompanyCard({ company }: Props) {
  const isVerified = company.verificationStatus === 'verified'
  const isFeatured = isVerified && company.openJobsCount >= 10

  return (
    <Link
      href={`/perusahaan/${company.slug}`}
      className="group relative bg-surface-container-lowest rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.04)] hover:shadow-[0_16px_36px_-10px_rgba(220,38,38,0.12)] ring-1 ring-outline-variant/30 hover:ring-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Featured ribbon */}
      {isFeatured && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-l from-tertiary to-tertiary-container text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-current" />
            Featured Partner
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Logo box */}
        <div className="w-full h-24 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden ring-1 ring-outline-variant/20">
          <CompanyLogo name={company.name} logoUrl={company.logoUrl} />
        </div>

        {/* Verified + Location */}
        <div className="flex items-center flex-wrap gap-2">
          {isVerified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed/60 text-tertiary-container border border-tertiary-fixed text-[10px] font-bold uppercase tracking-wider">
              <BadgeCheck className="w-3 h-3 fill-current" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/60" />
              Belum Terverifikasi
            </span>
          )}
          {company.city && (
            <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant">
              <MapPin className="w-3 h-3" />
              {company.city}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display text-base font-bold text-on-surface leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {company.name}
        </h3>

        {/* Industry */}
        {company.industry && (
          <p className="text-xs font-semibold text-tertiary-container line-clamp-1">
            {company.industry}
          </p>
        )}

        {/* Description */}
        {company.description && (
          <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 flex-1">
            {company.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 bg-surface-container-low/50 border-t border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] text-on-surface font-bold uppercase tracking-wider">
            {company.openJobsCount} Lowongan Aktif
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-primary font-bold text-xs group-hover:translate-x-0.5 transition-transform">
          Lihat Profil →
        </span>
      </div>
    </Link>
  )
}