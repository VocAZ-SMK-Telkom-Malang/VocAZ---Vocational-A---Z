// app/actions/saved.ts
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============================================
// UNSAVE JOB
// ============================================

export async function unsaveJob(savedJobId: string) {
  try {
    await prisma.savedJob.delete({ where: { id: savedJobId } })
    revalidatePath('/student/saved')
    return { success: true }
  } catch (error) {
    console.error('Unsave job error:', error)
    return { success: false, error: 'Gagal menghapus lowongan' }
  }
}

// ============================================
// UNSAVE COMPANY
// ============================================

export async function unsaveCompany(savedCompanyId: string) {
  try {
    await prisma.savedCompany.delete({ where: { id: savedCompanyId } })
    revalidatePath('/student/saved')
    return { success: true }
  } catch (error) {
    console.error('Unsave company error:', error)
    return { success: false, error: 'Gagal menghapus perusahaan' }
  }
}

// ============================================
// CLEAR ALL SAVED
// ============================================

export async function clearAllSaved(studentUserId: string, type: 'jobs' | 'companies') {
  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: studentUserId },
      select: { id: true },
    })

    if (!studentProfile) {
      return { success: false, error: 'Student tidak ditemukan' }
    }

    if (type === 'jobs') {
      await prisma.savedJob.deleteMany({ where: { studentId: studentProfile.id } })
    } else {
      await prisma.savedCompany.deleteMany({ where: { studentId: studentProfile.id } })
    }

    revalidatePath('/student/saved')
    return { success: true }
  } catch (error) {
    console.error('Clear all error:', error)
    return { success: false, error: 'Gagal menghapus semua' }
  }
}