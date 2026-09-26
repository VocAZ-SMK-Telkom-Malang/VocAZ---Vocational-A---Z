import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const onboardingSchema = z.object({
  role: z.enum(['student', 'company', 'school', 'certification']),
  fullName: z.string().min(2),
})

export async function POST(req: NextRequest) {
  try {
    const session: any = await auth.getSession()

    if (session instanceof Error || !session?.user) {
      return NextResponse.json(
        { ok: false, error: 'Session tidak ditemukan. Login ulang.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = onboardingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { role, fullName } = parsed.data
    const authUser = session.user

    // Upsert user ke DB VocAZ
    const user = await prisma.user.upsert({
      where: { neonAuthUserId: authUser.id },
      update: { role, fullName, email: authUser.email },
      create: {
        neonAuthUserId: authUser.id,
        email: authUser.email,
        fullName,
        role,
      },
    })

    // Buat profile sesuai role
    if (role === 'student') {
      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
      })
    } else if (role === 'company') {
      await prisma.company.upsert({
        where: { ownerUserId: user.id },
        update: {},
        create: {
          ownerUserId: user.id,
          name: fullName,
          slug: `company-${user.id.slice(0, 8)}`,
        },
      })
    } else if (role === 'school') {
      await prisma.school.upsert({
        where: { ownerUserId: user.id },
        update: {},
        create: {
          ownerUserId: user.id,
          name: fullName,
          slug: `school-${user.id.slice(0, 8)}`,
        },
      })
    } else if (role === 'certification') {
      await prisma.certificationInstitution.upsert({
        where: { ownerUserId: user.id },
        update: {},
        create: {
          ownerUserId: user.id,
          name: fullName,
          slug: `cert-${user.id.slice(0, 8)}`,
          type: 'industry',
        },
      })
    }

    return NextResponse.json({
      ok: true,
      user: { id: user.id, role: user.role, fullName: user.fullName },
    })
  } catch (err) {
    console.error('Onboarding error:', err)
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Terjadi kesalahan',
      },
      { status: 500 }
    )
  }
}