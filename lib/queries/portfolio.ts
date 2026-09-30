// lib/queries/portfolio.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// HELPER
// ============================================

async function getSessionProfileId(): Promise<string | null> {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: { select: { id: true } } },
  })

  return user?.studentProfile?.id ?? null
}

// ============================================
// PORTFOLIO
// ============================================

export async function getMyPortfolios() {
  const profileId = await getSessionProfileId()
  if (!profileId) return []

  const items = await prisma.studentPortfolio.findMany({
    where: { studentId: profileId },
    include: { media: true },
    orderBy: [{ startDate: 'desc' }, { createdAt: 'desc' }],
  })

  return items.map((po) => ({
    id: po.id,
    title: po.title,
    description: po.description,
    projectUrl: po.projectUrl,
    thumbnailUrl: po.thumbnailUrl,
    thumbnailKey: po.thumbnailKey,
    startDate: po.startDate?.toISOString() ?? null,
    endDate: po.endDate?.toISOString() ?? null,
    isPublic: po.isPublic,
    createdAt: po.createdAt.toISOString(),
    media: po.media.map((m) => ({
      id: m.id,
      url: m.url,
      key: m.key,
      mediaType: m.mediaType,
      mimeType: m.mimeType,
      sortOrder: m.sortOrder,
    })),
  }))
}

export type PortfolioItem = Awaited<ReturnType<typeof getMyPortfolios>>[number]

// ============================================
// ACHIEVEMENT
// ============================================

export async function getMyAchievements() {
  const profileId = await getSessionProfileId()
  if (!profileId) return []

  const items = await prisma.studentAchievement.findMany({
    where: { studentId: profileId },
    orderBy: { dateAchieved: 'desc' },
  })

  return items.map((a) => ({
    id: a.id,
    title: a.title,
    issuer: a.issuer,
    level: a.level,
    dateAchieved: a.dateAchieved?.toISOString() ?? null,
    description: a.description,
    certificateUrl: a.certificateUrl,
    certificateKey: a.certificateKey,
    createdAt: a.createdAt.toISOString(),
  }))
}

export type AchievementItem = Awaited<ReturnType<typeof getMyAchievements>>[number]