// app/company/verification/actions.ts
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
      ownedCompany: { select: { id: true, name: true, slug: true } },
      companyMembers: {
        select: { companyId: true, role: true },
      },
    },
  })

  if (!user || user.role !== 'company') {
    return { error: 'Hanya recruiter' as const }
  }

  const isOwner = !!user.ownedCompany
  const isAdmin = user.companyMembers.some(
    (m) => m.role === 'owner' || m.role === 'admin'
  )

  if (!isOwner && !isAdmin) {
    return { error: 'Hanya owner/admin yang bisa submit verifikasi' as const }
  }

  const companyId = user.ownedCompany?.id ?? user.companyMembers[0]?.companyId
  const companyName = user.ownedCompany?.name ?? 'Perusahaan'
  const companySlug = user.ownedCompany?.slug ?? ''

  if (!companyId) return { error: 'Company tidak ditemukan' as const }

  return { user, companyId, companyName, companySlug }
}

// ============================================
// SUBMIT VERIFICATION
// ============================================

const submitSchema = z.object({
  nib: z.object({
    url: z.string().url(),
    key: z.string(),
  }),
  npwp: z.object({
    url: z.string().url(),
    key: z.string(),
  }),
  siup: z
    .object({
      url: z.string().url(),
      key: z.string(),
    })
    .nullable()
    .optional(),
  supporting: z
    .object({
      url: z.string().url(),
      key: z.string(),
    })
    .nullable()
    .optional(),
})

export async function submitVerificationAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = submitSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const { nib, npwp, siup, supporting } = parsed.data

  // Cek status existing
  const company = await prisma.company.findUnique({
    where: { id: ctx.companyId },
    select: { verificationStatus: true },
  })

  if (company?.verificationStatus === 'verified') {
    return { ok: false, error: 'Perusahaan sudah terverifikasi' }
  }

  if (company?.verificationStatus === 'pending') {
    return {
      ok: false,
      error: 'Verifikasi sedang ditinjau. Tunggu hasil dari admin.',
    }
  }

  try {
    // Build supporting docs array
    const supportingDocs: Array<{ url: string; key: string; uploadedAt: string }> = []

    if (siup) {
      supportingDocs.push({
        url: siup.url,
        key: siup.key,
        uploadedAt: new Date().toISOString(),
      })
    }

    if (supporting) {
      supportingDocs.push({
        url: supporting.url,
        key: supporting.key,
        uploadedAt: new Date().toISOString(),
      })
    }

    // Buat submission baru
    const submission = await prisma.companyVerification.create({
      data: {
        companyId: ctx.companyId,
        legalDocumentUrl: nib.url,
        legalDocumentKey: nib.key,
        businessRegistrationUrl: npwp.url,
        businessRegistrationKey: npwp.key,
        supportingDocs: supportingDocs.length > 0 ? supportingDocs : undefined,
        status: 'pending',
      },
      select: { id: true },
    })

    // Update company status
    await prisma.company.update({
      where: { id: ctx.companyId },
      data: { verificationStatus: 'pending' },
    })

    // Notif ke semua admin (super admin)
    const admins = await prisma.user.findMany({
      where: { role: 'admin', isActive: true },
      select: { id: true },
    })

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((a) => ({
          userId: a.id,
          type: 'verification' as const,
          title: 'Verifikasi Baru',
          body: `${ctx.companyName} mengajukan verifikasi perusahaan`,
          actionUrl: `/admin/verifications/${submission.id}`,
        })),
      })
    }

    revalidatePath('/company/verification')
    revalidatePath(`/perusahaan/${ctx.companySlug}`)

    return { ok: true, submissionId: submission.id }
  } catch (err: any) {
    console.error('[submitVerification] Error:', err?.message)
    return { ok: false, error: 'Gagal submit verifikasi' }
  }
}

// ============================================
// CANCEL SUBMISSION (kalau pending, user bisa cancel)
// ============================================

export async function cancelVerificationAction() {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    await prisma.$transaction([
      prisma.companyVerification.updateMany({
        where: {
          companyId: ctx.companyId,
          status: 'pending',
        },
        data: {
          status: 'rejected',
          reviewNotes: 'Dibatalkan oleh perusahaan',
          reviewedAt: new Date(),
        },
      }),
      prisma.company.update({
        where: { id: ctx.companyId },
        data: { verificationStatus: 'unverified' },
      }),
    ])

    revalidatePath('/company/verification')
    return { ok: true }
  } catch (err: any) {
    console.error('[cancelVerification] Error:', err?.message)
    return { ok: false, error: 'Gagal batalkan' }
  }
}