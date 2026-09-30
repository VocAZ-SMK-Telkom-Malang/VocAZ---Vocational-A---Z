// app/actions/applications.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============================================
// WITHDRAW APPLICATION
// ============================================

export async function withdrawApplication(applicationId: string) {
  try {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { id: true, status: true },
    })

    if (!app) {
      return { success: false, error: 'Lamaran tidak ditemukan' }
    }

    if (!['submitted', 'reviewed', 'shortlisted'].includes(app.status)) {
      return { success: false, error: 'Lamaran sudah tidak bisa ditarik' }
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'withdrawn',
        nextStep: null,
      },
    })

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId,
        status: 'withdrawn',
        notes: 'Ditarik oleh kandidat',
      },
    })

    revalidatePath('/student/applications')
    return { success: true }
  } catch (error) {
    console.error('Withdraw error:', error)
    return { success: false, error: 'Gagal menarik lamaran' }
  }
}