// app/school/partners/page.tsx
import { redirect } from 'next/navigation'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import {
  getSchoolPartners,
  getPartnerStats,
  getAvailableCompanies,
} from '@/lib/queries/school-partners'
import { SchoolPartnersClient } from './partners-client'

export const metadata = {
  title: 'Partner Industri — VocAZ BKK',
}

type SearchParams = Promise<{ q?: string; type?: string; status?: string }>

export default async function SchoolPartnersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const sp = await searchParams
  const search = sp.q ?? ''
  const type = sp.type ?? 'all'
  const status = sp.status ?? 'all'

  const [partners, stats, availableCompanies] = await Promise.all([
    getSchoolPartners(ctx.schoolId, { search, type, status }),
    getPartnerStats(ctx.schoolId),
    getAvailableCompanies(ctx.schoolId, ''),
  ])

  return (
    <SchoolPartnersClient
      partners={partners}
      stats={stats}
      availableCompanies={availableCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        logoUrl: c.logoUrl ?? null,
        industry: c.industry ?? null,
        city: c.city ?? null,
      }))}
      filters={{ search, type, status }}
      canEdit={ctx.role === 'owner' || ctx.role === 'admin'}
    />
  )
}