// lib/school/token.ts
import { prisma } from '@/lib/prisma'

/**
 * Generate token enrollment sekolah
 * Format: SMKN1JKT-XXXX (4 char random)
 */
export function generateSchoolToken(schoolName: string): string {
  const prefix = schoolName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8)
  
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${random}`
}

/**
 * Assign token ke sekolah (kalau belum ada)
 */
export async function ensureSchoolToken(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { id: true, name: true, enrollmentToken: true },
  })

  if (!school) return null
  if (school.enrollmentToken) return school.enrollmentToken

  // Generate unique token
  let token = generateSchoolToken(school.name)
  let attempts = 0

  while (attempts < 5) {
    const existing = await prisma.school.findUnique({
      where: { enrollmentToken: token },
      select: { id: true },
    })
    if (!existing) break
    token = generateSchoolToken(school.name)
    attempts++
  }

  await prisma.school.update({
    where: { id: schoolId },
    data: { enrollmentToken: token, tokenActive: true },
  })

  return token
}

/**
 * Validasi token — return schoolId kalau valid
 */
export async function validateToken(token: string) {
  const school = await prisma.school.findUnique({
    where: { enrollmentToken: token.trim().toUpperCase() },
    select: {
      id: true,
      name: true,
      slug: true,
      tokenActive: true,
      tokenExpiresAt: true,
    },
  })

  if (!school) return { ok: false as const, error: 'Token tidak ditemukan' }
  if (!school.tokenActive) return { ok: false as const, error: 'Token tidak aktif' }
  if (school.tokenExpiresAt && school.tokenExpiresAt < new Date()) {
    return { ok: false as const, error: 'Token sudah kadaluarsa' }
  }

  return {
    ok: true as const,
    school: {
      id: school.id,
      name: school.name,
      slug: school.slug,
    },
  }
}