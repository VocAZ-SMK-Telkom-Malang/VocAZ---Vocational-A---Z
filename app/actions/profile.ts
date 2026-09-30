// app/actions/profile.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

type ActionResult = { ok: boolean; error?: string; data?: any }

// ============================================
// HELPER
// ============================================

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
// UPDATE PROFILE UTAMA
// ============================================

export async function updateProfile(input: {
  headline?: string
  bio?: string
  city?: string
  province?: string
  address?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  isOpenToWork?: boolean
  isPublic?: boolean
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    if (input.phone !== undefined) {
      await prisma.user.update({
        where: { id: profile.userId },
        data: { phone: input.phone || null },
      })
    }

    await prisma.studentProfile.update({
      where: { id: profile.id },
      data: {
        headline: input.headline ?? profile.headline,
        bio: input.bio ?? profile.bio,
        city: input.city ?? profile.city,
        province: input.province ?? profile.province,
        address: input.address ?? profile.address,
        dateOfBirth: input.dateOfBirth
          ? new Date(input.dateOfBirth)
          : profile.dateOfBirth,
        gender: (input.gender as any) ?? profile.gender,
        isOpenToWork: input.isOpenToWork ?? profile.isOpenToWork,
        isPublic: input.isPublic ?? profile.isPublic,
      },
    })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/personal')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    console.error('Update profile error:', err)
    return { ok: false, error: 'Gagal update profile' }
  }
}

// ============================================
// UPDATE COVER & AVATAR
// ============================================

export async function updateCoverImage(
  url: string | null,
  key: string | null
): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    await prisma.studentProfile.update({
      where: { id: profile.id },
      data: { coverImageUrl: url, coverImageKey: key },
    })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/personal')
    revalidatePath('/student/talents')
    revalidatePath(`/student/talents/${profile.id}`)
    revalidatePath('/talenta')
    revalidatePath(`/talenta/${profile.id}`)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal update cover' }
  }
}

export async function updateAvatar(
  url: string | null,
  key: string | null
): Promise<ActionResult> {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) return { ok: false, error: 'Harus login' }

    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      include: { studentProfile: { select: { id: true } } },
    })

    if (!user) return { ok: false, error: 'User tidak ditemukan' }

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: url, avatarKey: key },
    })

    const profileId = user.studentProfile?.id

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/personal')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    if (profileId) {
      revalidatePath(`/student/talents/${profileId}`)
      revalidatePath(`/talenta/${profileId}`)
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal update avatar' }
  }
}

// ============================================
// SKILLS
// ============================================

export async function addStudentSkill(input: {
  skillId: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const existing = await prisma.studentSkill.findUnique({
      where: {
        studentId_skillId: {
          studentId: profile.id,
          skillId: input.skillId,
        },
      },
    })

    if (existing) {
      return { ok: false, error: 'Skill sudah ditambahkan' }
    }

    await prisma.studentSkill.create({
      data: {
        studentId: profile.id,
        skillId: input.skillId,
        proficiency: input.proficiency,
      },
    })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/skills')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal menambah skill' }
  }
}

export async function updateStudentSkill(input: {
  id: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const skill = await prisma.studentSkill.findUnique({
      where: { id: input.id },
      select: { studentId: true },
    })

    if (!skill || skill.studentId !== profile.id) {
      return { ok: false, error: 'Skill tidak ditemukan' }
    }

    await prisma.studentSkill.update({
      where: { id: input.id },
      data: { proficiency: input.proficiency },
    })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/skills')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal update skill' }
  }
}

export async function deleteStudentSkill(id: string): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const skill = await prisma.studentSkill.findUnique({
      where: { id },
      select: { studentId: true },
    })

    if (!skill || skill.studentId !== profile.id) {
      return { ok: false, error: 'Skill tidak ditemukan' }
    }

    await prisma.studentSkill.delete({ where: { id } })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/skills')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal hapus skill' }
  }
}

// ============================================
// EDUCATION
// ============================================

export async function saveEducation(input: {
  id?: string
  schoolName: string
  major?: string
  degree?: string
  startYear?: number
  endYear?: number
  gpa?: number
  description?: string
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    if (!input.schoolName?.trim()) {
      return { ok: false, error: 'Nama sekolah wajib diisi' }
    }

    if (input.id) {
      const existing = await prisma.studentEducation.findUnique({
        where: { id: input.id },
        select: { studentId: true },
      })

      if (!existing || existing.studentId !== profile.id) {
        return { ok: false, error: 'Pendidikan tidak ditemukan' }
      }

      await prisma.studentEducation.update({
        where: { id: input.id },
        data: {
          schoolName: input.schoolName.trim(),
          major: input.major?.trim() || null,
          degree: input.degree?.trim() || null,
          startYear: input.startYear ?? null,
          endYear: input.endYear ?? null,
          gpa: input.gpa ?? null,
          description: input.description?.trim() || null,
        },
      })
    } else {
      await prisma.studentEducation.create({
        data: {
          studentId: profile.id,
          schoolName: input.schoolName.trim(),
          major: input.major?.trim() || null,
          degree: input.degree?.trim() || null,
          startYear: input.startYear ?? null,
          endYear: input.endYear ?? null,
          gpa: input.gpa ?? null,
          description: input.description?.trim() || null,
        },
      })
    }

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/experience')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal menyimpan pendidikan' }
  }
}

export async function deleteEducation(id: string): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const existing = await prisma.studentEducation.findUnique({
      where: { id },
      select: { studentId: true },
    })

    if (!existing || existing.studentId !== profile.id) {
      return { ok: false, error: 'Pendidikan tidak ditemukan' }
    }

    await prisma.studentEducation.delete({ where: { id } })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/experience')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal hapus pendidikan' }
  }
}

// ============================================
// EXPERIENCE
// ============================================

export async function saveExperience(input: {
  id?: string
  title: string
  companyName?: string
  employmentType?: string
  location?: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  description?: string
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    if (!input.title?.trim()) {
      return { ok: false, error: 'Posisi wajib diisi' }
    }

    const data = {
      title: input.title.trim(),
      companyName: input.companyName?.trim() || null,
      employmentType: (input.employmentType as any) ?? null,
      location: input.location?.trim() || null,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      isCurrent: input.isCurrent ?? false,
      description: input.description?.trim() || null,
    }

    if (input.id) {
      const existing = await prisma.studentExperience.findUnique({
        where: { id: input.id },
        select: { studentId: true },
      })

      if (!existing || existing.studentId !== profile.id) {
        return { ok: false, error: 'Pengalaman tidak ditemukan' }
      }

      await prisma.studentExperience.update({
        where: { id: input.id },
        data,
      })
    } else {
      await prisma.studentExperience.create({
        data: {
          studentId: profile.id,
          ...data,
        },
      })
    }

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/experience')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal menyimpan pengalaman' }
  }
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const existing = await prisma.studentExperience.findUnique({
      where: { id },
      select: { studentId: true },
    })

    if (!existing || existing.studentId !== profile.id) {
      return { ok: false, error: 'Pengalaman tidak ditemukan' }
    }

    await prisma.studentExperience.delete({ where: { id } })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/experience')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal hapus pengalaman' }
  }
}