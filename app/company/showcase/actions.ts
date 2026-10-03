// app/company/showcase/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

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
// INVITE TO APPLY (reuse logic dari talent)
// ============================================

const inviteSchema = z.object({
  studentId: z.string().uuid(),
  jobId: z.string().uuid(),
  message: z.string().max(1000).optional(),
})

export async function inviteShowcaseTalentAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = inviteSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  const { studentId, jobId, message } = parsed.data

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, title: true, slug: true, companyId: true, status: true },
  })

  if (!job) return { ok: false, error: 'Lowongan tidak ditemukan' }
  if (job.companyId !== ctx.company.id) return { ok: false, error: 'Tidak berhak' }
  if (job.status !== 'active') return { ok: false, error: 'Lowongan tidak aktif' }

  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { id: true, userId: true, user: { select: { fullName: true } } },
  })

  if (!student) return { ok: false, error: 'Kandidat tidak ditemukan' }

  const existing = await prisma.application.findUnique({
    where: { jobId_studentId: { jobId, studentId } },
    select: { id: true },
  })

  if (existing) return { ok: false, error: 'Kandidat sudah apply' }

  try {
    await prisma.talentInvitation.upsert({
      where: { jobId_studentId: { jobId, studentId } },
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
    })

    await prisma.notification.create({
      data: {
        userId: student.userId,
        type: 'opportunity',
        title: 'Undangan Melamar Lowongan',
        body: `${ctx.company.name} mengundangmu untuk melamar posisi "${job.title}"`,
        actionUrl: `/student/jobs/${job.slug}`,
      },
    })

    revalidatePath('/company/showcase')
    revalidatePath('/student/notifications')

    return { ok: true }
  } catch (err: any) {
    console.error('[inviteShowcase] Error:', err?.message)
    return { ok: false, error: 'Gagal kirim undangan' }
  }
}

// ============================================
// CONTACT TALENT (auto-create chat)
// ============================================

const contactSchema = z.object({
  studentUserId: z.string().uuid(),
})

export async function contactShowcaseTalentAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  const { studentUserId } = parsed.data

  if (studentUserId === ctx.user.id) {
    return { ok: false, error: 'Tidak bisa chat dengan diri sendiri' }
  }

  try {
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: ctx.user.id } } },
          { participants: { some: { userId: studentUserId } } },
        ],
        participants: { every: { userId: { in: [ctx.user.id, studentUserId] } } },
      },
      select: { id: true },
    })

    let conversationId: string

    if (existing) {
      conversationId = existing.id
    } else {
      const created = await prisma.conversation.create({
        data: {
          contextType: 'showcase',
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
    console.error('[contactShowcase] Error:', err?.message)
    return { ok: false, error: 'Gagal buka chat' }
  }
}