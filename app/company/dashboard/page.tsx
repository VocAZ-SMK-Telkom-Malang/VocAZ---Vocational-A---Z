// app/company/dashboard/page.tsx
import { redirect } from 'next/navigation'
import {
  getCompanyContext,
  getDashboardStats,
  getRecruitmentTrend,
  getActiveJobs,
  getRecentApplicants,
  getSmartMatchCandidates,
  getVerificationSummary,
} from '@/lib/queries/company-dashboard'
import { CompanyDashboardClient } from './dashboard-client'

export const metadata = {
  title: 'Dashboard Recruiter — VocAZ',
}

export default async function CompanyDashboardPage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const [stats, trend, activeJobs, recentApplicants, matchCandidates, verification] =
    await Promise.all([
      getDashboardStats(ctx.companyId),
      getRecruitmentTrend(ctx.companyId, 30),
      getActiveJobs(ctx.companyId, 5),
      getRecentApplicants(ctx.companyId, 4),
      getSmartMatchCandidates(ctx.companyId, 3),
      getVerificationSummary(ctx.companyId),
    ])

  return (
    <CompanyDashboardClient
      ctx={ctx}
      stats={stats}
      trend={trend}
      activeJobs={activeJobs}
      recentApplicants={recentApplicants}
      matchCandidates={matchCandidates}
      verification={verification}
    />
  )
}