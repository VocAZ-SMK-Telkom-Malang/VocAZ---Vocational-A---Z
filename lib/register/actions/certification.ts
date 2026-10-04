// lib/register/actions/certification.ts
'use server'

import { prisma } from '@/lib/prisma'
import type { FinalizeCertificationInput } from '@/lib/register/types'
import { verifyRegistrationSession } from '@/lib/register/verify-auth-session'

type ActionState = {
  ok: boolean
  error?: string
  data?: Record<string, any>
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(v: string): boolean {
  return UUID_REGEX.test(v)
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export async function finalizeCertificationRegistration(
  input: FinalizeCertificationInput
): Promise<ActionState> {
  try {
    // 0. Validasi
    if (!input.neonAuthUserId || !isValidUuid(input.neonAuthUserId)) {
      return {
        ok: false,
        error: 'Session auth tidak valid. Coba login ulang.',
      }
    }
    if (!(await verifyRegistrationSession(input.neonAuthUserId, input.email))) {
      return { ok: false, error: 'Sesi tidak cocok dengan email pendaftaran.' }
    }

    // 1. Cek email
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    })
    if (existing) {
      return { ok: false, error: 'Email sudah terdaftar.' }
    }

    // 2. Cek neonAuthUserId
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

    // 3. Validasi tipe
    const validTypes = ['lsp_bnsp', 'industry']
    if (!validTypes.includes(input.type)) {
      return { ok: false, error: 'Tipe lembaga tidak valid' }
    }

    // 4. Buat user (role=certification)
    const user = await prisma.user.create({
      data: {
        neonAuthUserId: input.neonAuthUserId,
        email: input.email,
        fullName: input.fullName,
        role: 'certification',
        isActive: true,
      },
    })

    // 5. Generate slug unik
    const baseSlug = generateSlug(input.institutionName)
    const existingSlug = await prisma.certificationInstitution.findUnique({
      where: { slug: baseSlug },
    })
    const slug = existingSlug
      ? `${baseSlug}-${Date.now().toString(36)}`
      : baseSlug

    // 6. Buat certification institution
    const institution = await prisma.certificationInstitution.create({
      data: {
        ownerUserId: user.id,
        name: input.institutionName,
        slug,
        type: input.type as any,
        licenseNumber: input.licenseNumber || null,
        email: input.emailInstitution || input.email,
        phone: input.phone || null,
        website: input.website || null,
        address: input.address || null,
        description: input.description || null,
      },
    })

    // 7. Audit log
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'certification.register',
        targetType: 'certification_institution',
        targetId: institution.id,
        metadata: {
          institutionName: institution.name,
          type: input.type,
        },
      },
    })

    return {
      ok: true,
      data: {
        userId: user.id,
        institutionId: institution.id,
        institutionSlug: institution.slug,
      },
    }
  } catch (err) {
    console.error('Certification registration error:', err)
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mendaftar',
    }
  }
}