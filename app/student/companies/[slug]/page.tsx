// app/student/companies/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Globe,
  Mail,
  Phone,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react'
import {
  getCompanyBySlug,
  isCompanySaved,
} from '@/lib/queries/company-detail'
import { CompanyDetailHero } from '@/components/student/companies/company-detail-hero'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params
  const company = await getCompanyBySlug(slug)

  if (!company) {
    notFound()
  }

  const saved = await isCompanySaved(company.id)

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/student/companies"
        className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar perusahaan
      </Link>

      {/* Hero */}
      <CompanyDetailHero company={company} initialSaved={saved} />

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — About + Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
            <h2 className="text-lg font-black text-on-surface mb-3">
              Tentang Perusahaan
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
              {company.description || 'Belum ada deskripsi.'}
            </p>
          </section>

          {/* Jobs */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-on-surface">
                Lowongan Aktif{' '}
                <span className="text-on-surface-variant font-bold">
                  ({company.jobs.length})
                </span>
              </h2>
              {company.jobs.length > 0 && (
                <Link
                  href={`/student/jobs?company=${company.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
                >
                  Lihat semua
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {company.jobs.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-8 text-center">
                <Briefcase className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
                <p className="text-sm text-on-surface-variant">
                  Belum ada lowongan aktif saat ini
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {company.jobs.map((job) => {
                  const initials = company.name
                    .split(' ')
                    .map((w: string) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)

                  return (
                    <Link
                      key={job.id}
                      href={`/student/jobs/${job.slug}`}
                      className="group flex items-start gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all"
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0"
                        style={{ backgroundColor: company.logoColor }}
                      >
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {company.name}
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-medium text-on-surface-variant">
                            <MapPin className="w-2.5 h-2.5" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-medium text-on-surface-variant">
                            <Clock className="w-2.5 h-2.5" />
                            {job.employmentType}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              job.workMode === 'remote'
                                ? 'bg-emerald-50 text-emerald-700'
                                : job.workMode === 'hybrid'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {job.workMode}
                          </span>
                        </div>

                        {job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.skills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded bg-primary/5 text-[9px] font-semibold text-primary"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </Link>
                  )
                })}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT — Contact */}
        <aside className="space-y-4">
          <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
            <h3 className="text-sm font-black text-on-surface uppercase tracking-wider mb-4">
              Informasi Kontak
            </h3>
            <div className="space-y-3">
              {company.website && (
                <ContactRow
                  icon={<Globe className="w-4 h-4" />}
                  label="Website"
                  value={company.website.replace(/^https?:\/\//, '')}
                  href={company.website}
                />
              )}
              {company.email && (
                <ContactRow
                  icon={<Mail className="w-4 h-4" />}
                  label="Email"
                  value={company.email}
                  href={`mailto:${company.email}`}
                />
              )}
              {company.phone && (
                <ContactRow
                  icon={<Phone className="w-4 h-4" />}
                  label="Telepon"
                  value={company.phone}
                  href={`tel:${company.phone}`}
                />
              )}
              <ContactRow
                icon={<MapPin className="w-4 h-4" />}
                label="Lokasi"
                value={company.location}
              />
            </div>
          </section>

          {/* Highlight */}
          <section className="rounded-2xl bg-gradient-to-br from-primary/5 to-surface-container-lowest border border-outline-variant/30 p-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-xs font-black uppercase tracking-wider text-primary">
                Highlight
              </p>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              <span className="font-bold text-on-surface">{company.name}</span>{' '}
              saat ini punya{' '}
              <span className="font-bold text-primary">
                {company.jobs.length} lowongan aktif
              </span>{' '}
              dan rating{' '}
              <span className="font-bold text-amber-600">
                {company.rating.toFixed(1)}/5
              </span>{' '}
              dari {company.reviewCount} review.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-container transition-colors">
      <div className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <p className="text-sm font-semibold text-on-surface truncate">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    )
  }
  return content
}