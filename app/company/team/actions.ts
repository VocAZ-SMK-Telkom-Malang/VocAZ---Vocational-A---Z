// app/company/team/actions.ts
'use server'

import { z } from 'zod'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { sendTeamInviteEmail } from '@/lib/email/send'
import { APP_URL } from '@/lib/email/client'

// ============================================
// HELPER
// ============================================

async function requireCompanyAdmin() {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      fullName: true,
      role: true,
      ownedCompany: { select: { id: true, name: true } },
      companyMembers: {
        select: {
          companyId: true,
          role: true,
        },
      },
    },
  })

  if (!user || user.role !== 'company') {
    return { error: 'Hanya recruiter' as const }
  }

  // Owner atau admin bisa manage team
  const isOwner = !!user.ownedCompany
  const isAdmin = user.companyMembers.some(
    (m) => m.role === 'owner' || m.role === 'admin'
  )

  if (!isOwner && !isAdmin) {
    return { error: 'Hanya owner/admin yang bisa manage team' as const }
  }

  const companyId = user.ownedCompany?.id ?? user.companyMembers[0]?.companyId
  if (!companyId) return { error: 'Company tidak ditemukan' as const }

  return { user, companyId, isOwner }
}

// ============================================
// HELPER: BUILD & SEND EMAIL
// ============================================

async function sendInviteNotification(params: {
  email: string
  token: string
  role: string
  expiresAt: Date
  companyId: string
  inviterId: string
  inviterName: string
}) {
  try {
    const [company, inviter] = await Promise.all([
      prisma.company.findUnique({
        where: { id: params.companyId },
        select: { name: true },
      }),
      prisma.user.findUnique({
        where: { id: params.inviterId },
        select: { fullName: true },
      }),
    ])

    const inviteUrl = `${APP_URL}/company/join/${params.token}`
    const expiresAtLabel = params.expiresAt.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const result = await sendTeamInviteEmail({
      to: params.email,
      companyName: company?.name ?? 'Perusahaan',
      inviterName: inviter?.fullName ?? params.inviterName,
      role: params.role,
      inviteUrl,
      expiresAt: expiresAtLabel,
    })

    if (!result.ok) {
      console.error('[sendInvite] Email failed:', result.error)
    }

    return result
  } catch (err: any) {
    console.error('[sendInvite] Error:', err?.message)
    return { ok: false, error: err?.message }
  }
}

// ============================================
// INVITE MEMBER
// ============================================

const inviteSchema = z.object({
  email: z.string().email('Email tidak valid').max(150),
  role: z.enum(['admin', 'recruiter', 'viewer']),
})

export async function inviteTeamMemberAction(input: unknown) {
  const ctx = await requireCompanyAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = inviteSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const { email, role } = parsed.data
  const normalizedEmail = email.toLowerCase().trim()

  // Cek sudah member?
  const existingMember = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      companyMembers: {
        where: { companyId: ctx.companyId },
        select: { id: true },
      },
    },
  })

  if (existingMember?.companyMembers.length) {
    return { ok: false, error: 'User sudah menjadi anggota team' }
  }

  // Cek sudah diundang?
  const existingInvite = await prisma.companyInvitation.findUnique({
    where: {
      companyId_email: {
        companyId: ctx.companyId,
        email: normalizedEmail,
      },
    },
  })

  if (existingInvite && existingInvite.status === 'pending') {
    return { ok: false, error: 'Email sudah diundang' }
  }

  try {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 hari

    const invitation = await prisma.companyInvitation.upsert({
      where: {
        companyId_email: {
          companyId: ctx.companyId,
          email: normalizedEmail,
        },
      },
      update: {
        role,
        token,
        status: 'pending',
        invitedBy: ctx.user.id,
        expiresAt,
        acceptedAt: null,
        createdAt: new Date(),
      },
      create: {
        companyId: ctx.companyId,
        email: normalizedEmail,
        role,
        token,
        invitedBy: ctx.user.id,
        status: 'pending',
        expiresAt,
      },
      select: { id: true, token: true, expiresAt: true },
    })

    // ✅ Kirim email otomatis
    sendInviteNotification({
      email: normalizedEmail,
      token: invitation.token,
      role,
      expiresAt: invitation.expiresAt,
      companyId: ctx.companyId,
      inviterId: ctx.user.id,
      inviterName: ctx.user.fullName ?? 'Recruiter',
    }).catch((err) => {
      console.error('[inviteMember] Background email error:', err)
    })

    revalidatePath('/company/team')

    return { ok: true, inviteId: invitation.id }
  } catch (err: any) {
    console.error('[inviteMember] Error:', err?.message)
    return { ok: false, error: 'Gagal kirim undangan' }
  }
}

