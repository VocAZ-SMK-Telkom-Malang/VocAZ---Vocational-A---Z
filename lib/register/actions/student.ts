// lib/register/actions/student.ts
'use server'

import { prisma } from '@/lib/prisma'
import type { ActionState, FinalizeStudentInput } from '@/lib/register/types'
import { validateToken } from '@/lib/school/token'

// ============================================
// HELPER
// ============================================

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(v: string): boolean {
  return UUID_REGEX.test(v)
}

// ============================================
// FINALIZE STUDENT REGISTRATION
// ============================================

export async function finalizeStudentRegistration(
  input: FinalizeStudentInput & { schoolToken?: string | null }
): Promise<ActionState> {
  try {
    // 0. Validasi neonAuthUserId
    if (!input.neonAuthUserId || !isValidUuid(input.neonAuthUserId)) {
      return {
        ok: false,
        error: 'Session auth tidak valid. Coba login ulang.',
      }
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

    // ============================================
    // 3. Resolve schoolId dari token (kalau ada)
    // ============================================
    let resolvedSchoolId: string | null = input.schoolId || null

    if (input.schoolToken && input.schoolToken.trim()) {
      const tokenResult = await validateToken(input.schoolToken.trim())

      if (!tokenResult.ok) {
        return {
          ok: false,
          error: `Token sekolah tidak valid: ${tokenResult.error}`,
        }
      }

      // Token valid → override schoolId
      resolvedSchoolId = tokenResult.school.id
    }

    // ============================================
    // 4. Buat user
    // ============================================
    const user = await prisma.user.create({
      data: {
        neonAuthUserId: input.neonAuthUserId,
        email: input.email,
        fullName: input.fullName,
        role: 'student',
        isActive: true,
      },
    })

    // ============================================
    // 5. Hitung profile completion
    // ============================================
    const completion = calculateProfileCompletion({
      ...input,
      schoolId: resolvedSchoolId ?? undefined,
    })

    // ============================================
    // 6. Buat StudentProfile
    // ============================================
    const profile = await prisma.studentProfile.create({
      data: {
        userId: user.id,
        schoolId: resolvedSchoolId,
        nisn: input.nisn || null,
        headline: input.headline || null,
        bio: input.bio || null,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        gender: input.gender || null,
        city: input.city || null,
        province: input.province || null,
        isOpenToWork: input.isOpenToWork ?? true,
        isPublic: input.isPublic ?? true,
        profileCompletion: completion,
      },
    })

    // ============================================
    // 7. Link ke SchoolStudent (kalau ada school)
    // ============================================
    if (resolvedSchoolId) {
      try {
        await prisma.schoolStudent.create({
          data: {
            schoolId: resolvedSchoolId,
            studentId: profile.id,
            programId: input.programId || null,
            enrollmentYear: input.enrollmentYear,
            graduationYear: input.graduationYear,
            status: 'active',
          },
        })
      } catch (err) {
        // Kalau duplikat (siswa udah pernah link), abaikan
        console.warn('[finalizeStudent] gagal create SchoolStudent:', err)
      }
    }

    // ============================================
    // 8. Buat StudentSkill[]
    // ============================================
    if (input.skillIds && input.skillIds.length > 0) {
      await prisma.studentSkill.createMany({
        data: input.skillIds.map((skillId) => ({
          studentId: profile.id,
          skillId,
          proficiency: 'intermediate' as const,
        })),
        skipDuplicates: true,
      })
    }

    // ============================================
    // 9. Audit log
    // ============================================
    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'student.register',
        targetType: 'student_profile',
        targetId: profile.id,
        metadata: {
          hasSchool: !!resolvedSchoolId,
          schoolToken: input.schoolToken || null,
          skillCount: input.skillIds?.length || 0,
          completion,
        },
      },
    })

    return {
      ok: true,
      data: {
        userId: user.id,
        studentProfileId: profile.id,
        profileCompletion: completion,
        schoolId: resolvedSchoolId,
      },
    }
  } catch (err) {
    console.error('Student registration error:', err)
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mendaftar',
    }
  }
}

// ============================================
// HELPER: Hitung profile completion
// ============================================

function calculateProfileCompletion(input: FinalizeStudentInput): number {
  let score = 0
  const maxScore = 100

  // Basic info (30)
  if (input.fullName) score += 10
  if (input.nisn) score += 5
  if (input.dateOfBirth) score += 5
  if (input.gender) score += 5
  if (input.city && input.province) score += 5

  // Education (20)
  if (input.schoolId) score += 15
  if (input.programId) score += 5

  // Profile (50)
  if (input.headline) score += 10
  if (input.bio) score += 10
  if (input.skillIds && input.skillIds.length >= 3) score += 30

  return Math.min(score, maxScore)
}