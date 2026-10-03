// app/school/career/page.tsx
import { redirect } from 'next/navigation'
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

type SearchParams = Promise<{ tab?: string; stage?: string }>

export default async function SchoolCareerPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const sp = await searchParams
  const tab = (sp.tab as any) ?? 'opportunities'
  const stage = sp.stage ?? 'all'

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