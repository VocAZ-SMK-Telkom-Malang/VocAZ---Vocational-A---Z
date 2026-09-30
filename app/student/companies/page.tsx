// app/student/companies/page.tsx
import {
  getCompaniesFromDB,
  getSavedCompanyIdsFromDB,
} from '@/lib/queries/companies'
import { CompaniesClientView } from './companies-client-view'

export const dynamic = 'force-dynamic'

export default async function StudentCompaniesPage() {
  const [companies, savedIds] = await Promise.all([
    getCompaniesFromDB(),
    getSavedCompanyIdsFromDB(),
  ])

  const companiesWithSaved = companies.map((c) => ({
    ...c,
    saved: savedIds.includes(c.id),
  }))

  return <CompaniesClientView initialCompanies={companiesWithSaved} />
}