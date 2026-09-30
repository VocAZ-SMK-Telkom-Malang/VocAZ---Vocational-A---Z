// lib/queries/companies.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'


// ============================================
// GET COMPANIES FROM DB
// ============================================

export async function getCompaniesFromDB() {
  const companies = await prisma.company.findMany({
    orderBy: [{ featured: 'desc' }, { rating: 'desc' }, { name: 'asc' }],
    include: {
      _count: { select: { jobs: true } },
    },
  })

  return companies.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline ?? '',
    industry: c.industry ?? 'Lainnya',
    location: c.city ?? c.province ?? 'Indonesia',
    size: mapSize(c.companySize),
    verified: c.verificationStatus === 'verified',
    featured: c.featured ?? false,
    logoColor: c.logoColor ?? '#DC2626',
    activeJobs: c._count.jobs,
    employees: c.employeeRange ?? '-',
    founded: c.foundedYear ?? 0,
    rating: c.rating ?? 0,
    reviewCount: c.reviewCount ?? 0,
    website: c.website ?? undefined,
    email: c.email ?? undefined,
    phone: c.phone ?? undefined,
    saved: false,
  }))
}

// ============================================
// GET SAVED COMPANY IDS (dari user student pertama)
// ============================================

export async function getSavedCompanyIdsFromDB(): Promise<string[]> {
  // Ambil session
  const session = await getServerSession()
  if (!session?.user?.id) return []

  // Cari user
  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  if (!user?.studentProfile) return []

  // Query saved companies untuk profile ini
  const saved = await prisma.savedCompany.findMany({
    where: { studentId: user.studentProfile.id },
    select: { companyId: true },
  })

  return saved.map((s) => s.companyId)
}

// ============================================
// HELPER
// ============================================

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