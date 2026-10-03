// app/student/jobs/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'
import { recalculateApplicationMatch } from '@/lib/matching/recalculate'

// ============================================
// HELPER
// ============================================

async function requireStudent() {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      studentProfile: { select: { id: true } },
    },
  })

  if (!user || user.role !== 'student' || !user.studentProfile) {
    return { error: 'Hanya siswa yang bisa melakukan aksi ini' as const }
  }

  return { user, studentProfileId: user.studentProfile.id }
}

// ============================================
// APPLY TO JOB (dengan screening answers)
// ============================================

const screeningAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answerText: z.string().optional().nullable(),
  answerBool: z.boolean().optional().nullable(),
  answerNumber: z.number().optional().nullable(),
  answerChoice: z.string().optional().nullable(),
})

const applySchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z
    .string()
    .min(20, 'Surat lamaran minimal 20 karakter')
    .max(3000),
  resumeUrl: z.string().url().nullable().optional(),
  resumeKey: z.string().nullable().optional(),
  saveAsDefault: z.boolean().optional(),
  screeningAnswers: z.array(screeningAnswerSchema).optional().default([]),
})

export async function applyToJobAction(input: unknown) {
  const ctx = await requireStudent()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = applySchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const data = parsed.data

  const job = await prisma.job.findUnique({
    where: { id: data.jobId },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      deletedAt: true,
      expiredAt: true,
      companyId: true,
      screeningQuestions: {
        select: {
          id: true,
          question: true,
          isRequired: true,
        },
      },
    },
  })

  if (!job || job.deletedAt) {
    return { success: false, error: 'Lowongan tidak ditemukan' }
  }

  if (job.status !== 'active') {
    return { success: false, error: 'Lowongan sudah tidak aktif' }
  }

  if (job.expiredAt && job.expiredAt.getTime() < Date.now()) {
    return { success: false, error: 'Lowongan sudah expired' }
  }

  const existing = await prisma.application.findUnique({
    where: {
      jobId_studentId: {
        jobId: data.jobId,
        studentId: ctx.studentProfileId,
      },
    },
    select: { id: true },
  })

  if (existing) {
    return { success: false, error: 'Kamu sudah melamar lowongan ini' }
  }

  // ✅ Validate screening answers
  const requiredQuestionIds = job.screeningQuestions
    .filter((q) => q.isRequired)
    .map((q) => q.id)

  const answeredQuestionIds = data.screeningAnswers.map((a) => a.questionId)

  const missingRequired = requiredQuestionIds.filter(
    (id) => !answeredQuestionIds.includes(id)
  )

  if (missingRequired.length > 0) {
    return {
      success: false,
      error: `Kamu belum menjawab ${missingRequired.length} pertanyaan wajib`,
    }
  }

  try {
    const application = await prisma.application.create({
      data: {
        jobId: data.jobId,
        studentId: ctx.studentProfileId,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl ?? null,
        resumeKey: data.resumeKey ?? null,
        status: 'submitted',

        // ✅ Screening answers
        screeningAnswers:
          data.screeningAnswers.length > 0
            ? {
                create: data.screeningAnswers.map((ans) => ({
                  questionId: ans.questionId,
                  answerText: ans.answerText ?? null,
                  answerBool: ans.answerBool ?? null,
                  answerNumber: ans.answerNumber ?? null,
                  answerChoice: ans.answerChoice ?? null,
                })),
              }
            : undefined,
      },
      select: { id: true },
    })

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        status: 'submitted',
        notes: 'Lamaran dikirim',
        changedBy: ctx.user.id,
      },
    })

    // ✅ Hitung match score
    await recalculateApplicationMatch(application.id)

    await prisma.job.update({
      where: { id: data.jobId },
      data: { applicants: { increment: 1 } },
    })

    if (data.saveAsDefault && data.resumeUrl && data.resumeKey) {
      await prisma.studentProfile.update({
        where: { id: ctx.studentProfileId },
        data: {
          cvUrl: data.resumeUrl,
          cvKey: data.resumeKey,
          cvUpdatedAt: new Date(),
        },
      })
    }

    // Notif ke recruiter
    const [company, student] = await Promise.all([
      prisma.company.findUnique({
        where: { id: job.companyId },
        select: { ownerUserId: true },
      }),
      prisma.studentProfile.findUnique({
        where: { id: ctx.studentProfileId },
        select: { user: { select: { fullName: true } } },
      }),
    ])

    if (company?.ownerUserId) {
      await prisma.notification.create({
        data: {
          userId: company.ownerUserId,
          type: 'application_update',
          title: 'Pelamar Baru',
          body: `${student?.user.fullName ?? 'Siswa'} melamar posisi "${job.title}"`,
          actionUrl: `/company/jobs/${job.id}`,
        },
      })
    }

    revalidatePath(`/student/jobs/${job.slug}`)
    revalidatePath('/student/applications')
    revalidatePath('/student/dashboard')
    revalidatePath('/company/jobs')
    revalidatePath(`/company/jobs/${job.id}`)

    return { success: true, applicationId: application.id }
  } catch (err: any) {
    console.error('Apply job error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal mengirim lamaran: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// WITHDRAW
// ============================================

export async function withdrawApplicationAction(applicationId: string) {
  const ctx = await requireStudent()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true, studentId: true, jobId: true, status: true },
  })

  if (!app || app.studentId !== ctx.studentProfileId) {
    return { success: false, error: 'Lamaran tidak ditemukan' }
  }

  if (['hired', 'withdrawn', 'rejected'].includes(app.status)) {
    return { success: false, error: 'Tidak bisa withdraw pada status ini' }
  }

  await prisma.$transaction([
    prisma.application.update({
      where: { id: applicationId },
      data: { status: 'withdrawn' },
    }),
    prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: 'withdrawn',
        notes: 'Dicabut oleh pelamar',
        changedBy: ctx.user.id,
      },
    }),
    prisma.job.update({
      where: { id: app.jobId },
      data: { applicants: { decrement: 1 } },
    }),
  ])

  revalidatePath('/student/applications')
  revalidatePath(`/student/applications/${applicationId}`)

  return { success: true }
}

// ============================================
// TOGGLE SAVE
// ============================================

export async function toggleSaveJobAction(jobId: string) {
  const ctx = await requireStudent()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const existing = await prisma.savedJob.findUnique({
    where: {
      studentId_jobId: {
        studentId: ctx.studentProfileId,
        jobId,
      },
    },
    select: { id: true },
  })

  if (existing) {
    await prisma.savedJob.delete({ where: { id: existing.id } })
    revalidatePath('/student/jobs')
    revalidatePath('/student/saved')
    return { success: true, saved: false }
  } else {
    await prisma.savedJob.create({
      data: { studentId: ctx.studentProfileId, jobId },
    })
    revalidatePath('/student/jobs')
    revalidatePath('/student/saved')
    return { success: true, saved: true }
  }
}