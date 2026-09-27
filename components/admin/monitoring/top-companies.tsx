import Link from 'next/link'
import { Building2, MapPin, Briefcase, FileText } from 'lucide-react'
import { AdminCard, AdminCardHeader } from '@/components/admin/ui/admin-card'

type Company = {
  id: string
  name: string
  slug: string
  industry: string | null
  city: string | null
  logoUrl: string | null
  verificationStatus: string
  _count: { jobs: number }
  applicationsCount: number
}

type Props = {
  companies: Company[]
}

export function TopCompanies({ companies }: Props) {
  if (companies.length === 0) {
    return (
      <AdminCard>
        <AdminCardHeader
          title="Top Companies"
          description="Perusahaan dengan lowongan terbanyak"
        />
        <p className="text-sm text-on-surface-variant py-6 text-center">
          Belum ada data.
        </p>
      </AdminCard>
    )
  }

  return (
    <AdminCard>
      <AdminCardHeader
        title="Top Companies"
        description="Perusahaan dengan lowongan terbanyak"
        action={
          <Link
            href="/admin/users?role=company"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Lihat semua
          </Link>
        }
      />

      <div className="space-y-3">
        {companies.map((company, index) => (
          <Link
            key={company.id}
            href={`/admin/users?search=${company.name}`}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
          >
            {/* Rank */}
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center shrink-0 font-display font-bold text-xs text-on-surface-variant">
              {index + 1}
            </div>

            {/* Logo */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center shrink-0 overflow-hidden">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <Building2 className="w-4 h-4 text-primary" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                {company.name}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {company.industry || 'Industri belum diisi'}
                {company.city && ` • ${company.city}`}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 shrink-0 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {company._count.jobs}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {company.applicationsCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </AdminCard>
  )
}