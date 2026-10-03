// app/company/jobs/[id]/applicants/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { DEFAULT_AI_INTERVIEW_QUESTIONS, AI_INTERVIEW_EXPIRY_DAYS } from '@/lib/ai-interview/constants'

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

  if (!user || user.role !== 'company') {
    return { error: 'Hanya recruiter' as const }
  }

  if (!user.ownedCompany) {
    return { error: 'Company tidak ditemukan' as const }
  }

  return { user, company: user.ownedCompany }
}

async function verifyApplicationOwnership(
  applicationId: string,
  companyId: string
) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      jobId: true,
      studentId: true,
      status: true,
      job: { select: { companyId: true, title: true } },
      student: {
        select: {
          userId: true,
          user: { select: { fullName: true } },
        },
      },
    },
  })

  if (!app) return { error: 'Lamaran tidak ditemukan' as const }
  if (app.job.companyId !== companyId) return { error: 'Tidak berhak' as const }

  return { app }
}

// ============================================
// UPDATE STATUS
// ============================================

const ALLOWED_STATUSES = [
  'submitted',
  'reviewed',
  'shortlisted',
  'interview',
  'offered',
  'hired',
  'rejected',
] as const

const statusUpdateSchema = z.object({
  applicationId: z.string().uuid(),
  newStatus: z.enum(ALLOWED_STATUSES),
  note: z.string().max(500).optional(),
})

