// lib/queries/company-detail.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// GET COMPANY DETAIL BY SLUG
// ============================================

export async function getCompanyBySlug(slug: string) {
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      jobs: {
        where: { status: 'active' },
        orderBy: { publishedAt: 'desc' },
        take: 20,
        include: {
          company: {
            select: { name: true, verificationStatus: true },
          },
          skills: {
            include: { skill: { select: { name: true } } },
          },
        },
      },
      _count: {
        select: { jobs: true },
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
    address: company.address ?? '',
    size: formatCompanySize(company.companySize),
    verified: company.verificationStatus === 'verified',
    featured: company.featured ?? false,
    logoColor: company.logoColor ?? pickLogoColor(company.name),
    logoUrl: company.logoUrl ?? null,
    website: company.website ?? null,
    email: company.email ?? null,
    phone: company.phone ?? null,
    foundedYear: company.foundedYear ?? null,
    employeeRange: company.employeeRange ?? '-',
    rating: company.rating ?? 0,
    reviewCount: company.reviewCount ?? 0,
    activeJobsCount: company._count.jobs,
    jobs: company.jobs.map((j) => ({
      id: j.id,
      slug: j.slug,
      title: j.title,
      location: j.location ?? j.city ?? 'Remote',
      type: formatEmploymentType(j.employmentType),
      mode: formatWorkMode(j.workMode),
      salaryMin: j.salaryMin ? Number(j.salaryMin) / 1_000_000 : 0,
      salaryMax: j.salaryMax ? Number(j.salaryMax) / 1_000_000 : 0,
      postedAt: j.publishedAt?.toISOString() ?? j.createdAt.toISOString(),
      skills: j.skills.map((js) => js.skill.name),
    })),
  }
}

// ============================================
// CHECK IF COMPANY SAVED BY CURRENT USER
// ============================================

export async function isCompanySaved(companyId: string): Promise<boolean> {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) return false

    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      include: { studentProfile: true },
    })

    if (!user?.studentProfile) return false

    const saved = await prisma.savedCompany.findUnique({
      where: {
        studentId_companyId: {
          studentId: user.studentProfile.id,
          companyId,
        },
      },
    })

    return !!saved
  } catch {
    return false
  }
}

// ============================================
// HELPERS
// ============================================

function formatCompanySize(s: string | null): string {
  const map: Record<string, string> = {
    s1_10: 'Startup',
    s11_50: 'Kecil',
    s51_200: 'Menengah',
    s201_500: 'Besar',
    s500plus: 'Enterprise',
  }
  return s ? map[s] ?? s : '-'
}

function formatEmploymentType(t: string): string {
  const map: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    internship: 'Magang',
    contract: 'Kontrak',
    freelance: 'Freelance',
    volunteer: 'Volunteer',
  }
  return map[t] ?? t
}

function formatWorkMode(m: string): string {
  const map: Record<string, string> = {
    onsite: 'Onsite',
    remote: 'Remote',
    hybrid: 'Hybrid',
  }
  return map[m] ?? m
}

function pickLogoColor(name: string): string {
  const colors = [
    '#DC2626', '#EA580C', '#CA8A04', '#16A34A', '#0D9488',
    '#0369A1', '#1E40AF', '#7C3AED', '#BE185D', '#9333EA',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}