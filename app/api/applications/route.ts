// app/api/applications/route.ts
import { NextResponse } from 'next/server'
import {
  getApplicationsByStudent,
  getApplicationStats,
} from '@/lib/queries/applications'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // ============================================
    // SEMENTARA — pakai user student pertama di DB
    // Nanti ganti pakai auth session
    // ============================================
    const firstUser = await prisma.user.findFirst({
      where: { role: 'student' },
      select: { id: true, email: true, fullName: true },
    })

    if (!firstUser) {
      return NextResponse.json(
        {
          error: 'Belum ada user student. Jalankan: npx tsx prisma/seed-applications.ts',
        },
        { status: 404 }
      )
    }

    const [applications, stats] = await Promise.all([
      getApplicationsByStudent(firstUser.id),
      getApplicationStats(firstUser.id),
    ])

    return NextResponse.json({
      applications,
      stats,
      user: {
        id: firstUser.id,
        email: firstUser.email,
        fullName: firstUser.fullName,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}