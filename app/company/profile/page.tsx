// app/company/profile/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { CompanyProfileClient } from './profile-client'

export const metadata = {
  title: 'Profil Perusahaan — VocAZ',
}

function calculateCompletion(company: any): number {
  const fields = [
    company.name,
    company.logoUrl,
    company.tagline,
    company.industry,
    company.companySize,
    company.website,
    company.email,
    company.phone,
    company.description,
    company.culture,
    company.benefits?.length > 0,
    company.city,
    company.province,
    company.address,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export default async function CompanyProfilePage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const company = await prisma.company.findUnique({
    where: { id: ctx.companyId },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      coverUrl: true,
      tagline: true,
      industry: true,
      companySize: true,
      website: true,
      email: true,
      phone: true,
      foundedYear: true,
      employeeRange: true,
      description: true,
      culture: true,
      benefits: true,
      address: true,
      city: true,
      province: true,
      linkedinUrl: true,
      instagramUrl: true,
      facebookUrl: true,
      verificationStatus: true,
    },
  })

  if (!company) redirect('/register/company/1')

  const completion = calculateCompletion(company)

  return (
    <CompanyProfileClient
      company={{
        ...company,
        companySize: company.companySize as string | null,
        verificationStatus: company.verificationStatus as string,
        completion,
      }}
    />
  )
}