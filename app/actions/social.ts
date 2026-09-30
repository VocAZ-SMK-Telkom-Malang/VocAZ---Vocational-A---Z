// app/actions/social.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

type ActionResult = { ok: boolean; error?: string; data?: any }

async function getCurrentUser() {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })
}

// ============================================
// TOGGLE FOLLOW
// ============================================

export async function toggleFollow(
  targetStudentProfileId: string
): Promise<ActionResult & { following?: boolean; followerCount?: number }> {
  try {
    const user = await getCurrentUser()
    if (!user?.studentProfile) {
      return { ok: false, error: 'Harus login sebagai student' }
    }

    if (user.studentProfile.id === targetStudentProfileId) {
      return { ok: false, error: 'Tidak bisa follow diri sendiri' }
    }

    const target = await prisma.studentProfile.findUnique({
      where: { id: targetStudentProfileId },
      select: { id: true, isPublic: true, followerCount: true },
    })

    if (!target) return { ok: false, error: 'Student tidak ditemukan' }
    if (!target.isPublic) return { ok: false, error: 'Profil ini privat' }

    const existing = await prisma.studentFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetStudentProfileId,
        },
      },
    })

    if (existing) {
      // UNFOLLOW
      await prisma.$transaction([
        prisma.studentFollow.delete({ where: { id: existing.id } }),
        prisma.studentProfile.update({
          where: { id: targetStudentProfileId },
          data: { followerCount: { decrement: 1 } },
        }),
        prisma.studentProfile.update({
          where: { id: user.studentProfile.id },
          data: { followingCount: { decrement: 1 } },
        }),
      ])

      revalidatePath(`/student/talents/${targetStudentProfileId}`)
      revalidatePath('/student/profile')

      return {
        ok: true,
        following: false,
        followerCount: Math.max(0, target.followerCount - 1),
      }
    }

    // FOLLOW
    await prisma.$transaction([
      prisma.studentFollow.create({
        data: {
          followerId: user.id,
          followingId: targetStudentProfileId,
        },
      }),
      prisma.studentProfile.update({
        where: { id: targetStudentProfileId },
        data: { followerCount: { increment: 1 } },
      }),
      prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: { followingCount: { increment: 1 } },
      }),
    ])

    revalidatePath(`/student/talents/${targetStudentProfileId}`)
    revalidatePath('/student/profile')

    return {
      ok: true,
      following: true,
      followerCount: target.followerCount + 1,
    }
  } catch (err) {
    console.error('Toggle follow error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal follow',
    }
  }
}

// ============================================
// ADD FEEDBACK
// ============================================

export async function addFeedback(input: {
  studentProfileId: string
  rating: number
  message: string
  relationship?: string
}): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    if (!input.message?.trim()) {
      return { ok: false, error: 'Pesan tidak boleh kosong' }
    }

    if (input.rating < 1 || input.rating > 5) {
      return { ok: false, error: 'Rating harus 1-5' }
    }

    if (input.message.trim().length > 500) {
      return { ok: false, error: 'Maksimal 500 karakter' }
    }

    const target = await prisma.studentProfile.findUnique({
      where: { id: input.studentProfileId },
      select: { id: true },
    })

    if (!target) return { ok: false, error: 'Student tidak ditemukan' }

    const existing = await prisma.profileFeedback.findFirst({
      where: {
        studentProfileId: input.studentProfileId,
        giverUserId: user.id,
      },
    })

    if (existing) {
      return { ok: false, error: 'Kamu sudah pernah kasih feedback' }
    }

    await prisma.profileFeedback.create({
      data: {
        studentProfileId: input.studentProfileId,
        giverUserId: user.id,
        rating: input.rating,
        message: input.message.trim(),
        relationship: input.relationship ?? null,
        isVerified: user.role === 'school' || user.role === 'admin',
      },
    })

    revalidatePath(`/student/talents/${input.studentProfileId}`)
    revalidatePath('/student/profile')

    return { ok: true }
  } catch (err) {
    console.error('Add feedback error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal kirim feedback',
    }
  }
}

// ============================================
// DELETE FEEDBACK
// ============================================

export async function deleteFeedback(id: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    const feedback = await prisma.profileFeedback.findUnique({
      where: { id },
      select: { giverUserId: true, studentProfileId: true },
    })

    if (!feedback) return { ok: false, error: 'Feedback tidak ditemukan' }
    if (feedback.giverUserId !== user.id) {
      return { ok: false, error: 'Kamu tidak bisa hapus feedback orang lain' }
    }

    await prisma.profileFeedback.delete({ where: { id } })

    revalidatePath(`/student/talents/${feedback.studentProfileId}`)
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal hapus',
    }
  }
}