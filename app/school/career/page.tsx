// app/school/career/page.tsx
import { redirect } from 'next/navigation'
import type { CareerStage } from '@/generated/prisma/enums'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import {
  getCareerStats,
  getCareerOpportunities,
  getRecommendedStudents,
  getRecruitmentStatus,
  getPlacements,
} from '@/lib/queries/school-career'
import { SchoolCareerClient } from './career-client'

export const metadata = {
  title: 'Career Monitoring — VocAZ BKK',
}

type SearchParams = Promise<{
  tab?: string | string[]
  stage?: string | string[]
}>

const CAREER_TABS = [
  'opportunities',
  'recommended',
  'recruitment',
  'placement',
] as const

const CAREER_STAGES = [
  'opportunity',
  'recommended',
  'applied',
  'interview',
  'offered',
  'placed',
  'not_placed',
] as const satisfies readonly CareerStage[]

function getCareerStage(value: string | string[] | undefined): CareerStage | 'all' {
  if (value === 'all') return 'all'
  return CAREER_STAGES.find((stage) => stage === value) ?? 'all'
}

export default async function SchoolCareerPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const sp = await searchParams
  const tab =
    CAREER_TABS.find((candidate) => candidate === sp.tab) ?? 'opportunities'
  const stage = getCareerStage(sp.stage)

  const [stats, opportunities, recommended, recruitment, placements] =
    await Promise.all([
      getCareerStats(ctx.schoolId),
      tab === 'opportunities'
        ? getCareerOpportunities(ctx.schoolId)
        : Promise.resolve([]),
      tab === 'recommended'
        ? getRecommendedStudents(ctx.schoolId)
        : Promise.resolve([]),
      tab === 'recruitment'
        ? getRecruitmentStatus(ctx.schoolId, stage)
        : Promise.resolve([]),
      tab === 'placement' ? getPlacements(ctx.schoolId) : Promise.resolve([]),
    ])

  return (
    <SchoolCareerClient
      stats={stats}
      tab={tab}
      stage={stage}
      opportunities={opportunities}
      recommended={recommended}
      recruitment={recruitment}
      placements={placements}
    />
  )
}