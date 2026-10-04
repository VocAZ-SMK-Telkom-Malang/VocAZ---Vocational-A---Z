// app/certification/verifications/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCertContext } from '@/lib/queries/cert-context'
import { revalidatePath } from 'next/cache'

async function requireVerifier() {
  const ctx = await getCertContext()
  if (!ctx) return { error: 'Unauthorized' as const }
  return ctx
}

// ============================================
// APPROVE / REJECT SINGLE
// ============================================

const reviewSchema = z.object({
  requestId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
  notes: z.string().max(500).nullable().optional(),
})

export async function reviewVerificationAction(input: unknown) {
  const ctx = await requireVerifier()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const { requestId, action, notes } = parsed.data

  const request = await prisma.verificationRequest.findFirst({
    where: { id: requestId, institutionId: ctx.institutionId },
    include: {
      certificate: {
        select: {
          id: true,
          student: { select: { userId: true } },
        },
      },
    },
  })

  if (!request) return { ok: false, error: 'Pengajuan tidak ditemukan' }

  if (request.status === 'verified' || request.status === 'rejected') {
    return { ok: false, error: 'Pengajuan ini sudah direview' }
  }

  const newStatus = action === 'approve' ? 'verified' : 'rejected'
  const certificateStatus = action === 'approve' ? 'verified' : 'rejected'
  const now = new Date()

  try {
    await prisma.$transaction([
      prisma.verificationRequest.update({
        where: { id: requestId },
        data: {
          status: newStatus,
          reviewedBy: ctx.userId,
          reviewedAt: now,
          notes: notes ?? null,
        },
      }),
      prisma.certificate.update({
        where: { id: request.certificate.id },
        data: {
          verificationStatus: certificateStatus,
          verifiedAt: action === 'approve' ? now : null,
        },
      }),
      // Notifikasi ke student
      prisma.notification.create({
        data: {
          userId: request.certificate.student.userId,
          type: 'verification',
          title:
            action === 'approve'
              ? '🎉 Sertifikat Kamu Terverifikasi!'
              : '❌ Sertifikat Kamu Ditolak',
          body:
            action === 'approve'
              ? 'Sertifikat kamu sudah diverifikasi dan badge akan muncul di profile.'
              : notes || 'Sertifikat kamu ditolak. Silakan periksa dan ajukan ulang.',
          actionUrl: '/student/profile/certifications',
        },
      }),
    ])

    revalidatePath('/certification/verifications')
    revalidatePath('/certification/records')
    revalidatePath('/certification/dashboard')
    revalidatePath(`/certification/verifications/${requestId}`)

    return { ok: true, status: newStatus }
  } catch (err: any) {
    console.error('[reviewVerification]', err?.message)
    return { ok: false, error: 'Gagal menyimpan hasil review' }
  }
}

// ============================================
// BULK APPROVE / REJECT
// ============================================

const bulkSchema = z.object({
  requestIds: z.array(z.string().uuid()).min(1).max(100),
  action: z.enum(['approve', 'reject']),
  notes: z.string().max(500).nullable().optional(),
})

export async function bulkReviewVerificationsAction(input: unknown) {
  const ctx = await requireVerifier()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = bulkSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const { requestIds, action, notes } = parsed.data

  const requests = await prisma.verificationRequest.findMany({
    where: {
      id: { in: requestIds },
      institutionId: ctx.institutionId,
      status: { in: ['pending', 'in_review'] },
    },
    include: {
      certificate: {
        select: {
          id: true,
          student: { select: { userId: true } },
        },
      },
    },
  })

  if (requests.length === 0) {
    return { ok: false, error: 'Tidak ada pengajuan valid' }
  }

  const newStatus = action === 'approve' ? 'verified' : 'rejected'
  const certificateStatus = action === 'approve' ? 'verified' : 'rejected'
  const now = new Date()

  try {
    await prisma.$transaction([
      prisma.verificationRequest.updateMany({
        where: { id: { in: requests.map((r) => r.id) } },
        data: {
          status: newStatus,
          reviewedBy: ctx.userId,
          reviewedAt: now,
          notes: notes ?? null,
        },
      }),
      prisma.certificate.updateMany({
        where: { id: { in: requests.map((r) => r.certificate.id) } },
        data: {
          verificationStatus: certificateStatus,
          verifiedAt: action === 'approve' ? now : null,
        },
      }),
      prisma.notification.createMany({
        data: requests.map((r) => ({
          userId: r.certificate.student.userId,
          type: 'verification' as const,
          title:
            action === 'approve'
              ? '🎉 Sertifikat Kamu Terverifikasi!'
              : '❌ Sertifikat Kamu Ditolak',
          body:
            action === 'approve'
              ? 'Sertifikat kamu sudah diverifikasi dan badge akan muncul di profile.'
              : notes || 'Sertifikat kamu ditolak.',
          actionUrl: '/student/profile/certifications',
        })),
      }),
    ])

    revalidatePath('/certification/verifications')
    revalidatePath('/certification/records')
    revalidatePath('/certification/dashboard')

    return { ok: true, count: requests.length }
  } catch (err: any) {
    console.error('[bulkReview]', err?.message)
    return { ok: false, error: 'Gagal bulk review' }
  }
}

// ============================================
// MARK AS IN REVIEW
// ============================================

export async function markInReviewAction(requestId: string) {
  const ctx = await requireVerifier()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    await prisma.verificationRequest.updateMany({
      where: {
        id: requestId,
        institutionId: ctx.institutionId,
        status: 'pending',
      },
      data: { status: 'in_review' },
    })
    revalidatePath('/certification/verifications')
    return { ok: true }
  } catch (err: any) {
    console.error('[markInReview]', err?.message)
    return { ok: false, error: 'Gagal update status' }
  }
}