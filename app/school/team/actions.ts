// app/school/team/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'

// ============================================
// HELPER — pakai discriminated union biar TS narrow
// ============================================

type GuardOk = {
  ok: true
  userId: string
  schoolId: string
  role: 'owner' | 'admin' | 'member'
}

type GuardErr = {
  ok: false
  error: string
}

async function requireOwnerOrAdmin(): Promise<GuardOk | GuardErr> {
  const ctx = await getSchoolContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }
  if (ctx.role !== 'owner' && ctx.role !== 'admin') {
    return { ok: false, error: 'Hanya owner/admin' }
  }
  return {
    ok: true,
    userId: ctx.userId,
    schoolId: ctx.schoolId,
    role: ctx.role,
  }
}

async function requireOwner(): Promise<GuardOk | GuardErr> {
  const ctx = await getSchoolContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }
  if (ctx.role !== 'owner') {
    return { ok: false, error: 'Hanya owner' }
  }
  return {
    ok: true,
    userId: ctx.userId,
    schoolId: ctx.schoolId,
    role: ctx.role,
  }
}

// ============================================
// GENERATE INVITE TOKEN
// ============================================

export async function generateInviteTokenAction() {
  const guard = await requireOwnerOrAdmin()
  if (!guard.ok) return { ok: false, error: guard.error }

  try {
    // Cek kuota admin
    const school = await prisma.school.findUnique({
      where: { id: guard.schoolId },
      select: { adminSeatQuota: true },
    })
    if (!school) return { ok: false, error: 'Sekolah tidak ditemukan' }

    const currentMembers = await prisma.schoolMember.count({
      where: { schoolId: guard.schoolId },
    })

    // +1 karena owner gak masuk SchoolMember
    if (currentMembers + 2 > school.adminSeatQuota) {
      return {
        ok: false,
        error: `Kuota admin sudah penuh (${school.adminSeatQuota} seat)`,
      }
    }

    // Generate token
    const token = randomBytes(8).toString('hex')

    await prisma.school.update({
      where: { id: guard.schoolId },
      data: { inviteToken: token, inviteActive: true },
    })

    revalidatePath('/school/team')
    return { ok: true, token }
  } catch (err: any) {
    console.error('[generateInviteToken]', err?.message)
    return { ok: false, error: 'Gagal generate invite link' }
  }
}

// ============================================
// TOGGLE INVITE ACTIVE
// ============================================

export async function toggleInviteActiveAction(active: boolean) {
  const guard = await requireOwnerOrAdmin()
  if (!guard.ok) return { ok: false, error: guard.error }

  try {
    await prisma.school.update({
      where: { id: guard.schoolId },
      data: { inviteActive: active },
    })

    revalidatePath('/school/team')
    return { ok: true }
  } catch (err: any) {
    console.error('[toggleInviteActive]', err?.message)
    return { ok: false, error: 'Gagal ubah status' }
  }
}

// ============================================
// UPDATE MEMBER ROLE
// ============================================

const updateRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(['admin', 'member']),
})

export async function updateMemberRoleAction(input: unknown) {
  const guard = await requireOwner()
  if (!guard.ok) return { ok: false, error: guard.error }

  const parsed = updateRoleSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Data tidak valid' }
  }

  try {
    await prisma.schoolMember.updateMany({
      where: {
        id: parsed.data.memberId,
        schoolId: guard.schoolId,
      },
      data: { role: parsed.data.role },
    })

    revalidatePath('/school/team')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateMemberRole]', err?.message)
    return { ok: false, error: 'Gagal update role' }
  }
}

// ============================================
// REMOVE MEMBER
// ============================================

export async function removeMemberAction(memberId: string) {
  const guard = await requireOwnerOrAdmin()
  if (!guard.ok) return { ok: false, error: guard.error }

  try {
    const member = await prisma.schoolMember.findFirst({
      where: { id: memberId, schoolId: guard.schoolId },
      include: { school: { select: { ownerUserId: true } } },
    })

    if (!member) return { ok: false, error: 'Member tidak ditemukan' }

    if (member.userId === member.school.ownerUserId) {
      return { ok: false, error: 'Owner tidak bisa di-remove' }
    }

    if (guard.role === 'admin' && member.role === 'admin') {
      return { ok: false, error: 'Admin tidak bisa remove admin lain' }
    }

    await prisma.schoolMember.delete({ where: { id: memberId } })

    revalidatePath('/school/team')
    return { ok: true }
  } catch (err: any) {
    console.error('[removeMember]', err?.message)
    return { ok: false, error: 'Gagal remove member' }
  }
}

// ============================================
// ACCEPT INVITE
// ============================================

export async function acceptInviteAction(token: string) {
  const ctx = await getSchoolContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  // Cek user udah jadi member di sekolah ini
  const existing = await prisma.schoolMember.findFirst({
    where: { schoolId: ctx.schoolId, userId: ctx.userId },
  })
  if (existing) {
    return { ok: false, error: 'Kamu sudah jadi member sekolah ini' }
  }

  // Cari sekolah dari token
  const school = await prisma.school.findUnique({
    where: { inviteToken: token },
    select: {
      id: true,
      name: true,
      inviteActive: true,
      adminSeatQuota: true,
    },
  })

  if (!school) return { ok: false, error: 'Token tidak valid' }
  if (!school.inviteActive) return { ok: false, error: 'Invite tidak aktif' }

  const currentMembers = await prisma.schoolMember.count({
    where: { schoolId: school.id },
  })

  // Owner (1) + current members + 1 (new) harus <= quota
  if (currentMembers + 2 > school.adminSeatQuota) {
    return { ok: false, error: 'Kuota admin sudah penuh' }
  }

  try {
    await prisma.schoolMember.create({
      data: {
        schoolId: school.id,
        userId: ctx.userId,
        role: 'admin',
      },
    })

    revalidatePath('/school/team')
    revalidatePath('/school/dashboard')

    return { ok: true, schoolName: school.name }
  } catch (err: any) {
    console.error('[acceptInvite]', err?.message)
    if (err?.code === 'P2002') {
      return { ok: false, error: 'Kamu sudah jadi member sekolah ini' }
    }
    return { ok: false, error: 'Gagal join' }
  }
}