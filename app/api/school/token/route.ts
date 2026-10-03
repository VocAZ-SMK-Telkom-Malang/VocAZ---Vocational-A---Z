// app/api/school/token/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { ensureSchoolToken } from '@/lib/school/token'

// ============================================
// GET — ambil token sekolah yang lagi login
// ============================================
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: {
        id: true,
        role: true,
        ownedSchool: {
          select: { id: true, name: true, enrollmentToken: true },
        },
        schoolMembers: {
          select: {
            schoolId: true,
            role: true,
            school: {
              select: { id: true, name: true, enrollmentToken: true },
            },
          },
        },
      },
    })

    if (!user || user.role !== 'school') {
      return NextResponse.json(
        { ok: false, error: 'Hanya untuk akun sekolah' },
        { status: 403 }
      )
    }

    const school = user.ownedSchool ?? user.schoolMembers[0]?.school
    if (!school) {
      return NextResponse.json(
        { ok: false, error: 'Sekolah tidak ditemukan' },
        { status: 404 }
      )
    }

    // Generate token kalau belum ada
    let token = school.enrollmentToken
    if (!token) {
      token = await ensureSchoolToken(school.id)
    }

    return NextResponse.json({
      ok: true,
      token,
      schoolId: school.id,
      schoolName: school.name,
    })
  } catch (err) {
    console.error('[GET /api/school/token]', err)
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}

// ============================================
// POST — regenerate token (reset)
// ============================================
export async function POST() {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: {
        id: true,
        role: true,
        ownedSchool: { select: { id: true } },
        schoolMembers: {
          select: { schoolId: true, role: true },
        },
      },
    })

    if (!user || user.role !== 'school') {
      return NextResponse.json(
        { ok: false, error: 'Hanya untuk akun sekolah' },
        { status: 403 }
      )
    }

    // Cek authorization — hanya owner/admin
    const schoolId = user.ownedSchool?.id ?? user.schoolMembers[0]?.schoolId
    if (!schoolId) {
      return NextResponse.json(
        { ok: false, error: 'Sekolah tidak ditemukan' },
        { status: 404 }
      )
    }

    const isOwner = !!user.ownedSchool
    const isAdmin = user.schoolMembers.some(
      (m) => m.role === 'owner' || m.role === 'admin'
    )
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { ok: false, error: 'Hanya owner/admin yang bisa reset token' },
        { status: 403 }
      )
    }

    // Reset token dengan generate baru
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { name: true },
    })
    if (!school) {
      return NextResponse.json(
        { ok: false, error: 'Sekolah tidak ditemukan' },
        { status: 404 }
      )
    }

    // Force regenerate — set null dulu, terus ensure
    await prisma.school.update({
      where: { id: schoolId },
      data: { enrollmentToken: null },
    })

    const newToken = await ensureSchoolToken(schoolId)

    return NextResponse.json({
      ok: true,
      token: newToken,
    })
  } catch (err) {
    console.error('[POST /api/school/token]', err)
    return NextResponse.json(
      { ok: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}