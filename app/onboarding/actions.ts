'use server'

import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const onboardingSchema = z.object({
  role: z.enum(['student', 'company', 'school', 'certification']),
  fullName: z.string().min(2, 'Nama minimal 2 karakter'),
})

type ActionState = { error: string } | null

export async function submitOnboarding(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = onboardingSchema.safeParse({
    role: formData.get('role'),
    fullName: formData.get('fullName'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 1. Ambil cookie manual
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  console.log('🔍 [ACTION] Cookie length:', cookieHeader.length)

  if (!cookieHeader) {
    return { error: 'Cookie tidak ditemukan. Login ulang.' }
  }

  // 2. Panggil API get-session dengan cookie manual
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  const sessionRes = await fetch(
    `${protocol}://${host}/api/auth/get-session`,
    {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    }
  )

  const session = await sessionRes.json()

  console.log('🔍 [ACTION] Session user:', session?.user?.id)

  if (!session?.user) {
    return { error: 'Session tidak valid. Login ulang.' }
  }

  const authUser = session.user
  const { role, fullName } = parsed.data

  // 3. Simpan ke database
  try {
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
  } catch (err) {
    console.error('🔴 [ACTION] DB error:', err)
    return {
      error: err instanceof Error ? err.message : 'Gagal menyimpan role',
    }
  }

  // 4. Redirect (di luar try/catch)
  if (role === 'student') redirect('/student/dashboard')
  if (role === 'company') redirect('/company/dashboard')
  if (role === 'school') redirect('/school/dashboard')
  if (role === 'certification') redirect('/certification/dashboard')

  return null
}