// app/company/saved/actions.ts
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
      ownedCompany: { select: { id: true } },
    },
  })

  if (!user || user.role !== 'company' || !user.ownedCompany) {
    return { error: 'Hanya recruiter' as const }
  }

  return { user, company: user.ownedCompany }
}

// ============================================
// TOGGLE SAVE
// ============================================

const toggleSchema = z.object({
  studentId: z.string().uuid(),
  source: z
    .enum(['talent_match', 'showcase', 'applicant', 'manual'])
    .optional(),
  note: z.string().max(500).optional(),
})

export async function toggleSaveTalentAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = toggleSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  const { studentId, source, note } = parsed.data

  // Verify student exists
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    select: { id: true },
  })
  if (!student) return { ok: false, error: 'Kandidat tidak ditemukan' }

  // Check if already saved
  const existing = await prisma.savedTalent.findUnique({
    where: {
      companyId_studentId: {
        companyId: ctx.company.id,
        studentId,
      },
    },
    select: { id: true },
  })

  try {
    if (existing) {
      await prisma.savedTalent.delete({ where: { id: existing.id } })
      revalidatePath('/company/saved')
      revalidatePath('/company/talent')
      revalidatePath('/company/showcase')
      return { ok: true, saved: false }
    } else {
      await prisma.savedTalent.create({
        data: {
          companyId: ctx.company.id,
          studentId,
          savedBy: ctx.user.id,
          source: source ?? 'manual',
          note: note ?? null,
        },
      })
      revalidatePath('/company/saved')
      revalidatePath('/company/talent')
      revalidatePath('/company/showcase')
      return { ok: true, saved: true }
    }
  } catch (err: any) {
    console.error('[toggleSave] Error:', err?.message)
    return { ok: false, error: 'Gagal save' }
  }
}

// ============================================
// UPDATE NOTE
// ============================================

const noteSchema = z.object({
  savedId: z.string().uuid(),
  note: z.string().max(500),
})

export async function updateSavedNoteAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = noteSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  const { savedId, note } = parsed.data

  const saved = await prisma.savedTalent.findUnique({
    where: { id: savedId },
    select: { companyId: true },
  })

  if (!saved || saved.companyId !== ctx.company.id) {
    return { ok: false, error: 'Tidak berhak' }
  }

  try {
    await prisma.savedTalent.update({
      where: { id: savedId },
      data: { note: note || null },
    })
    revalidatePath('/company/saved')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateNote] Error:', err?.message)
    return { ok: false, error: 'Gagal update catatan' }
  }
}

// ============================================
// REMOVE FROM SAVED
// ============================================

export async function removeSavedTalentAction(savedId: string) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const saved = await prisma.savedTalent.findUnique({
    where: { id: savedId },
    select: { companyId: true },
  })

  if (!saved || saved.companyId !== ctx.company.id) {
    return { ok: false, error: 'Tidak berhak' }
  }

  try {
    await prisma.savedTalent.delete({ where: { id: savedId } })
    revalidatePath('/company/saved')
    revalidatePath('/company/talent')
    return { ok: true }
  } catch (err: any) {
    console.error('[removeSaved] Error:', err?.message)
    return { ok: false, error: 'Gagal hapus' }
  }
}