// ============================================
// CHANGE ROLE
// ============================================

const changeRoleSchema = z.object({
  memberId: z.string().uuid(),
  newRole: z.enum(['admin', 'recruiter', 'viewer']),
})

export async function changeMemberRoleAction(input: unknown) {
  const ctx = await requireCompanyAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = changeRoleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  const { memberId, newRole } = parsed.data

  const member = await prisma.companyMember.findUnique({
    where: { id: memberId },
    select: { id: true, companyId: true, userId: true, role: true },
  })

  if (!member || member.companyId !== ctx.companyId) {
    return { ok: false, error: 'Tidak berhak' }
  }

  if (member.role === 'owner') {
    return { ok: false, error: 'Tidak bisa ubah role owner' }
  }

  try {
    await prisma.companyMember.update({
      where: { id: memberId },
      data: { role: newRole as any },
    })

    revalidatePath('/company/team')
    return { ok: true }
  } catch (err: any) {
    console.error('[changeRole] Error:', err?.message)
    return { ok: false, error: 'Gagal ubah role' }
  }
}

// ============================================
// REMOVE MEMBER
// ============================================

export async function removeTeamMemberAction(memberId: string) {
  const ctx = await requireCompanyAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const member = await prisma.companyMember.findUnique({
    where: { id: memberId },
    select: { id: true, companyId: true, userId: true, role: true },
  })

  if (!member || member.companyId !== ctx.companyId) {
    return { ok: false, error: 'Tidak berhak' }
  }

  if (member.role === 'owner') {
    return { ok: false, error: 'Tidak bisa hapus owner' }
  }

  if (member.userId === ctx.user.id) {
    return { ok: false, error: 'Tidak bisa hapus diri sendiri' }
  }

  try {
    await prisma.companyMember.delete({ where: { id: memberId } })
    revalidatePath('/company/team')
    return { ok: true }
  } catch (err: any) {
    console.error('[removeMember] Error:', err?.message)
    return { ok: false, error: 'Gagal hapus' }
  }
}

// ============================================
// CANCEL INVITATION
// ============================================

export async function cancelInvitationAction(invitationId: string) {
  const ctx = await requireCompanyAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const invite = await prisma.companyInvitation.findUnique({
    where: { id: invitationId },
    select: { companyId: true },
  })

  if (!invite || invite.companyId !== ctx.companyId) {
    return { ok: false, error: 'Tidak berhak' }
  }

  try {
    await prisma.companyInvitation.update({
      where: { id: invitationId },
      data: { status: 'revoked' },
    })

    revalidatePath('/company/team')
    return { ok: true }
  } catch (err: any) {
    console.error('[cancelInvite] Error:', err?.message)
    return { ok: false, error: 'Gagal batalkan undangan' }
  }
}

// ============================================
// RESEND INVITATION
// ============================================

export async function resendInvitationAction(invitationId: string) {
  const ctx = await requireCompanyAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const invite = await prisma.companyInvitation.findUnique({
    where: { id: invitationId },
    select: {
      companyId: true,
      email: true,
      role: true,
    },
  })

  if (!invite || invite.companyId !== ctx.companyId) {
    return { ok: false, error: 'Tidak berhak' }
  }

  try {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await prisma.companyInvitation.update({
      where: { id: invitationId },
      data: {
        token,
        expiresAt,
        status: 'pending',
        createdAt: new Date(),
      },
    })

    // ✅ Kirim ulang email
    sendInviteNotification({
      email: invite.email,
      token,
      role: invite.role,
      expiresAt,
      companyId: ctx.companyId,
      inviterId: ctx.user.id,
      inviterName: ctx.user.fullName ?? 'Recruiter',
    }).catch((err) => {
      console.error('[resendInvite] Background email error:', err)
    })

    revalidatePath('/company/team')
    return { ok: true }
  } catch (err: any) {
    console.error('[resendInvite] Error:', err?.message)
    return { ok: false, error: 'Gagal kirim ulang' }
  }
}