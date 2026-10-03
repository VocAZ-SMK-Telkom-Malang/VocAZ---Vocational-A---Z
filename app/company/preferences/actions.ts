// app/company/preferences/actions.ts
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
    return { error: 'Hanya owner/admin yang bisa ubah preference' as const }
  }

  const companyId = user.ownedCompany?.id ?? user.companyMembers[0]?.companyId
  if (!companyId) return { error: 'Company tidak ditemukan' as const }

  return { user, companyId }
}

// ============================================
// SAVE PREFERENCES
// ============================================

const prefsSchema = z.object({
  skills: z.array(z.string()).max(50),
  programs: z.array(z.string()).max(20),
  locations: z.array(z.string()).max(50),
  certifications: z.array(z.string()).max(20),
  minExperience: z.number().int().min(0).max(120).nullable(),
  maxExperience: z.number().int().min(0).max(120).nullable(),
  workMode: z.enum(['onsite', 'remote', 'hybrid']).nullable(),
  preferVerified: z.boolean(),
  preferBnsp: z.boolean(),
  minMatchScore: z.number().int().min(0).max(100),
})

export async function savePreferencesAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = prefsSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const data = parsed.data

  // Validate min/max experience
  if (
    data.minExperience !== null &&
    data.maxExperience !== null &&
    data.maxExperience < data.minExperience
  ) {
    return {
      ok: false,
      error: 'Max experience harus lebih besar dari min',
    }
  }

  try {
    await prisma.talentPreference.upsert({
      where: { companyId: ctx.companyId },
      update: {
        skills: data.skills,
        programs: data.programs,
        locations: data.locations,
        certifications: data.certifications,
        minExperience: data.minExperience,
        maxExperience: data.maxExperience,
        workMode: data.workMode as any,
        preferVerified: data.preferVerified,
        preferBnsp: data.preferBnsp,
        minMatchScore: data.minMatchScore,
      },
      create: {
        companyId: ctx.companyId,
        skills: data.skills,
        programs: data.programs,
        locations: data.locations,
        certifications: data.certifications,
        minExperience: data.minExperience,
        maxExperience: data.maxExperience,
        workMode: data.workMode as any,
        preferVerified: data.preferVerified,
        preferBnsp: data.preferBnsp,
        minMatchScore: data.minMatchScore,
      },
    })

    revalidatePath('/company/preferences')
    revalidatePath('/company/talent')

    return { ok: true }
  } catch (err: any) {
    console.error('[savePreferences] Error:', err?.message)
    return { ok: false, error: 'Gagal simpan preference' }
  }
}