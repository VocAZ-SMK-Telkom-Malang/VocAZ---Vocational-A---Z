// app/auth/sign-in/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getDashboardPath } from '@/lib/auth/redirects'
import { SignInForm } from './_components/sign-in-form'

export const metadata = {
  title: 'Masuk - VocAZ',
  description: 'Masuk ke akun VocAZ kamu untuk mengakses dashboard dan layanan vokasi.',
}

export default async function SignInPage() {
  const session = await getServerSession()

  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: { role: true },
    })

    if (dbUser?.role) {
      redirect(getDashboardPath(dbUser.role))
    }
  }

  return <SignInForm />
}