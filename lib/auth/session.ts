import { headers, cookies } from 'next/headers'

export async function getServerSession() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  if (!cookieHeader) return null

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  try {
    const res = await fetch(`${protocol}://${host}/api/auth/get-session`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    })

    if (!res.ok) return null

    return res.json()
  } catch {
    return null
  }
}