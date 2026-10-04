// lib/queries/school-partners.ts
import { prisma } from '@/lib/prisma'

export type PartnerListItem = {
  id: string
  partnershipType: string
  status: string
  startDate: string | null
  endDate: string | null
  notes: string | null
  createdAt: string

  company: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    industry: string | null
    city: string | null
    isVerified: boolean
    activeJobsCount: number
    hiredCount: number
  }
}

export type PartnerStats = {
  total: number
  active: number
  mou: number
  companies: number
}

export async function getSchoolPartners(
  schoolId: string,
  filters: { search?: string; type?: string; status?: string } = {}
): Promise<PartnerListItem[]> {
  const where: any = { schoolId }

  if (filters.type && filters.type !== 'all') {
    where.partnershipType = filters.type
  }

  if (filters.status && filters.status !== 'all') {
    where.status = filters.status
  }

  if (filters.search && filters.search.trim()) {
    where.company = {
      name: { contains: filters.search.trim(), mode: 'insensitive' },
    }
  }

  const items = await prisma.industryPartner.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          industry: true,
          city: true,
          verificationStatus: true,
          _count: { select: { jobs: true } },
        },
      },
    },
  })

  // Count hired per company (placement)
  const companyIds = items.map((i) => i.company.id)
  const hiredMap = new Map<string, number>()

  if (companyIds.length > 0) {
    const placements = await prisma.careerMonitoring.findMany({
      where: {
        schoolId,
        companyId: { in: companyIds },
        stage: 'placed',
      },
      select: { companyId: true },
    })

    placements.forEach((p) => {
      if (p.companyId) {
        hiredMap.set(p.companyId, (hiredMap.get(p.companyId) ?? 0) + 1)
      }
    })
  }

  return items.map((item) => ({
    id: item.id,
    partnershipType: item.partnershipType,
    status: item.status,
    startDate: item.startDate ? item.startDate.toISOString() : null,
    endDate: item.endDate ? item.endDate.toISOString() : null,
    notes: item.notes ?? null,
    createdAt: item.createdAt.toISOString(),

    company: {
      id: item.company.id,
      name: item.company.name,
      slug: item.company.slug,
      logoUrl: item.company.logoUrl ?? null,
      industry: item.company.industry ?? null,
      city: item.company.city ?? null,
      isVerified: item.company.verificationStatus === 'verified',
      activeJobsCount: item.company._count.jobs,
      hiredCount: hiredMap.get(item.company.id) ?? 0,
    },
  }))
}

export async function getPartnerStats(schoolId: string): Promise<PartnerStats> {
  const [total, active, mou, uniqueCompanies] = await Promise.all([
    prisma.industryPartner.count({ where: { schoolId } }),
    prisma.industryPartner.count({
      where: { schoolId, status: 'active' },
    }),
    prisma.industryPartner.count({
      where: { schoolId, partnershipType: 'mou' },
    }),
    prisma.industryPartner.findMany({
      where: { schoolId },
      select: { companyId: true },
      distinct: ['companyId'],
    }),
  ])

  return {
    total,
    active,
    mou,
    companies: uniqueCompanies.length,
  }
}

// ============================================
// COMPANIES tersedia untuk jadi partner (belum terdaftar)
// ============================================

export async function getAvailableCompanies(
  schoolId: string,
  search?: string
) {
  const existing = await prisma.industryPartner.findMany({
    where: { schoolId },
    select: { companyId: true },
  })
  const existingIds = existing.map((e) => e.companyId)

  const where: any = {
    verificationStatus: 'verified',
  }
  if (existingIds.length > 0) {
    where.id = { notIn: existingIds }
  }

  if (search && search.trim()) {
    where.OR = [
      { name: { contains: search.trim(), mode: 'insensitive' } },
      { industry: { contains: search.trim(), mode: 'insensitive' } },
    ]
  }

  return prisma.company.findMany({
    where,
    orderBy: { name: 'asc' },
    take: 30,
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      industry: true,
      city: true,
    },
  })
}