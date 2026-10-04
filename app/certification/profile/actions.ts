// app/certification/profile/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCertContext } from '@/lib/queries/cert-context'
import { revalidatePath } from 'next/cache'

async function requireOwner() {
  const ctx = await getCertContext()
  if (!ctx) return { error: 'Unauthorized' as const }
  if (ctx.role !== 'owner') {
    return { error: 'Hanya owner yang bisa edit profil' as const }
  }
  return ctx
}

// ============================================
// UPDATE PROFILE
// ============================================

const profileSchema = z.object({
  name: z.string().min(1, 'Nama institusi wajib').max(200),
  licenseNumber: z.string().max(100).nullable().optional(),
  email: z.string().email('Email tidak valid').nullable().optional().or(z.literal('')),
  phone: z.string().max(30).nullable().optional(),
  website: z
    .string()
    .url('Website harus URL valid')
    .nullable()
    .optional()
    .or(z.literal('')),
  address: z.string().max(500).nullable().optional(),
  logoUrl: z
    .string()
    .url('Logo harus URL valid')
    .nullable()
    .optional()
    .or(z.literal('')),
  description: z.string().max(2000).nullable().optional(),
})

export async function updateCertProfileAction(input: unknown) {
  const guard = await requireOwner()
  if ('error' in guard) return { ok: false, error: guard.error }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const d = parsed.data

  try {
    await prisma.certificationInstitution.update({
      where: { id: guard.institutionId },
      data: {
        name: d.name,
        licenseNumber: d.licenseNumber || null,
        email: d.email || null,
        phone: d.phone || null,
        website: d.website || null,
        address: d.address || null,
        logoUrl: d.logoUrl || null,
        description: d.description || null,
      },
    })

    revalidatePath('/certification/profile')
    revalidatePath('/certification/dashboard')

    return { ok: true }
  } catch (err: any) {
    console.error('[updateCertProfile]', err?.message)
    return { ok: false, error: 'Gagal menyimpan profil' }
  }
}