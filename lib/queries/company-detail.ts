// lib/queries/company-detail.ts
import { prisma } from '@/lib/prisma'

export type CompanyDetailDTO = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  industry: string
  location: string
  size: string
  verified: boolean
  featured: boolean
  logoUrl: string | null
  logoColor: string
  website: string | null
  email: string | null
  phone: string | null
  foundedYear: number | null
  employeeRange: string
  rating: number
  reviewCount: number
  activeJobsCount: number
  jobs: Array<{
    id: string
    title: string
    slug: string
    location: string | null
    employmentType: string
    workMode: string
    skills: string[]
    salaryMin: number | null
    salaryMax: number | null
    isSalaryVisible: boolean
  }>
  totalJobs: number
}

export async function getCompanyDetailBySlug(
  slug: string
): Promise<CompanyDetailDTO | null> {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: 'active', deletedAt: null },
        orderBy: { publishedAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          slug: true,
          location: true,
          employmentType: true,
          workMode: true,
          skills: {
            select: { skill: { select: { name: true } } },
          },
          salaryMin: true,
          salaryMax: true,
          isSalaryVisible: true,
        },
      },
      _count: {
        select: { jobs: { where: { status: 'active', deletedAt: null } } },
      },
    },
  })

  if (!company) return null

  return {
    id: company.id,
    slug: company.slug,
    name: company.name,
    tagline: company.tagline ?? '',
    description: company.description ?? '',
    industry: company.industry ?? 'Lainnya',
    location: company.city ?? company.province ?? 'Indonesia',
    size: mapSize(company.companySize),
    verified: company.verificationStatus === 'verified',
    featured: company.featured,
    logoUrl: company.logoUrl,
    logoColor: company.logoColor ?? '#DC2626',
    website: company.website,
    email: company.email,
    phone: company.phone,
    foundedYear: company.foundedYear,
    employeeRange: company.employeeRange ?? '-',
    rating: company.rating,
    reviewCount: company.reviewCount,
    activeJobsCount: company._count.jobs,
    jobs: company.jobs.map((j) => ({
      id: j.id,
      title: j.title,
      slug: j.slug,
      location: j.location,
      employmentType: j.employmentType,
      workMode: j.workMode,
      skills: j.skills.map(({ skill }) => skill.name),
      salaryMin: j.salaryMin ? Number(j.salaryMin) : null,
      salaryMax: j.salaryMax ? Number(j.salaryMax) : null,
      isSalaryVisible: j.isSalaryVisible,
    })),
    totalJobs: company._count.jobs,
  }
}

function mapSize(s: string | null): string {
  const map: Record<string, string> = {
    s1_10: 'Startup',
    s11_50: 'Kecil',
    s51_200: 'Menengah',
    s201_500: 'Besar',
    s500plus: 'Enterprise',
  }
  return s ? map[s] ?? s : '-'
}

export const getCompanyBySlug = getCompanyDetailBySlug

export async function isCompanySaved(
  companyId: string,
  studentId?: string
): Promise<boolean> {
  if (!studentId) return false
  const found = await prisma.savedCompany.findUnique({
    where: { studentId_companyId: { studentId, companyId } },
  })
  return !!found
}