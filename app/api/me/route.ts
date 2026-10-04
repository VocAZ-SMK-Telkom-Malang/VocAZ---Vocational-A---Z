// app/api/me/route.ts
import { NextResponse } from 'next/server'
import { cookies, headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    // Retry logic
    let session: any = null
    for (let i = 0; i < 3; i++) {
      const res = await fetch(`${protocol}://${host}/api/auth/get-session`, {
        headers: { Cookie: cookieHeader },
        cache: 'no-store',
      })

      if (res.ok) {
        const data = await res.json()
        if (data?.user?.id) {
          session = data
          break
        }
      }

      await new Promise((r) => setTimeout(r, 300))
    }

    if (!session?.user?.id) {
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