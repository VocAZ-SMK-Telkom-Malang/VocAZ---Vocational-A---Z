// lib/queries/social.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// CHECK FOLLOW STATUS
// ============================================

export async function isFollowing(targetStudentProfileId: string): Promise<boolean> {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) return false

    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: { id: true },
    })

    if (!user) return false

    const existing = await prisma.studentFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetStudentProfileId,
        },
      },
    })

    return !!existing
  } catch {
    return false
  }
}

// ============================================
// GET FEEDBACKS FOR PROFILE
// ============================================

export async function getProfileFeedbacks(studentProfileId: string) {
  const feedbacks = await prisma.profileFeedback.findMany({
    where: {
      studentProfileId,
      isPublic: true,
    },
    include: {
      giver: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return feedbacks.map((f) => ({
    id: f.id,
    rating: f.rating,
    message: f.message,
    relationship: f.relationship,
    isVerified: f.isVerified,
    createdAt: f.createdAt.toISOString(),
    giver: {
      id: f.giver.id,
      name: f.giver.fullName ?? 'Anonymous',
      avatarUrl: f.giver.avatarUrl,
      role: f.giver.role,
    },
  }))
}

// ============================================
// GET FEEDBACK STATS
// ============================================

export async function getFeedbackStats(studentProfileId: string) {
  const feedbacks = await prisma.profileFeedback.findMany({
    where: { studentProfileId, isPublic: true },
    select: { rating: true },
  })

  if (feedbacks.length === 0) {
    return { count: 0, averageRating: 0 }
  }

  const total = feedbacks.reduce((sum, f) => sum + f.rating, 0)
  return {
    count: feedbacks.length,
    averageRating: Math.round((total / feedbacks.length) * 10) / 10,
  }
}

export type ProfileFeedbackItem = Awaited<
  ReturnType<typeof getProfileFeedbacks>
>[number]