// app/company/jobs/[id]/job-detail-client.tsx
'use client'

import { JobDetailHeader } from '@/components/company/jobs/detail/job-detail-header'
import { JobDetailStats } from '@/components/company/jobs/detail/job-detail-stats'
import { JobDetailTabs } from '@/components/company/jobs/detail/job-detail-tabs'
import type { JobDetail, JobApplicant } from '@/lib/queries/company-job-detail'


type Props = {
  job: JobDetail
  applicants: JobApplicant[]
  isDeleted: boolean
}

export function JobDetailClient({ job, applicants, isDeleted }: Props) {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <JobDetailHeader
        jobId={job.id}
        jobSlug={job.slug}
        title={job.title}
        status={job.status}
        employmentType={job.employmentType}
        workMode={job.workMode}
        city={job.city}
        province={job.province}
        applicantCount={job.stats.totalApplicants}
        viewCount={job.viewCount}
        isDeleted={isDeleted}
      />

      <JobDetailStats stats={job.stats} />

      <JobDetailTabs job={job} applicants={applicants} />
    </div>
  )
}