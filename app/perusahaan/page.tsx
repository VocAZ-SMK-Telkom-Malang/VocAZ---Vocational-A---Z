// app/perusahaan/page.tsx
import type { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { CompaniesFilter } from '@/components/perusahaan/companies-filter'
import { CompaniesGrid } from '@/components/perusahaan/companies-grid'
import { CompaniesCta } from '@/components/perusahaan/companies-cta'
import {
  getPublicCompanies,
  getPublicCompanyStats,
  getPublicCompanyIndustries,
} from '@/lib/perusahaan/queries'

export const metadata: Metadata = {
  title: 'Perusahaan Mitra — VocAZ',
  description:
    'Direktori perusahaan mitra industri yang merekrut talenta SMK terverifikasi BNSP & BKK.',
}

type Props = {
  searchParams: Promise<{
    search?: string
    industry?: string
    verified?: string
    page?: string
  }>
}

export default async function PerusahaanPage({ searchParams }: Props) {
  const params = await searchParams

  const search = params.search?.trim() || ''
  const industry = params.industry || 'all'
  const verified = params.verified === 'true'
  const page = Number(params.page) || 1

  const [result, stats, industries] = await Promise.all([
    getPublicCompanies({
      search,
      industry,
      verified,
      page,
      pageSize: 9,
    }),
    getPublicCompanyStats(),
    getPublicCompanyIndustries(),
  ])

  return (
    <>
      <LandingHeader />

      <main className="w-full min-h-screen pt-24 bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5]">
        <CompaniesFilter industries={industries} stats={stats} />

        <CompaniesGrid
          companies={result.companies}
          pagination={result.pagination}
          searchParams={params}
        />

        <CompaniesCta totalCompanies={stats.totalCompanies} />
      </main>

      <LandingFooter />
    </>
  )
}