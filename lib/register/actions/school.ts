// lib/register/actions/school.ts
'use server'

import { prisma } from '@/lib/prisma'
import type { FinalizeSchoolInput } from '@/lib/register/types'
import { SCHOOL_PLANS } from '@/lib/register/school-plans'
import { ensureSchoolToken } from '@/lib/school/token'
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

function generateSchoolCode(slug: string): string {
  const prefix = slug.split('-').slice(0, 2).join('-').slice(0, 20)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${suffix}`
}

function generatePaymentRef(): string {
  return `VOCAZ-SCH-${Date.now().toString(36).toUpperCase()}`
}

export async function finalizeSchoolRegistration(
  input: FinalizeSchoolInput
): Promise<ActionState> {
  try {
    if (!input.neonAuthUserId || !isValidUuid(input.neonAuthUserId)) {
      return {
        ok: false,
        error: 'Session auth tidak valid. Coba login ulang.',
      }
    }
    if (!(await verifyRegistrationSession(input.neonAuthUserId, input.email))) {
      return { ok: false, error: 'Sesi tidak cocok dengan email pendaftaran.' }
    }

    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    })
    if (existing) {
      return { ok: false, error: 'Email sudah terdaftar.' }
    }

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

    const plan = SCHOOL_PLANS.find((p) => p.id === input.plan)
    if (!plan) {
      return { ok: false, error: 'Paket tidak valid' }
    }

    // ============================================
    // 1. Buat User
    // ============================================
    const user = await prisma.user.create({
      data: {
        neonAuthUserId: input.neonAuthUserId,
        email: input.email,
        fullName: input.fullName,
        role: 'school',
        isActive: true,
      },
    })

    // ============================================
    // 2. Generate slug + schoolCode unik
    // ============================================
    const baseSlug = generateSlug(input.schoolName)
    const existingSlug = await prisma.school.findUnique({
      where: { slug: baseSlug },
    })
    const slug = existingSlug
      ? `${baseSlug}-${Date.now().toString(36)}`
      : baseSlug

    let schoolCode = generateSchoolCode(slug)
    let codeExists = await prisma.school.findUnique({
      where: { schoolCode },
    })
    let attempts = 0
    while (codeExists && attempts < 5) {
      schoolCode = generateSchoolCode(slug)
      codeExists = await prisma.school.findUnique({ where: { schoolCode } })
      attempts++
    }

    // ============================================
    // 3. Subscription dates
    // ============================================
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    // ============================================
    // 4. Buat School
    // ============================================
    const school = await prisma.school.create({
      data: {
        ownerUserId: user.id,
        name: input.schoolName,
        npsn: input.npsn || null,
        slug,
        level: 'smk',
        accreditation: input.accreditation || null,
        email: input.email,
        address: input.address || null,
        city: input.city || null,
        province: input.province || null,
        bkkName: input.bkkName || null,
        bkkContact: input.bkkContact || null,
        bkkEmail: input.bkkEmail || null,
        bkkPhone: input.bkkPhone || null,

        schoolCode,
        activeStudentQuota: plan.studentQuota,
        adminSeatQuota: plan.adminQuota,
        subscriptionPlan: input.plan,
        subscriptionStatus: 'active',
        subscriptionStartedAt: now,
        subscriptionExpiresAt: expiresAt,
        subscriptionAmount: input.planPrice,
        paymentMethod: input.paymentMethod,
        paymentReference: input.paymentReference || generatePaymentRef(),
        lastPaymentAt: now,
      },
    })

    // ============================================
    // 5. Generate ENROLLMENT TOKEN untuk siswa
    // ============================================
    let enrollmentToken: string | null = null
    try {
      enrollmentToken = await ensureSchoolToken(school.id)
    } catch (err) {
      console.error('[finalizeSchool] gagal generate enrollment token:', err)
      // Jangan fail registrasi — token bisa di-generate nanti dari setting
    }

    // ============================================
    // 6. Buat SchoolMember (owner)
    // ============================================
    try {
      await prisma.schoolMember.create({
        data: {
          schoolId: school.id,
          userId: user.id,
          role: 'owner',
        },
      })
    } catch (err) {
      console.error('[finalizeSchool] gagal create SchoolMember:', err)
      // Jangan fail — owner relation udah ada via ownedSchool
    }

    // ============================================
    // 7. Audit log
    // ============================================
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'school.register',
        targetType: 'school',
        targetId: school.id,
        metadata: {
          schoolName: school.name,
          plan: input.plan,
          amount: input.planPrice,
          paymentMethod: input.paymentMethod,
        },
      },
    })

    // ============================================
    // 8. Return
    // ============================================
    return {
      ok: true,
      data: {
        userId: user.id,
        schoolId: school.id,
        schoolSlug: school.slug,
        schoolCode: school.schoolCode,
        enrollmentToken, // ← token untuk share ke siswa
      },
    }
  } catch (err) {
    console.error('School registration error:', err)
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mendaftar',
    }
  }
}