// app/student/jobs/page.tsx
import { getJobsFromDB, getSavedJobIdsFromDB } from '@/lib/queries/jobs'
import { JobsClientView } from './jobs-client-view'
import type { Job } from '@/components/student/jobs/types'

export const dynamic = 'force-dynamic'

export default async function StudentJobsPage() {
  const [jobs, savedIds] = await Promise.all([
    getJobsFromDB(),
    getSavedJobIdsFromDB(),
  ])

  const jobsWithSaved = jobs.map((j) => ({
    ...j,
    saved: savedIds.includes(j.id),
  })) as Job[]   // ← CAST DI SINI

  return <JobsClientView initialJobs={jobsWithSaved} />
}