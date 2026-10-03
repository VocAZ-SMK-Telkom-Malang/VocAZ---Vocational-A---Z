// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()

  // Hapus semua cookie yang berhubungan dengan auth/session
  const allCookies = cookieStore.getAll()

  for (const cookie of allCookies) {
    const name = cookie.name.toLowerCase()
    if (
      name.includes('session') ||
      name.includes('auth') ||
      name.includes('token') ||
      name.includes('csrf') ||
      name.includes('callback')
    ) {
      cookieStore.delete(cookie.name)
    }
  }

  return NextResponse.json({ ok: true })
}