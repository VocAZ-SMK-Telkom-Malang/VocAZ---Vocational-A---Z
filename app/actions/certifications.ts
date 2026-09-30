// app/actions/certifications.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

type ActionResult = { ok: boolean; error?: string; data?: any }

async function getSessionProfile() {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  return user?.studentProfile ?? null
}

// ============================================
// ADD CERTIFICATE
// ============================================

export async function addCertificate(input: {
  title: string
  certificateNumber?: string
  issuedDate?: string
  expiredDate?: string
  badgeType: 'lsp_bnsp' | 'industry' | 'training'
  documentUrl?: string
  documentKey?: string
  institutionId?: string
  requestVerification?: boolean
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    if (!input.title?.trim()) {
      return { ok: false, error: 'Judul wajib diisi' }
    }

    const cert = await prisma.certificate.create({
      data: {
        studentId: profile.id,
        title: input.title.trim(),
        certificateNumber: input.certificateNumber?.trim() || null,
        issuedDate: input.issuedDate ? new Date(input.issuedDate) : null,
        expiredDate: input.expiredDate ? new Date(input.expiredDate) : null,
        badgeType: input.badgeType,
        documentUrl: input.documentUrl || null,
        documentKey: input.documentKey || null,
        institutionId: input.institutionId || null,
        verificationStatus: input.requestVerification ? 'pending' : 'pending',
      },
    })

    // Kalau minta verifikasi, bikin VerificationRequest
    if (input.requestVerification && input.institutionId) {
      await prisma.verificationRequest.create({
        data: {
          certificateId: cert.id,
          institutionId: input.institutionId,
          submittedBy: profile.userId,
          status: 'pending',
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        actorId: profile.userId,
        action: 'certificate.create',
        targetType: 'certificate',
        targetId: cert.id,
        metadata: {
          title: cert.title,
          requestVerification: input.requestVerification ?? false,
        },
      },
    })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/certifications')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true, data: { id: cert.id } }
  } catch (err) {
    console.error('Add certificate error:', err)
    return { ok: false, error: 'Gagal menambah sertifikat' }
  }
}

// ============================================
// UPDATE CERTIFICATE
// ============================================

export async function updateCertificate(input: {
  id: string
  title?: string
  certificateNumber?: string
  issuedDate?: string
  expiredDate?: string
  badgeType?: 'lsp_bnsp' | 'industry' | 'training'
  documentUrl?: string
  documentKey?: string
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const cert = await prisma.certificate.findUnique({
      where: { id: input.id },
      select: { studentId: true },
    })

    if (!cert || cert.studentId !== profile.id) {
      return { ok: false, error: 'Sertifikat tidak ditemukan' }
    }

    await prisma.certificate.update({
      where: { id: input.id },
      data: {
        ...(input.title !== undefined && { title: input.title.trim() }),
        ...(input.certificateNumber !== undefined && {
          certificateNumber: input.certificateNumber?.trim() || null,
        }),
        ...(input.issuedDate !== undefined && {
          issuedDate: input.issuedDate ? new Date(input.issuedDate) : null,
        }),
        ...(input.expiredDate !== undefined && {
          expiredDate: input.expiredDate ? new Date(input.expiredDate) : null,
        }),
        ...(input.badgeType !== undefined && { badgeType: input.badgeType }),
        ...(input.documentUrl !== undefined && {
          documentUrl: input.documentUrl || null,
        }),
        ...(input.documentKey !== undefined && {
          documentKey: input.documentKey || null,
        }),
      },
    })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/certifications')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal update sertifikat' }
  }
}

// ============================================
// DELETE CERTIFICATE
// ============================================

export async function deleteCertificate(id: string): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    const cert = await prisma.certificate.findUnique({
      where: { id },
      select: { studentId: true },
    })

    if (!cert || cert.studentId !== profile.id) {
      return { ok: false, error: 'Sertifikat tidak ditemukan' }
    }

    await prisma.certificate.delete({ where: { id } })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/certifications')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: 'Gagal hapus sertifikat' }
  }
}

// ============================================
// REQUEST VERIFICATION
// ============================================

export async function requestVerification(input: {
  certificateId: string
  institutionId: string
}): Promise<ActionResult> {
  try {
    const profile = await getSessionProfile()
    if (!profile) return { ok: false, error: 'Harus login' }

    // Cek certificate milik student ini
    const cert = await prisma.certificate.findUnique({
      where: { id: input.certificateId },
      select: { studentId: true, institutionId: true },
    })

    if (!cert || cert.studentId !== profile.id) {
      return { ok: false, error: 'Sertifikat tidak ditemukan' }
    }

    // Cek udah ada request pending
    const existing = await prisma.verificationRequest.findFirst({
      where: {
        certificateId: input.certificateId,
        status: { in: ['pending', 'in_review'] },
      },
    })

    if (existing) {
      return { ok: false, error: 'Sudah ada permintaan verifikasi yang pending' }
    }

    await prisma.verificationRequest.create({
      data: {
        certificateId: input.certificateId,
        institutionId: input.institutionId,
        submittedBy: profile.userId,
        status: 'pending',
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: profile.userId,
        action: 'certificate.request_verification',
        targetType: 'certificate',
        targetId: input.certificateId,
        metadata: { institutionId: input.institutionId },
      },
    })

    revalidatePath('/student/profile')
    revalidatePath('/student/profile/certifications')
    revalidatePath('/student/talents')
    revalidatePath('/talenta')
    return { ok: true }
  } catch (err) {
    console.error('Request verification error:', err)
    return { ok: false, error: 'Gagal minta verifikasi' }
  }
}