// lib/register/actions/company.ts
'use server'

import { prisma } from '@/lib/prisma'
import { accountSchema } from '@/lib/register/types'
import type {
  ActionState,
  FinalizeCompanyInput,
} from '@/lib/register/types'

// ============================================
// HELPER: Validasi UUID
// ============================================

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(v: string): boolean {
  return UUID_REGEX.test(v)
}

// ============================================
// STEP 1: VALIDATE ACCOUNT
// ============================================

export async function validateCompanyAccount(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    position: formData.get('position') as string,
  }

  const parsed = accountSchema.safeParse(raw)

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  })

  if (existing) {
    return {
      ok: false,
      error: 'Email sudah terdaftar. Gunakan email lain atau masuk.',
    }
  }

  return { ok: true, data: parsed.data }
}

// ============================================
// STEP 4: FINALIZE REGISTRATION
// ============================================

export async function finalizeCompanyRegistration(
  input: FinalizeCompanyInput
): Promise<ActionState> {
  try {
    // 0. Validasi neonAuthUserId adalah UUID valid
    if (!input.neonAuthUserId || !isValidUuid(input.neonAuthUserId)) {
      return {
        ok: false,
        error: 'Session auth tidak valid. Coba login ulang.',
      }
    }

    // 1. Cek email sudah terdaftar?
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    })

    if (existing) {
      return { ok: false, error: 'Email sudah terdaftar.' }
    }

    // 2. Cek neonAuthUserId sudah terdaftar? (safety)
    const existingAuth = await prisma.user.findUnique({
      where: { neonAuthUserId: input.neonAuthUserId },
      select: { id: true },
    })

    if (existingAuth) {
      return {
        ok: false,
        error: 'Akun auth ini sudah terhubung ke user lain.',
      }
    }

    // 3. Buat user
    const user = await prisma.user.create({
      data: {
        neonAuthUserId: input.neonAuthUserId,
        email: input.email,
        fullName: input.fullName,
        role: 'company',
        isActive: true,
      },
    })

    // 4. Generate slug unik
    const baseSlug = input.companyName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)

    const existingSlug = await prisma.company.findUnique({
      where: { slug: baseSlug },
    })
    const slug = existingSlug
      ? `${baseSlug}-${Date.now().toString(36)}`
      : baseSlug

    // 5. Buat company
    const company = await prisma.company.create({
      data: {
        ownerUserId: user.id,
        name: input.companyName,
        slug,
        logoUrl: input.logoUrl || null,
        logoKey: input.logoKey || null,
        industry: input.industry,
        companySize: input.companySize as any,
        foundedYear: input.foundedYear,
        website: input.website || null,
        phone: input.phone || null,
        email: input.email,
        address: input.address || null,
        city: input.city || null,
        province: input.province || null,
        description: input.description || null,
        verificationStatus: 'pending',
      },
    })

    // 6. Build supporting docs metadata
    const docsMetadata: Record<string, any> = {}

    if (input.businessRegistrationNumber) {
      docsMetadata.businessRegistrationNumber =
        input.businessRegistrationNumber
    }

    if (input.documents && Object.keys(input.documents).length > 0) {
      docsMetadata.documents = Object.entries(input.documents).map(
        ([type, doc]) => ({
          type,
          name: doc.name,
          url: doc.url,
          key: doc.key,
          size: doc.size,
        })
      )
    }

    if (input.responsibleName) {
      docsMetadata.responsible = {
        name: input.responsibleName,
        position: input.responsiblePosition,
        email: input.responsibleEmail,
      }
    }

    if (input.skippedDocs) {
      docsMetadata.skippedDocs = true
    }

    // 7. Buat verification record
    await prisma.companyVerification.create({
      data: {
        companyId: company.id,
        status: 'pending',
        supportingDocs:
          Object.keys(docsMetadata).length > 0 ? docsMetadata : undefined,
      },
    })

    // 8. Audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'company.register',
        targetType: 'company',
        targetId: company.id,
        metadata: {
          companyName: company.name,
          industry: company.industry,
          hasLogo: !!input.logoUrl,
          docCount: input.documents ? Object.keys(input.documents).length : 0,
        },
      },
    })

    return {
      ok: true,
      data: {
        userId: user.id,
        companyId: company.id,
        companySlug: company.slug,
      },
    }
  } catch (err) {
    console.error('Company registration error:', err)
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mendaftar',
    }
  }
}