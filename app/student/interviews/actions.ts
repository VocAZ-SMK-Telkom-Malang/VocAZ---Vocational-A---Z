// app/student/interviews/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

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
    return { error: 'Hanya siswa' as const }
  }

  return { user, studentProfileId: user.studentProfile.id }
}

// ============================================
// SUBMIT ANSWERS
// ============================================

const submitSchema = z.object({
  interviewId: z.string().uuid(),
  answers: z
    .array(
      z.object({
        questionIndex: z.number().int().min(0),
        answer: z.string().min(1).max(2000),
      })
    )
    .min(1),
})

export async function submitAiInterviewAnswersAction(input: unknown) {
  console.log('[submitAiInterview] Input:', input)

  const ctx = await requireStudent()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = submitSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid' }
  }

  const { interviewId, answers } = parsed.data

  // Verify ownership
  const interview = await prisma.aiInterview.findUnique({
    where: { id: interviewId },
    include: {
      application: {
        select: {
          id: true,
          studentId: true,
          jobId: true,
          job: {
            select: {
              title: true,
              company: { select: { ownerUserId: true, name: true } },
            },
          },
          student: {
            select: {
              userId: true,
              user: { select: { fullName: true } },
            },
          },
        },
      },
    },
  })

  if (!interview) {
    return { success: false, error: 'Interview tidak ditemukan' }
  }

  if (interview.application.studentId !== ctx.studentProfileId) {
    return { success: false, error: 'Tidak berhak' }
  }

  if (interview.status !== 'pending') {
    return { success: false, error: 'Interview tidak dalam status pending' }
  }

  // Cek expired
  if (interview.expiresAt && interview.expiresAt.getTime() < Date.now()) {
    await prisma.aiInterview.update({
      where: { id: interviewId },
      data: { status: 'expired' },
    })
    return { success: false, error: 'Interview sudah kedaluwarsa' }
  }

  try {
    // Update answers
    for (const ans of answers) {
      await prisma.aiInterviewAnswer.updateMany({
        where: {
          interviewId,
          questionIndex: ans.questionIndex,
        },
        data: {
          answer: ans.answer,
          answeredAt: new Date(),
        },
      })
    }

    // Update interview status
    await prisma.aiInterview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    })

    // Notif ke recruiter
    if (interview.application.job.company.ownerUserId) {
      try {
        await prisma.notification.create({
          data: {
            userId: interview.application.job.company.ownerUserId,
            type: 'application_update',
            title: 'AI Interview Selesai',
            body: `${interview.application.student.user.fullName ?? 'Kandidat'} telah menyelesaikan AI Interview untuk "${interview.application.job.title}"`,
            actionUrl: `/company/jobs/${interview.application.jobId}/applicants/${interview.application.id}`,
          },
        })
      } catch (notifErr) {
        console.error('[Notif] Failed:', notifErr)
      }
    }

    revalidatePath(`/student/interviews/${interviewId}`)
    revalidatePath('/student/interviews')
    revalidatePath(
      `/company/jobs/${interview.application.jobId}/applicants/${interview.application.id}`
    )

    console.log('[submitAiInterview] Success')
    return { success: true }
  } catch (err: any) {
    console.error('[submitAiInterview] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal submit: ${err?.message ?? 'Unknown'}`,
    }
  }
}