// components/student/jobs/job-detail-sidebar.tsx
import { JOBS, formatSalary, type Job } from './types'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Briefcase,
  BadgeCheck,
  ArrowRight,
  Globe,
} from 'lucide-react'

type Company = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
  industry: string | null
  city: string | null
  province: string | null
  website: string | null
  description: string | null
  verificationStatus: string
  _count: { jobs: number }
}

type Props = {
  company: Company
}

export function JobDetailSidebar({ company }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5">
        <h3 className="font-display text-sm font-bold text-on-surface mb-4">
          Tentang Perusahaan
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-outline-variant/20">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-6 h-6 text-on-surface-variant" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4 className="font-display text-sm font-bold text-on-surface truncate">
                {company.name}
              </h4>
              {company.verificationStatus === 'verified' && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
            </div>
            {company.industry && (
              <p className="text-xs text-on-surface-variant truncate">
                {company.industry}
              </p>
            )}
          </div>
        </div>

        <ul className="space-y-2 text-xs">
          {(company.city || company.province) && (
            <li className="flex items-start gap-2 text-on-surface-variant">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                {[company.city, company.province].filter(Boolean).join(', ')}
              </span>
            </li>
          )}
          <li className="flex items-start gap-2 text-on-surface-variant">
            <Briefcase className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>{company._count.jobs} lowongan aktif</span>
          </li>
          {company.website && (
            <li className="flex items-start gap-2 text-on-surface-variant">
              <Globe className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {company.website.replace(/^https?:\/\//, '')}
              </a>
            </li>
          )}
        </ul>

        {company.description && (
          <p className="text-xs text-on-surface-variant leading-relaxed mt-4 line-clamp-4">
            {company.description}
          </p>
        )}

        <Link
          href={`/student/companies/${company.slug}`}
          className="inline-flex items-center justify-center gap-1.5 w-full mt-4 px-4 py-2.5 rounded-full ring-1 ring-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
        >
          <span>Lihat Profil Perusahaan</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}