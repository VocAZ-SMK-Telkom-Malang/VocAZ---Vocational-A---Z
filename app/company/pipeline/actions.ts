// app/company/pipeline/actions.ts
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

  if (!user || user.role !== 'company') {
    return { error: 'Hanya recruiter' as const }
  }

  if (!user.ownedCompany) {
    return { error: 'Company tidak ditemukan' as const }
  }

  return { user, company: user.ownedCompany }
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

const updateStatusSchema = z.object({
  applicationId: z.string().uuid(),
  newStatus: z.enum(ALLOWED_STATUSES),
})

export async function updatePipelineStatusAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = updateStatusSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid' }
  }

  const { applicationId, newStatus } = parsed.data

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      status: true,
      jobId: true,
      job: { select: { companyId: true, title: true } },
      student: {
        select: {
          userId: true,
          user: { select: { fullName: true } },
        },
      },
    },
  })

  if (!app || app.job.companyId !== ctx.company.id) {
    return { success: false, error: 'Tidak ditemukan' }
  }

  if (app.status === newStatus) {
    return { success: true }
  }

  try {
    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status: newStatus },
      }),
      prisma.applicationStatusHistory.create({
        data: {
          applicationId,
          status: newStatus,
          notes: `Status: ${app.status} → ${newStatus}`,
          changedBy: ctx.user.id,
        },
      }),
    ])

    try {
      await prisma.notification.create({
        data: {
          userId: app.student.userId,
          type: 'application_update',
          title: 'Status Lamaran Diperbarui',
          body: `Lamaran untuk "${app.job.title}" sekarang: ${newStatus}`,
          actionUrl: `/student/applications/${applicationId}`,
        },
      })
    } catch (notifErr) {
      console.error('[Notif] Failed:', notifErr)
    }

    revalidatePath(`/company/pipeline/${app.jobId}`)
    revalidatePath(`/company/jobs/${app.jobId}/applicants`)
    revalidatePath(`/company/jobs/${app.jobId}/applicants/${applicationId}`)
    revalidatePath('/company/dashboard')
    revalidatePath('/student/applications')

    return { success: true }
  } catch (err: any) {
    console.error('[updatePipelineStatus] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal update: ${err?.message ?? 'Unknown'}`,
    }
  }
}

// ============================================
// BULK ACTION
// ============================================

const bulkSchema = z.object({
  applicationIds: z.array(z.string().uuid()).min(1).max(100),
  newStatus: z.enum(ALLOWED_STATUSES),
})

export async function bulkUpdateStatusAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { success: false, error: ctx.error }

  const parsed = bulkSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Data tidak valid' }
  }

  const { applicationIds, newStatus } = parsed.data

  const apps = await prisma.application.findMany({
    where: {
      id: { in: applicationIds },
      job: { companyId: ctx.company.id },
    },
    select: {
      id: true,
      jobId: true,
      student: { select: { userId: true } },
      job: { select: { title: true } },
    },
  })

  if (apps.length === 0) {
    return { success: false, error: 'Tidak ada pelamar ditemukan' }
  }

  try {
    await prisma.$transaction([
      prisma.application.updateMany({
        where: { id: { in: apps.map((a) => a.id) } },
        data: { status: newStatus },
      }),
      prisma.applicationStatusHistory.createMany({
        data: apps.map((a) => ({
          applicationId: a.id,
          status: newStatus,
          notes: `Bulk update ke ${newStatus}`,
          changedBy: ctx.user.id,
        })),
      }),
    ])

    try {
      await prisma.notification.createMany({
        data: apps.map((a) => ({
          userId: a.student.userId,
          type: 'application_update' as const,
          title: 'Status Lamaran Diperbarui',
          body: `Lamaran untuk "${a.job.title}" sekarang: ${newStatus}`,
          actionUrl: `/student/applications/${a.id}`,
        })),
      })
    } catch (notifErr) {
      console.error('[Notif Bulk] Failed:', notifErr)
    }

    revalidatePath(`/company/pipeline/${apps[0].jobId}`)
    revalidatePath('/company/dashboard')
    revalidatePath('/student/applications')

    return { success: true, count: apps.length }
  } catch (err: any) {
    console.error('[bulkUpdateStatus] Error:', err?.message, err?.code)
    return {
      success: false,
      error: `Gagal bulk update: ${err?.message ?? 'Unknown'}`,
    }
  }
}