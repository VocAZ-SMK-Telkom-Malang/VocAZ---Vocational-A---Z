// app/actions/portfolio.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

type ActionResult = { ok: boolean; error?: string; data?: any }

async function getSessionProfile() {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  return user?.studentProfile ?? null
}

// ============================================
// PORTFOLIO (Project)
// ============================================

export async function savePortfolio(input: {
  id?: string
  title: string
  description?: string
  projectUrl?: string
  thumbnailUrl?: string
  thumbnailKey?: string
  startDate?: string
  endDate?: string
  isPublic?: boolean
  media?: { url: string; key: string; mediaType: 'image' | 'video' | 'document'; mimeType?: string }[]
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    if (!input.title?.trim()) {
      return { ok: false, error: 'Judul project wajib diisi' }
    }

    let portfolioId: string

    if (input.id) {
      const existing = await prisma.studentPortfolio.findUnique({
        where: { id: input.id },
        select: { studentId: true },
      })

      if (!existing || existing.studentId !== profile.id) {
        return { ok: false, error: 'Portfolio tidak ditemukan' }
      }

      await prisma.studentPortfolio.update({
        where: { id: input.id },
        data: {
          title: input.title.trim(),
          description: input.description?.trim() || null,
          projectUrl: input.projectUrl?.trim() || null,
          thumbnailUrl: input.thumbnailUrl || null,
          thumbnailKey: input.thumbnailKey || null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          isPublic: input.isPublic ?? true,
        },
      })

      portfolioId = input.id

      // Update media (hapus lama, tambah baru)
      if (input.media !== undefined) {
        await prisma.portfolioMedia.deleteMany({ where: { portfolioId } })
      }
    } else {
      const created = await prisma.studentPortfolio.create({
        data: {
          studentId: profile.id,
          title: input.title.trim(),
          description: input.description?.trim() || null,
          projectUrl: input.projectUrl?.trim() || null,
          thumbnailUrl: input.thumbnailUrl || null,
          thumbnailKey: input.thumbnailKey || null,
          startDate: input.startDate ? new Date(input.startDate) : null,
          endDate: input.endDate ? new Date(input.endDate) : null,
          isPublic: input.isPublic ?? true,
        },
      })
      portfolioId = created.id
    }

    // Insert media baru
    if (input.media && input.media.length > 0) {
      await prisma.portfolioMedia.createMany({
        data: input.media.map((m, idx) => ({
          portfolioId,
          url: m.url,
          key: m.key,
          mediaType: m.mediaType,
          mimeType: m.mimeType,
          sortOrder: idx,
        })),
      })
    }

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/portfolio')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true, data: { id: portfolioId } }
  } catch (err) {
    console.error('Save portfolio error:', err)
    return { ok: false, error: 'Gagal menyimpan portfolio' }
  }
}

export async function deletePortfolio(id: string): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const existing = await prisma.studentPortfolio.findUnique({
      where: { id },
      select: { studentId: true },
    })

    if (!existing || existing.studentId !== profile.id) {
      return { ok: false, error: 'Portfolio tidak ditemukan' }
    }

    await prisma.studentPortfolio.delete({ where: { id } })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/portfolio')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal hapus portfolio' }
  }
}

// ============================================
// ACHIEVEMENT (Prestasi)
// ============================================

export async function saveAchievement(input: {
  id?: string
  title: string
  issuer?: string
  level?: 'school' | 'regional' | 'national' | 'international'
  dateAchieved?: string
  description?: string
  certificateUrl?: string
  certificateKey?: string
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    if (!input.title?.trim()) {
      return { ok: false, error: 'Judul prestasi wajib diisi' }
    }

    const data = {
      title: input.title.trim(),
      issuer: input.issuer?.trim() || null,
      level: input.level ?? null,
      dateAchieved: input.dateAchieved ? new Date(input.dateAchieved) : null,
      description: input.description?.trim() || null,
      certificateUrl: input.certificateUrl || null,
      certificateKey: input.certificateKey || null,
    }

    if (input.id) {
      const existing = await prisma.studentAchievement.findUnique({
        where: { id: input.id },
        select: { studentId: true },
      })

      if (!existing || existing.studentId !== profile.id) {
        return { ok: false, error: 'Prestasi tidak ditemukan' }
      }

      await prisma.studentAchievement.update({
        where: { id: input.id },
        data,
      })
    } else {
      await prisma.studentAchievement.create({
        data: {
          studentId: profile.id,
          ...data,
        },
      })
    }

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/portfolio')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal menyimpan prestasi' }
  }
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const existing = await prisma.studentAchievement.findUnique({
      where: { id },
      select: { studentId: true },
    })

    if (!existing || existing.studentId !== profile.id) {
      return { ok: false, error: 'Prestasi tidak ditemukan' }
    }

    await prisma.studentAchievement.delete({ where: { id } })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/portfolio')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal hapus prestasi' }
  }
}