export async function updateApplicantStatusAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = statusUpdateSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const data = parsed.data

  const ownership = await verifyApplicationOwnership(
    data.applicationId,
    ctx.company.id
  )
  if ('error' in ownership) {
    return { success: false, error: ownership.error }
  }

  if (ownership.app.status === data.newStatus) {
    return { success: true }
  }

  try {
    // ✅ TANPA reviewedAt
    await prisma.$transaction([
      prisma.application.update({
        where: { id: data.applicationId },
        data: {
          status: data.newStatus,
        },
      }),
      prisma.applicationStatusHistory.create({
        data: {
          applicationId: data.applicationId,
          status: data.newStatus,
          notes: data.note ?? `Status diubah ke ${data.newStatus}`,
          changedBy: ctx.user.id,
        },
      }),
    ])

    // Notif (fire & forget)
    try {
      await prisma.notification.create({
        data: {
          userId: ownership.app.student.userId,
          type: 'application_update',
          title: 'Status Lamaran Diperbarui',
          body: `Lamaran kamu untuk "${ownership.app.job.title}" sekarang: ${data.newStatus}`,
          actionUrl: `/student/applications/${data.applicationId}`,
        },
      })
    } catch (notifErr) {
      console.error('[Notif] Failed:', notifErr)
    }

    revalidatePath(`/company/jobs/${ownership.app.jobId}/applicants`)
    revalidatePath(
      `/company/jobs/${ownership.app.jobId}/applicants/${data.applicationId}`
    )
    revalidatePath(`/company/pipeline/${ownership.app.jobId}`)
    revalidatePath('/company/dashboard')
    revalidatePath('/student/applications')

    return { success: true }
  } catch (err: any) {
    console.error('[updateApplicantStatus] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal update: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// SET INTERVIEW
// ============================================

const interviewSchema = z.object({
  applicationId: z.string().uuid(),
  interviewDate: z.string().datetime(),
  nextStep: z.string().max(500).optional(),
  recruiterName: z.string().max(150).optional(),
})

export async function setInterviewAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = interviewSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const data = parsed.data
  const ownership = await verifyApplicationOwnership(
    data.applicationId,
    ctx.company.id
  )
  if ('error' in ownership) return { success: false, error: ownership.error }

  try {
    await prisma.application.update({
      where: { id: data.applicationId },
      data: {
        interviewDate: new Date(data.interviewDate),
        nextStep: data.nextStep ?? null,
        recruiterName: data.recruiterName ?? null,
      },
    })

    if (!['interview', 'offered', 'hired'].includes(ownership.app.status)) {
      await prisma.$transaction([
        prisma.application.update({
          where: { id: data.applicationId },
          data: { status: 'interview' },
        }),
        prisma.applicationStatusHistory.create({
          data: {
            applicationId: data.applicationId,
            status: 'interview',
            notes: `Interview dijadwalkan: ${new Date(data.interviewDate).toLocaleString('id-ID')}`,
            changedBy: ctx.user.id,
          },
        }),
      ])
    }

    try {
      await prisma.notification.create({
        data: {
          userId: ownership.app.student.userId,
          type: 'application_update',
          title: 'Interview Dijadwalkan',
          body: `Interview untuk "${ownership.app.job.title}" dijadwalkan pada ${new Date(data.interviewDate).toLocaleString('id-ID')}`,
          actionUrl: `/student/applications/${data.applicationId}`,
        },
      })
    } catch (notifErr) {
      console.error('[Notif] Failed:', notifErr)
    }

    revalidatePath(`/company/jobs/${ownership.app.jobId}/applicants`)
    revalidatePath(
      `/company/jobs/${ownership.app.jobId}/applicants/${data.applicationId}`
    )
    revalidatePath(`/company/pipeline/${ownership.app.jobId}`)
    revalidatePath('/student/applications')

    return { success: true }
  } catch (err: any) {
    console.error('[setInterview] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal set interview: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// UPDATE NOTES
// ============================================

const notesSchema = z.object({
  applicationId: z.string().uuid(),
  notes: z.string().max(3000),
})

export async function updateNotesAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = notesSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const data = parsed.data
  const ownership = await verifyApplicationOwnership(
    data.applicationId,
    ctx.company.id
  )
  if ('error' in ownership) return { success: false, error: ownership.error }

  try {
    await prisma.application.update({
      where: { id: data.applicationId },
      data: { notes: data.notes || null },
    })

    revalidatePath(
      `/company/jobs/${ownership.app.jobId}/applicants/${data.applicationId}`
    )

    return { success: true }
  } catch (err: any) {
    console.error('[updateNotes] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal simpan catatan: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// REJECT
// ============================================

const rejectSchema = z.object({
  applicationId: z.string().uuid(),
  reason: z.string().max(500).optional(),
})

export async function rejectApplicantAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = rejectSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const data = parsed.data
  const ownership = await verifyApplicationOwnership(
    data.applicationId,
    ctx.company.id
  )
  if ('error' in ownership) return { success: false, error: ownership.error }

  try {
    await prisma.$transaction([
      prisma.application.update({
        where: { id: data.applicationId },
        data: { status: 'rejected' },
      }),
      prisma.applicationStatusHistory.create({
        data: {
          applicationId: data.applicationId,
          status: 'rejected',
          notes: data.reason ?? 'Tidak lolos seleksi',
          changedBy: ctx.user.id,
        },
      }),
    ])

    try {
      await prisma.notification.create({
        data: {
          userId: ownership.app.student.userId,
          type: 'application_update',
          title: 'Lamaran Tidak Lolos',
          body: `Lamaran kamu untuk "${ownership.app.job.title}" di ${ctx.company.name} tidak lolos seleksi.`,
          actionUrl: `/student/applications/${data.applicationId}`,
        },
      })
    } catch (notifErr) {
      console.error('[Notif] Failed:', notifErr)
    }

    revalidatePath(`/company/jobs/${ownership.app.jobId}/applicants`)
    revalidatePath(
      `/company/jobs/${ownership.app.jobId}/applicants/${data.applicationId}`
    )
    revalidatePath('/student/applications')

    return { success: true }
  } catch (err: any) {
    console.error('[rejectApplicant] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal reject: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// HIRE
// ============================================

export async function hireApplicantAction(applicationId: string) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const ownership = await verifyApplicationOwnership(
    applicationId,
    ctx.company.id
  )
  if ('error' in ownership) return { success: false, error: ownership.error }

  try {
    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status: 'hired' },
      }),
      prisma.applicationStatusHistory.create({
        data: {
          applicationId,
          status: 'hired',
          notes: 'Kandidat diterima',
          changedBy: ctx.user.id,
        },
      }),
    ])

    try {
      await prisma.notification.create({
        data: {
          userId: ownership.app.student.userId,
          type: 'application_update',
          title: '🎉 Selamat! Kamu Diterima',
          body: `Kamu diterima untuk posisi "${ownership.app.job.title}" di ${ctx.company.name}.`,
          actionUrl: `/student/applications/${applicationId}`,
        },
      })
    } catch (notifErr) {
      console.error('[Notif] Failed:', notifErr)
    }

    revalidatePath(`/company/jobs/${ownership.app.jobId}/applicants`)
    revalidatePath(
      `/company/jobs/${ownership.app.jobId}/applicants/${applicationId}`
    )
    revalidatePath('/company/pipeline')
    revalidatePath('/student/applications')

    return { success: true }
  } catch (err: any) {
    console.error('[hireApplicant] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal hire: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// AI INTERVIEW — INVITE
// ============================================

const inviteAiSchema = z.object({
  applicationId: z.string().uuid(),
  customQuestions: z.array(z.string().min(5).max(500)).optional().default([]),
})

export async function inviteAiInterviewAction(input: unknown) {
  console.log('[inviteAiInterview] Input:', input)

  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = inviteAiSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid' }
  }

  const { applicationId, customQuestions } = parsed.data

  const ownership = await verifyApplicationOwnership(
    applicationId,
    ctx.company.id
  )
  if ('error' in ownership) return { success: false, error: ownership.error }

  // Cek sudah ada AI interview?
  const existing = await prisma.aiInterview.findUnique({
    where: { applicationId },
  })

  if (existing && existing.status === 'pending') {
    return { success: false, error: 'Kandidat sudah diundang AI Interview' }
  }

  // Combine default + custom questions
  const allQuestions = [
    ...DEFAULT_AI_INTERVIEW_QUESTIONS,
    ...customQuestions,
  ]

  const expiresAt = new Date(
    Date.now() + AI_INTERVIEW_EXPIRY_DAYS * 24 * 60 * 60 * 1000
  )

  try {
    const interview = await prisma.aiInterview.upsert({
      where: { applicationId },
      update: {
        status: 'pending',
        invitedBy: ctx.user.id,
        invitedAt: new Date(),
        completedAt: null,
        expiresAt,
        questions: allQuestions,
      },
      create: {
        applicationId,
        invitedBy: ctx.user.id,
        status: 'pending',
        expiresAt,
        questions: allQuestions,
      },
      select: { id: true },
    })

    // Hapus jawaban lama (kalau re-invite)
    await prisma.aiInterviewAnswer.deleteMany({
      where: { interviewId: interview.id },
    })

    // Buat placeholder answers untuk setiap pertanyaan
    await prisma.aiInterviewAnswer.createMany({
      data: allQuestions.map((q, idx) => ({
        interviewId: interview.id,
        questionIndex: idx,
        question: q,
        answer: null,
      })),
    })

    // Notif ke student
    try {
      await prisma.notification.create({
        data: {
          userId: ownership.app.student.userId,
          type: 'application_update',
          title: 'Undangan AI Interview',
          body: `${ctx.company.name} mengundangmu untuk AI Interview untuk posisi "${ownership.app.job.title}"`,
          actionUrl: `/student/interviews/${interview.id}`,
        },
      })
    } catch (notifErr) {
      console.error('[Notif] Failed:', notifErr)
    }

    revalidatePath(
      `/company/jobs/${ownership.app.jobId}/applicants/${applicationId}`
    )
    revalidatePath('/student/interviews')

    console.log('[inviteAiInterview] Success')
    return { success: true, interviewId: interview.id }
  } catch (err: any) {
    console.error('[inviteAiInterview] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal invite: ${err?.message ?? 'Unknown'}`,
    }
  }
}
