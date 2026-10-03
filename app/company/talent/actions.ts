// app/company/talent/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER
// ============================================

async function requireCompany() {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedCompany: { select: { id: true, name: true } },
    },
  })

  if (!user || user.role !== 'company' || !user.ownedCompany) {
    return { error: 'Hanya recruiter' as const }
  }

  return { user, company: user.ownedCompany }
}

// ============================================
// INVITE TO APPLY
// ============================================

const inviteSchema = z.object({
  studentId: z.string().uuid(),      // studentProfile.id
  jobId: z.string().uuid(),
  message: z.string().max(1000).optional(),
})

export async function inviteTalentToApplyAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = inviteSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Data tidak valid' }
  }

  const { studentId, jobId, message } = parsed.data

  // Verify job milik company ini
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      slug: true,
      companyId: true,
      status: true,
    },
  })

  if (!job) return { ok: false, error: 'Lowongan tidak ditemukan' }
  if (job.companyId !== ctx.company.id) {
    return { ok: false, error: 'Tidak berhak' }
  }
  if (job.status !== 'active') {
    return { ok: false, error: 'Lowongan tidak aktif' }
  }

  // Verify student exists
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      userId: true,
      user: { select: { fullName: true } },
    },
  })

  if (!student) return { ok: false, error: 'Kandidat tidak ditemukan' }

  // Cek sudah apply?
  const existingApplication = await prisma.application.findUnique({
    where: {
      jobId_studentId: { jobId, studentId },
    },
    select: { id: true },
  })

  if (existingApplication) {
    return { ok: false, error: 'Kandidat sudah apply ke lowongan ini' }
  }

  try {
    // Upsert invitation
    const invitation = await prisma.talentInvitation.upsert({
      where: {
        jobId_studentId: { jobId, studentId },
      },
      update: {
        message: message ?? null,
        status: 'pending',
        invitedBy: ctx.user.id,
        createdAt: new Date(),
      },
      create: {
        jobId,
        studentId,
        invitedBy: ctx.user.id,
        message: message ?? null,
        status: 'pending',
      },
      select: { id: true },
    })

    // Notif ke student
    try {
      await prisma.notification.create({
        data: {
          userId: student.userId,
          type: 'opportunity',
          title: 'Undangan Melamar Lowongan',
          body: `${ctx.company.name} mengundangmu untuk melamar posisi "${job.title}"`,
          actionUrl: `/student/jobs/${job.slug}`,
        },
      })
    } catch (notifErr) {
      console.error('[Notif] Failed:', notifErr)
    }

    revalidatePath('/company/talent')
    revalidatePath(`/company/talent/${studentId}`)
    revalidatePath('/student/notifications')

    return { ok: true, invitationId: invitation.id }
  } catch (err: any) {
    console.error('[inviteTalent] Error:', err?.message, err?.code)
    return {
      ok: false,
      error: `Gagal kirim undangan: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// SEND MESSAGE TO TALENT (auto-create conversation)
// ============================================

const messageSchema = z.object({
  studentUserId: z.string().uuid(),
  contextType: z.enum(['talent_profile', 'general']).optional(),
})

export async function contactTalentAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = messageSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  const { studentUserId, contextType } = parsed.data

  if (studentUserId === ctx.user.id) {
    return { ok: false, error: 'Tidak bisa chat dengan diri sendiri' }
  }

  try {
    // Cari existing conversation
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: ctx.user.id } } },
          { participants: { some: { userId: studentUserId } } },
        ],
        participants: {
          every: { userId: { in: [ctx.user.id, studentUserId] } },
        },
      },
      select: { id: true },
    })

    let conversationId: string

    if (existing) {
      conversationId = existing.id
    } else {
      const created = await prisma.conversation.create({
        data: {
          contextType: contextType ?? 'talent_profile',
          lastMessageAt: new Date(),
          participants: {
            create: [
              { userId: ctx.user.id },
              { userId: studentUserId },
            ],
          },
        },
        select: { id: true },
      })
      conversationId = created.id
    }

    revalidatePath('/company/messages')

    return { ok: true, conversationId }
  } catch (err: any) {
    console.error('[contactTalent] Error:', err?.message)
    return { ok: false, error: 'Gagal buka chat' }
  }
}