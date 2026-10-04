// app/school/profile/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { ensureSchoolToken, generateSchoolToken } from '@/lib/school/token'
import { revalidatePath } from 'next/cache'

async function requireSchoolOwnerOrAdmin() {
  const ctx = await getSchoolContext()
  if (!ctx) return { error: 'Unauthorized' as const }

  if (ctx.role !== 'owner' && ctx.role !== 'admin') {
    return { error: 'Hanya owner/admin yang bisa edit profil' as const }
  }

  return ctx
}

// ============================================
// UPDATE SCHOOL PROFILE
// ============================================

const profileSchema = z.object({
  name: z.string().min(1, 'Nama sekolah wajib').max(200),
  npsn: z.string().max(20).nullable().optional(),
  level: z.string().nullable().optional(),
  accreditation: z.string().max(10).nullable().optional(),
  email: z.string().email().nullable().optional().or(z.literal('')),
  phone: z.string().max(30).nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal('')),
  address: z.string().max(500).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  province: z.string().max(100).nullable().optional(),
  logoUrl: z.string().url().nullable().optional().or(z.literal('')),
  description: z.string().max(2000).nullable().optional(),

  bkkName: z.string().max(200).nullable().optional(),
  bkkContact: z.string().max(200).nullable().optional(),
  bkkEmail: z.string().email().nullable().optional().or(z.literal('')),
  bkkPhone: z.string().max(30).nullable().optional(),
})

export async function updateSchoolProfileAction(input: unknown) {
  const ctx = await requireSchoolOwnerOrAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  const d = parsed.data

  try {
    await prisma.school.update({
      where: { id: ctx.schoolId },
      data: {
        name: d.name,
        npsn: d.npsn || null,
        level: (d.level as any) || null,
        accreditation: d.accreditation || null,
        email: d.email || null,
        phone: d.phone || null,
        website: d.website || null,
        address: d.address || null,
        city: d.city || null,
        province: d.province || null,
        logoUrl: d.logoUrl || null,
        description: d.description || null,
        bkkName: d.bkkName || null,
        bkkContact: d.bkkContact || null,
        bkkEmail: d.bkkEmail || null,
        bkkPhone: d.bkkPhone || null,
      },
    })

    revalidatePath('/school/profile')
    revalidatePath('/school/dashboard')

    return { ok: true }
  } catch (err: any) {
    console.error('[updateSchoolProfile]', err?.message)
    return { ok: false, error: 'Gagal menyimpan profil' }
  }
}

// ============================================
// REGENERATE ENROLLMENT TOKEN
// ============================================

export async function regenerateTokenAction() {
  const ctx = await requireSchoolOwnerOrAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    const school = await prisma.school.findUnique({
      where: { id: ctx.schoolId },
      select: { name: true },
    })
    if (!school) return { ok: false, error: 'Sekolah tidak ditemukan' }

    // Generate token baru
    let newToken = generateSchoolToken(school.name)
    let attempts = 0
    while (attempts < 5) {
      const existing = await prisma.school.findUnique({
        where: { enrollmentToken: newToken },
        select: { id: true },
      })
      if (!existing) break
      newToken = generateSchoolToken(school.name)
      attempts++
    }

    await prisma.school.update({
      where: { id: ctx.schoolId },
      data: { enrollmentToken: newToken, tokenActive: true },
    })

    revalidatePath('/school/profile')
    return { ok: true, token: newToken }
  } catch (err: any) {
    console.error('[regenerateToken]', err?.message)
    return { ok: false, error: 'Gagal regenerate token' }
  }
}

// ============================================
// TOGGLE TOKEN ACTIVE
// ============================================

export async function toggleTokenActiveAction(active: boolean) {
  const ctx = await requireSchoolOwnerOrAdmin()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    await prisma.school.update({
      where: { id: ctx.schoolId },
      data: { tokenActive: active },
    })

    revalidatePath('/school/profile')
    return { ok: true }
  } catch (err: any) {
    console.error('[toggleTokenActive]', err?.message)
    return { ok: false, error: 'Gagal mengubah status token' }
  }
}