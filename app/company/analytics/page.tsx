// app/company/analytics/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getCompanyAnalytics,
  type PeriodKey,
} from '@/lib/queries/company-analytics'
import { CompanyAnalyticsClient } from './analytics-client'

export const metadata = {
  title: 'Analytics — VocAZ',
}

type SearchParams = {
  period?: string
}

const VALID_PERIODS: PeriodKey[] = ['7d', '30d', '90d', 'all']

export default async function CompanyAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const sp = await searchParams
  const period: PeriodKey = VALID_PERIODS.includes(sp.period as PeriodKey)
    ? (sp.period as PeriodKey)
    : '30d'

  const data = await getCompanyAnalytics(ctx.companyId, period)

  return <CompanyAnalyticsClient data={data} period={period} />
}