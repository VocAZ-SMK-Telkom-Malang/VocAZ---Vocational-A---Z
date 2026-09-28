// app/perusahaan/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Globe,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
  Calendar,
  Briefcase,
} from 'lucide-react'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { getPublicCompanyBySlug } from '@/lib/perusahaan/queries'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params
  const company = await getPublicCompanyBySlug(slug)

  if (!company) notFound()

  const isVerified = company.verificationStatus === 'verified'

  return (
    <>
      <LandingHeader />
      <main className="w-full min-h-screen pt-24 bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/perusahaan"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Direktori
          </Link>

          {/* Header card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm ring-1 ring-outline-variant/30 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-outline-variant/20">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-on-surface-variant" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed/60 text-tertiary-container text-[10px] font-bold uppercase tracking-wider">
                      <BadgeCheck className="w-3 h-3 fill-current" />
                      Verified Company
                    </span>
                  )}
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface mb-2">
                  {company.name}
                </h1>
                {company.industry && (
                  <p className="text-sm text-tertiary-container font-semibold mb-3">
                    {company.industry}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant">
                  {company.city && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {company.city}
                      {company.province ? `, ${company.province}` : ''}
                    </span>
                  )}
                  {company.foundedYear && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Berdiri {company.foundedYear}
                    </span>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {company.description && (
              <p className="mt-6 text-sm text-on-surface-variant leading-relaxed">
                {company.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <StatCard
              icon={Briefcase}
              value={`${company.openJobsCount}`}
              label="Lowongan Aktif"
              color="text-primary"
              bg="bg-primary/10"
            />
            <StatCard
              icon={Building2}
              value={`${company.jobsCount}`}
              label="Total Lowongan"
              color="text-tertiary"
              bg="bg-tertiary-fixed/40"
            />
            <StatCard
              icon={BadgeCheck}
              value={isVerified ? 'Verified' : 'Pending'}
              label="Status"
              color={isVerified ? 'text-emerald-600' : 'text-amber-600'}
              bg={isVerified ? 'bg-emerald-500/10' : 'bg-amber-500/10'}
            />
          </div>

          {/* Jobs */}
          {company.jobs.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface mb-4">
                Lowongan Aktif
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {company.jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/lowongan/${job.slug}`}
                    className="bg-surface-container-lowest rounded-xl p-4 ring-1 ring-outline-variant/30 hover:ring-primary/30 hover:shadow-md transition-all"
                  >
                    <h3 className="font-display text-sm font-bold text-on-surface mb-1 line-clamp-2 hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant mb-2">
                      {job.city} · {job.employmentType}
                    </p>
                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <LandingFooter />
    </>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: string
  label: string
  color: string
  bg: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 ring-1 ring-outline-variant/30 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${bg} ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="font-display text-lg font-extrabold text-on-surface leading-none">
          {value}
        </div>
        <div className="text-[11px] text-on-surface-variant mt-0.5">{label}</div>
      </div>
    </div>
  )
}