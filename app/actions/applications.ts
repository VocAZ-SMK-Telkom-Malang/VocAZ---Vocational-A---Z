// app/actions/applications.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

export async function withdrawApplication(applicationId: string) {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      studentProfile: { select: { id: true } },
    },
  })

  if (!user || user.role !== 'student' || !user.studentProfile) {
    return { success: false, error: 'Hanya siswa yang bisa withdraw' }
  }

  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      studentId: true,
      jobId: true,
      status: true,
    },
  })

  if (!app || app.studentId !== user.studentProfile.id) {
    return { success: false, error: 'Lamaran tidak ditemukan' }
  }

  if (['hired', 'withdrawn', 'rejected'].includes(app.status)) {
    return {
      success: false,
      error: 'Tidak bisa withdraw pada status ini',
    }
  }

  try {
    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: { status: 'withdrawn' },
      }),
      prisma.applicationStatusHistory.create({
        data: {
          applicationId,
          status: 'withdrawn',
          notes: 'Ditarik oleh kandidat',
          changedBy: user.id,
        },
      }),
      prisma.job.update({
        where: { id: app.jobId },
        data: { applicants: { decrement: 1 } },
      }),
    ])

    revalidatePath('/student/applications')
    revalidatePath(`/student/applications/${applicationId}`)
    revalidatePath('/student/dashboard')

    return { success: true }
  } catch (err) {
    console.error('Withdraw error:', err)
    return { success: false, error: 'Gagal menarik lamaran' }
  }
}