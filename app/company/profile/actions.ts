// app/company/profile/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER
// ============================================

async function requireCompany() {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedCompany: { select: { id: true, slug: true } },
    },
  })

  if (!user || user.role !== 'company' || !user.ownedCompany) {
    return { error: 'Hanya recruiter' as const }
  }

  return { user, company: user.ownedCompany }
}

// ============================================
// UPDATE BASIC INFO
// ============================================

const basicSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(150),
  tagline: z.string().max(200).optional().nullable(),
  industry: z.string().max(100).optional().nullable(),
  companySize: z
    .enum(['s1_10', 's11_50', 's51_200', 's201_500', 's500plus'])
    .optional()
    .nullable(),
  website: z.string().url('URL tidak valid').max(200).optional().nullable().or(z.literal('')),
  email: z.string().email('Email tidak valid').max(150).optional().nullable().or(z.literal('')),
  phone: z.string().max(50).optional().nullable(),
  foundedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional().nullable(),
  employeeRange: z.string().max(50).optional().nullable(),
})

export async function updateBasicInfoAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = basicSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  try {
    await prisma.company.update({
      where: { id: ctx.company.id },
      data: {
        name: parsed.data.name,
        tagline: parsed.data.tagline || null,
        industry: parsed.data.industry || null,
        companySize: parsed.data.companySize || null,
        website: parsed.data.website || null,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        foundedYear: parsed.data.foundedYear || null,
        employeeRange: parsed.data.employeeRange || null,
      },
    })

    revalidatePath('/company/profile')
    revalidatePath('/perusahaan')
    revalidatePath(`/perusahaan/${ctx.company.slug}`)

    return { ok: true }
  } catch (err: any) {
    console.error('[updateBasic] Error:', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}

// ============================================
// UPDATE ABOUT
// ============================================

const aboutSchema = z.object({
  description: z.string().max(5000).optional().nullable(),
  culture: z.string().max(3000).optional().nullable(),
})

export async function updateAboutAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = aboutSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  try {
    await prisma.company.update({
      where: { id: ctx.company.id },
      data: {
        description: parsed.data.description || null,
        culture: parsed.data.culture || null,
      },
    })

    revalidatePath('/company/profile')
    revalidatePath(`/perusahaan/${ctx.company.slug}`)

    return { ok: true }
  } catch (err: any) {
    console.error('[updateAbout] Error:', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}

// ============================================
// UPDATE BENEFITS
// ============================================

const benefitsSchema = z.object({
  benefits: z.array(z.string().min(1).max(100)).max(20),
})

export async function updateBenefitsAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = benefitsSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  try {
    await prisma.company.update({
      where: { id: ctx.company.id },
      data: { benefits: parsed.data.benefits },
    })

    revalidatePath('/company/profile')
    revalidatePath(`/perusahaan/${ctx.company.slug}`)

    return { ok: true }
  } catch (err: any) {
    console.error('[updateBenefits] Error:', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}

// ============================================
// UPDATE CONTACT
// ============================================

const contactSchema = z.object({
  address: z.string().max(500).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  linkedinUrl: z.string().url().max(200).optional().nullable().or(z.literal('')),
  instagramUrl: z.string().url().max(200).optional().nullable().or(z.literal('')),
  facebookUrl: z.string().url().max(200).optional().nullable().or(z.literal('')),
})

export async function updateContactAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  try {
    await prisma.company.update({
      where: { id: ctx.company.id },
      data: {
        address: parsed.data.address || null,
        city: parsed.data.city || null,
        province: parsed.data.province || null,
        linkedinUrl: parsed.data.linkedinUrl || null,
        instagramUrl: parsed.data.instagramUrl || null,
        facebookUrl: parsed.data.facebookUrl || null,
      },
    })

    revalidatePath('/company/profile')
    revalidatePath(`/perusahaan/${ctx.company.slug}`)

    return { ok: true }
  } catch (err: any) {
    console.error('[updateContact] Error:', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}

// ============================================
// UPDATE LOGO
// ============================================

const logoSchema = z.object({
  logoUrl: z.string().url(),
  logoKey: z.string(),
})

export async function updateLogoAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = logoSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  try {
    await prisma.company.update({
      where: { id: ctx.company.id },
      data: {
        logoUrl: parsed.data.logoUrl,
        logoKey: parsed.data.logoKey,
      },
    })

    revalidatePath('/company/profile')
    revalidatePath(`/perusahaan/${ctx.company.slug}`)

    return { ok: true }
  } catch (err: any) {
    console.error('[updateLogo] Error:', err?.message)
    return { ok: false, error: 'Gagal update logo' }
  }
}

// ============================================
// UPDATE COVER
// ============================================

const coverSchema = z.object({
  coverUrl: z.string().url(),
  coverKey: z.string(),
})

export async function updateCoverAction(input: unknown) {
  const ctx = await requireCompany()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = coverSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: 'Data tidak valid' }

  try {
    await prisma.company.update({
      where: { id: ctx.company.id },
      data: {
        coverUrl: parsed.data.coverUrl,
        coverKey: parsed.data.coverKey,
      },
    })

    revalidatePath('/company/profile')
    revalidatePath(`/perusahaan/${ctx.company.slug}`)

    return { ok: true }
  } catch (err: any) {
    console.error('[updateCover] Error:', err?.message)
    return { ok: false, error: 'Gagal update cover' }
  }
}