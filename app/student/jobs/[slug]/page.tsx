// app/student/jobs/[slug]/page.tsx
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from '@/lib/auth/session'
import {
  getJobBySlug,
  getSimilarJobs,
  getCurrentStudentProfileId,
} from '@/lib/student/queries'
import { JobDetailHeader } from '@/components/student/jobs/job-detail-header'
import { JobDetailContent } from '@/components/student/jobs/job-detail-content'
import { JobDetailSidebar } from '@/components/student/jobs/job-detail-sidebar'
import { SimilarJobs } from '@/components/student/jobs/similar-jobs'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await getServerSession()

  if (!session?.user) redirect('/auth/sign-in')

  const studentProfileId = await getCurrentStudentProfileId(session.user.id)

  const job = await getJobBySlug(slug, studentProfileId || undefined)

  if (!job) {
    notFound()
  }

  const skillIds = job.skills.map((s) => s.skill.id)
  const similarJobs = await getSimilarJobs(
    job.id,
    job.companyId,
    skillIds,
    4
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/student/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar lowongan
      </Link>

      {/* Header */}
      <JobDetailHeader
        job={{
          id: job.id,
          title: job.title,
          slug: job.slug,
          city: job.city,
          province: job.province,
          employmentType: job.employmentType,
          workMode: job.workMode,
          experienceLevel: job.experienceLevel,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          salaryCurrency: job.salaryCurrency,
          isSalaryVisible: job.isSalaryVisible,
          quota: job.quota,
          publishedAt: job.publishedAt,
          expiredAt: job.expiredAt,
          createdAt: job.createdAt,
          company: {
            id: job.company.id,
            name: job.company.name,
            slug: job.company.slug,
            logoUrl: job.company.logoUrl,
            city: job.company.city,
            province: job.company.province,
            verificationStatus: job.company.verificationStatus,
          },
          _count: job._count,
        }}
        hasApplied={job.hasApplied}
        applicationStatus={job.application?.status}
        hasSaved={job.hasSaved}
      />

      {/* Grid: content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <JobDetailContent
            description={job.description}
            requirements={job.requirements}
            responsibilities={job.responsibilities}
            skills={job.skills.map((s) => ({
              id: s.skill.id,
              name: s.skill.name,
              isRequired: s.isRequired,
            }))}
          />
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <JobDetailSidebar
              company={{
                id: job.company.id,
                name: job.company.name,
                slug: job.company.slug,
                logoUrl: job.company.logoUrl,
                industry: job.company.industry,
                city: job.company.city,
                province: job.company.province,
                website: job.company.website,
                description: job.company.description,
                verificationStatus: job.company.verificationStatus,
                _count: job.company._count,
              }}
            />

            <SimilarJobs jobs={similarJobs} />
          </div>
        </aside>
      </div>
    </div>
  )
}