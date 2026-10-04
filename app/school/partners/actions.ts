// app/school/partners/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { revalidatePath } from 'next/cache'

async function requireSchoolOwnerOrAdmin() {
  const ctx = await getSchoolContext()
  if (!ctx) return { error: 'Unauthorized' as const }
  if (ctx.role !== 'owner' && ctx.role !== 'admin') {
    return { error: 'Hanya owner/admin' as const }
  }
  return ctx
}

const PARTNERSHIP_TYPES = ['mou', 'internship', 'recruitment', 'training'] as const
const PARTNERSHIP_STATUS = ['active', 'expired', 'terminated'] as const

// ============================================
// ADD PARTNER
// ============================================

const addSchema = z.object({
  companyId: z.string().uuid(),
  partnershipType: z.enum(PARTNERSHIP_TYPES),
  status: z.enum(PARTNERSHIP_STATUS).default('active'),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
})

export async function addPartnerAction(input: unknown) {
  const ctx = await requireSchoolOwnerOrAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = addSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const d = parsed.data

  // Cek duplikat (unique constraint: schoolId + companyId + partnershipType)
  const existing = await prisma.industryPartner.findFirst({
    where: {
      schoolId: ctx.schoolId,
      companyId: d.companyId,
      partnershipType: d.partnershipType,
    },
  })
  if (existing) {
    return {
      ok: false,
      error: 'Perusahaan sudah jadi partner dengan jenis kerja sama ini',
    }
  }

  try {
    await prisma.industryPartner.create({
      data: {
        schoolId: ctx.schoolId,
        companyId: d.companyId,
        partnershipType: d.partnershipType,
        status: d.status,
        startDate: d.startDate ? new Date(d.startDate) : null,
        endDate: d.endDate ? new Date(d.endDate) : null,
        notes: d.notes ?? null,
      },
    })

    revalidatePath('/school/partners')
    revalidatePath('/school/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[addPartner]', err?.message)
    return { ok: false, error: 'Gagal tambah partner' }
  }
}

// ============================================
// UPDATE PARTNER
// ============================================

const updateSchema = z.object({
  id: z.string().uuid(),
  partnershipType: z.enum(PARTNERSHIP_TYPES),
  status: z.enum(PARTNERSHIP_STATUS),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
})

export async function updatePartnerAction(input: unknown) {
  const ctx = await requireSchoolOwnerOrAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = updateSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const d = parsed.data

  try {
    const result = await prisma.industryPartner.updateMany({
      where: { id: d.id, schoolId: ctx.schoolId },
      data: {
        partnershipType: d.partnershipType,
        status: d.status,
        startDate: d.startDate ? new Date(d.startDate) : null,
        endDate: d.endDate ? new Date(d.endDate) : null,
        notes: d.notes ?? null,
      },
    })

    if (result.count === 0) {
      return { ok: false, error: 'Partner tidak ditemukan' }
    }

    revalidatePath('/school/partners')
    revalidatePath('/school/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[updatePartner]', err?.message)
    return { ok: false, error: 'Gagal update partner' }
  }
}

// ============================================
// REMOVE PARTNER
// ============================================

export async function removePartnerAction(partnerId: string) {
  const ctx = await requireSchoolOwnerOrAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    const result = await prisma.industryPartner.deleteMany({
      where: { id: partnerId, schoolId: ctx.schoolId },
    })

    if (result.count === 0) {
      return { ok: false, error: 'Partner tidak ditemukan' }
    }

    revalidatePath('/school/partners')
    revalidatePath('/school/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[removePartner]', err?.message)
    return { ok: false, error: 'Gagal hapus partner' }
  }
}