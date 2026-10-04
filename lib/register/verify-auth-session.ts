import { auth } from '@/lib/auth/server'

export async function verifyRegistrationSession(
  neonAuthUserId: string,
  email: string
): Promise<boolean> {
  const { data: session } = await auth.getSession()
  const sessionEmail = session?.user?.email

  return (
    session?.user?.id === neonAuthUserId &&
    typeof sessionEmail === 'string' &&
    sessionEmail.trim().toLowerCase() === email.trim().toLowerCase()
  )
}
