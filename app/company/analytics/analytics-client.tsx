// app/company/analytics/analytics-client.tsx
'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnalyticsHeader } from '@/components/company/analytics/analytics-header'
import { KPICards } from '@/components/company/analytics/kpi-cards'
import { ApplicationTrendChart } from '@/components/company/analytics/application-trend-chart'
import { RecruitmentFunnel } from '@/components/company/analytics/recruitment-funnel'
import { TopSkillsChart } from '@/components/company/analytics/top-skills-chart'
import { TopJobsTable } from '@/components/company/analytics/top-jobs-table'
import { DemographicsCharts } from '@/components/company/analytics/demographics-charts'
import { SkillCoverageRadar } from '@/components/company/analytics/skill-coverage-radar'
import type {
  AnalyticsData,
  PeriodKey,
} from '@/lib/queries/company-analytics'

const PERIOD_LABEL: Record<PeriodKey, string> = {
  '7d': '7 Hari Terakhir',
  '30d': '30 Hari Terakhir',
  '90d': '90 Hari Terakhir',
  all: 'Semua Waktu',
}

type Props = {
  data: AnalyticsData
  period: PeriodKey
}

export function CompanyAnalyticsClient({ data, period }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  function handlePeriodChange(newPeriod: PeriodKey) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', newPeriod)
    startTransition(() => {
      router.push(`/company/analytics?${params.toString()}`)
    })
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <AnalyticsHeader
        currentPeriod={period}
        onPeriodChange={handlePeriodChange}
      />

      <div className={isPending ? 'opacity-60 transition-opacity' : ''}>
        {/* KPI Cards */}
        <KPICards kpis={data.kpis} />

        {/* Row 1: Trend + Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ApplicationTrendChart
            data={data.trend}
            period={PERIOD_LABEL[period]}
          />
          <RecruitmentFunnel data={data.funnel} />
        </div>

        {/* Row 2: Top Skills + Top Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TopSkillsChart data={data.topSkills} />
          <SkillCoverageRadar data={data.skillCoverage} />
        </div>

        {/* Row 3: Demographics */}
        <div className="mt-6">
          <DemographicsCharts
            gender={data.demographics.gender}
            city={data.demographics.city}
          />
        </div>

        {/* Row 4: Top Jobs Table */}
        <div className="mt-6">
          <TopJobsTable data={data.topJobs} />
        </div>
      </div>
    </div>
  )
}