import { NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ')

    if (!cookieHeader) {
      return NextResponse.json({ ok: false, dbUser: null })
    }

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

    if (!sessionRes.ok) {
      return NextResponse.json({ ok: false, dbUser: null })
    }

    const session = await sessionRes.json()

    if (!session?.user) {
      return NextResponse.json({ ok: false, dbUser: null })
    }

    const dbUser = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
      },
    })

    return NextResponse.json({
      ok: true,
      authUser: session.user,
      dbUser,
    })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Error' },
      { status: 500 }
    )
  }
}