// app/company/dashboard/dashboard-client.tsx
'use client'

import { WelcomeBanner } from '@/components/company/dashboard/welcome-banner'
import { StatCard } from '@/components/company/dashboard/stat-card'
import { RecruitmentTrendChart } from '@/components/company/dashboard/recruitment-trend-chart'
import { QuickActions } from '@/components/company/dashboard/quick-actions'
import { ActiveJobsList } from '@/components/company/dashboard/active-jobs-list'
import { RecentApplicants } from '@/components/company/dashboard/recent-applicants'
import { SmartTalentMatch } from '@/components/company/dashboard/smart-talent-match'
import { SecurityVerification } from '@/components/company/dashboard/security-verification'
import type {
  CompanyContext,
  DashboardStats,
  TrendPoint,
  ActiveJobDTO,
  RecentApplicantDTO,
  SmartMatchDTO,
  VerificationSummary,
} from '@/lib/queries/company-dashboard'

type Props = {
  ctx: CompanyContext
  stats: DashboardStats
  trend: TrendPoint[]
  activeJobs: ActiveJobDTO[]
  recentApplicants: RecentApplicantDTO[]
  matchCandidates: SmartMatchDTO[]
  verification: VerificationSummary
}

export function CompanyDashboardClient({
  ctx,
  stats,
  trend,
  activeJobs,
  recentApplicants,
  matchCandidates,
  verification,
}: Props) {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <WelcomeBanner
        userName={ctx.ownerName}
        companyName={ctx.companyName}
        newApplicantsToday={stats.newApplicantsToday}
        talentPool={stats.talentPool}
        verificationStatus={ctx.verificationStatus}
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="work"
          iconColor="bg-primary-fixed/50 text-primary"
          label="Lowongan Aktif"
          value={stats.activeJobs}
          trend={stats.activeJobsTrend}
          trendLabel="vs 30 hari lalu"
          href="/company/jobs"
        />
        <StatCard
          icon="group"
          iconColor="bg-tertiary-fixed/50 text-tertiary"
          label="Total Pelamar"
          value={stats.totalApplicants}
          trend={stats.totalApplicantsTrend}
          trendLabel="vs 30 hari lalu"
          href="/company/pipeline"
        />
        <StatCard
          icon="search"
          iconColor="bg-secondary-fixed/50 text-secondary"
          label="Talent Pool"
          value={stats.talentPool}
          trendLabel="kandidat unik"
          href="/company/talent"
        />
        <StatCard
          icon="mail"
          iconColor="bg-[#FCE7F3] text-[#9D174D]"
          label="Pelamar Baru (Hari Ini)"
          value={stats.newApplicantsToday}
          trend={stats.newApplicantsTodayTrend}
          trendLabel="vs kemarin"
          href="/company/pipeline?filter=new"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <RecruitmentTrendChart data={trend} period="30 Hari Terakhir" />
          <ActiveJobsList jobs={activeJobs} />
          <RecentApplicants applicants={recentApplicants} />
        </div>

        <div className="flex flex-col gap-6">
          <QuickActions />
          <SmartTalentMatch candidates={matchCandidates} />
          <SecurityVerification summary={verification} />
        </div>
      </section>
    </div>
  )
}